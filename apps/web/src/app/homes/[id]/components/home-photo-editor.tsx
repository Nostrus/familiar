'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { removeHomePhoto, uploadHomePhoto } from '../actions';

type Props = {
  homeId: number;
  initialPhotos: string[];
};

export function HomePhotoEditor({ homeId, initialPhotos }: Props) {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [uploadPending, setUploadPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);

    if (files.length === 0) return;

    const oversized = files.filter((f) => f.size > 5 * 1024 * 1024);

    if (oversized.length > 0) {
      setError('Each image must be 5 MB or smaller.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    setUploadPending(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append('homeId', String(homeId));
      files.forEach((file) => fd.append('photos', file));
      const result = await uploadHomePhoto(fd);
      if (result.urls.length > 0) {
        setPhotos((prev) => [...prev, ...result.urls]);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploadPending(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function handleRemovePhoto(url: string) {
    setError(null);
    try {
      await removeHomePhoto(homeId, url);
      setPhotos((prev) => prev.filter((photo) => photo !== url));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove photo.');
    }
  }

  return (
    <div className="mt-8 border-t border-slate-100 pt-6">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Photos</h3>

      {photos.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((url) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={url}
                alt="Home photo"
                fill
                sizes="(max-width: 640px) 33vw, 25vw"
                className="object-cover"
              />
              <button
                onClick={() => handleRemovePhoto(url)}
                className="absolute right-1 top-1 hidden rounded-full bg-black/60 p-1 text-white transition group-hover:flex items-center justify-center"
                aria-label="Remove photo"
              >
                <X className="h-3 w-3" strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-400 hover:text-slate-800">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={handlePhotoUpload}
          disabled={uploadPending}
        />
        {uploadPending ? 'Uploading…' : '+ Add photos'}
      </label>
    </div>
  );
}
