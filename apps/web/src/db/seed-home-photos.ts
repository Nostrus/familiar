import { put } from '@vercel/blob';
import dotenv from 'dotenv';
import { asc, eq } from 'drizzle-orm';
import fs from 'node:fs/promises';
import path from 'node:path';
import { db } from './index';
import { homes } from './schema';

dotenv.config({ path: '.env.local' });
dotenv.config();

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

const photosDir = process.env.HOME_PHOTOS_DIR
  ? path.resolve(process.cwd(), process.env.HOME_PHOTOS_DIR)
  : path.resolve(process.cwd(), 'public/assets/home-samples');

const blobPrefix = process.env.HOME_PHOTOS_BLOB_PREFIX ?? 'home-samples';

const photosPerHome = Number.parseInt(process.env.HOME_PHOTOS_PER_HOME ?? '3', 10);

type StyleImageSet = {
  style: string;
  relativePaths: string[];
};

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function getContentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.avif') return 'image/avif';
  return 'application/octet-stream';
}

function toBlobPath(relativePath: string): string {
  const normalized = relativePath.split(path.sep).join('/');
  const ext = path.extname(normalized).toLowerCase();
  const withoutExt = ext.length > 0 ? normalized.slice(0, -ext.length) : normalized;
  const safeBase = withoutExt
    .replace(/[^a-zA-Z0-9/_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-/]+|[-/]+$/g, '');
  const hash = hashString(normalized).toString(16).padStart(8, '0');
  return `${blobPrefix}/${safeBase}-${hash}${ext}`;
}

async function uploadImagesToBlob(relativePaths: string[]): Promise<Map<string, string>> {
  const uploadMap = new Map<string, string>();

  for (const relativePath of relativePaths) {
    const absolutePath = path.join(photosDir, relativePath);
    const fileBuffer = await fs.readFile(absolutePath);
    const blob = await put(toBlobPath(relativePath), fileBuffer, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: getContentType(relativePath),
    });
    uploadMap.set(relativePath, blob.url);
  }

  return uploadMap;
}

async function collectImagesRecursively(
  directory: string,
  baseDirectory: string,
): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const collected: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectImagesRecursively(fullPath, baseDirectory);
      collected.push(...nested);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (!IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      continue;
    }

    collected.push(path.relative(baseDirectory, fullPath));
  }

  return collected.sort((a, b) => a.localeCompare(b));
}

async function getStyleImageSets(directory: string): Promise<StyleImageSet[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const styles: StyleImageSet[] = [];
  const rootFiles: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      const relativePaths = await collectImagesRecursively(fullPath, directory);
      if (relativePaths.length > 0) {
        styles.push({ style: entry.name, relativePaths });
      }
      continue;
    }

    if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      rootFiles.push(entry.name);
    }
  }

  if (rootFiles.length > 0) {
    styles.push({
      style: 'root',
      relativePaths: rootFiles.sort((a, b) => a.localeCompare(b)),
    });
  }

  return styles.sort((a, b) => a.style.localeCompare(b.style));
}

function buildCityStyleMap(
  cities: string[],
  styleSets: StyleImageSet[],
): Map<string, StyleImageSet> {
  const normalizedCities = Array.from(
    new Set(cities.map((city) => city.trim().toLowerCase())),
  ).sort((a, b) => a.localeCompare(b));

  const cityStyleMap = new Map<string, StyleImageSet>();
  normalizedCities.forEach((city, index) => {
    cityStyleMap.set(city, styleSets[index % styleSets.length]);
  });

  return cityStyleMap;
}

function buildPhotosForHome(relativePaths: string[], homeId: number, perHome: number): string[] {
  const start = hashString(String(homeId)) % relativePaths.length;
  const selected: string[] = [];

  for (let i = 0; i < perHome; i++) {
    const relativePath = relativePaths[(start + i) % relativePaths.length];
    selected.push(relativePath);
  }

  return selected;
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is not set. Add it to apps/web/.env.local (or export it in your shell) and rerun db:seed:photos.',
    );
  }

  if (!Number.isInteger(photosPerHome) || photosPerHome <= 0) {
    throw new Error('HOME_PHOTOS_PER_HOME must be a positive integer.');
  }

  const styleImageSets = await getStyleImageSets(photosDir);
  if (styleImageSets.length === 0) {
    throw new Error(
      `No images found in ${photosDir}. Add images with one of these extensions: ${Array.from(IMAGE_EXTENSIONS).join(', ')}`,
    );
  }

  const uniqueRelativePaths = Array.from(
    new Set(styleImageSets.flatMap((styleSet) => styleSet.relativePaths)),
  ).sort((a, b) => a.localeCompare(b));

  const uploadedUrlsByRelativePath = await uploadImagesToBlob(uniqueRelativePaths);

  const homeRows = await db
    .select({ id: homes.id, city: homes.city })
    .from(homes)
    .orderBy(asc(homes.id));
  if (homeRows.length === 0) {
    console.info('No homes found. Run db:seed first.');
    return;
  }

  const cityStyleMap = buildCityStyleMap(
    homeRows.map((home) => home.city),
    styleImageSets,
  );

  const updatesByStyle = new Map<string, number>();

  for (const home of homeRows) {
    const normalizedCity = home.city.trim().toLowerCase();
    const styleSet = cityStyleMap.get(normalizedCity);

    if (!styleSet) {
      throw new Error(`No style mapping found for city: ${home.city}`);
    }

    const relativePhotoPaths = buildPhotosForHome(styleSet.relativePaths, home.id, photosPerHome);
    const photoUrls = relativePhotoPaths.map((relativePath) => {
      const uploadedUrl = uploadedUrlsByRelativePath.get(relativePath);
      if (!uploadedUrl) {
        throw new Error(`Missing uploaded URL for ${relativePath}`);
      }
      return uploadedUrl;
    });

    await db
      .update(homes)
      .set({ photos: photoUrls, updatedAt: new Date() })
      .where(eq(homes.id, home.id));

    updatesByStyle.set(styleSet.style, (updatesByStyle.get(styleSet.style) ?? 0) + 1);
  }

  const styleSummary = Array.from(updatesByStyle.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([style, count]) => `${style}:${count}`)
    .join(', ');

  console.info(
    `Uploaded ${uploadedUrlsByRelativePath.size} source image(s) to Vercel Blob and updated ${homeRows.length} homes with ${photosPerHome} photo(s) each. City->style mapping: ${styleSummary}`,
  );
}

main().catch((error) => {
  console.error('Home photo seed failed.');
  console.error(error);
  process.exit(1);
});
