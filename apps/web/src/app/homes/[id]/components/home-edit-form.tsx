'use client';

import { Home } from '@/db/schema';
import { AMENITIES, AmenityKey } from '@/lib/amenities';
import Image from 'next/image';
import { useRef, useState, useTransition } from 'react';
import { removeHomePhoto, updateHome, uploadHomePhoto } from '../edit-actions';

type Props = {
  home: Pick<Home, 'id' | 'description' | 'city' | 'country' | 'amenities' | 'photos'>;
};

export function HomeEditForm({ home }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [uploadPending, setUploadPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(home.amenities);
  const fileRef = useRef<HTMLInputElement>(null);

  function toggleAmenity(key: string) {
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key],
    );
  }

  function handleAction(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await updateHome(formData);
        setOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save.');
      }
    });
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setUploadPending(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('homeId', String(home.id));
      fd.append('photo', file);
      await uploadHomePhoto(fd);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploadPending(false);
      if (fileRef.current) {
        fileRef.current.value = '';
      }
    }
  }

  async function handleRemovePhoto(url: string) {
    setError(null);
    try {
      await removeHomePhoto(home.id, url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove photo.');
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        Edit home
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Edit home</h2>
        <button
          onClick={() => setOpen(false)}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>

      <form action={handleAction} className="space-y-5">
        <input type="hidden" name="homeId" value={home.id} />
        {selectedAmenities.map((a) => (
          <input key={a} type="hidden" name="amenities" value={a} />
        ))}

        {/* Description */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            name="description"
            defaultValue={home.description}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
            <input
              name="city"
              defaultValue={home.city}
              type="text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Country</label>
            <input
              name="country"
              defaultValue={home.country}
              type="text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Amenities</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(Object.values(AMENITIES) as { key: AmenityKey; label: string }[]).map(
              ({ key, label }) => {
                const checked = selectedAmenities.includes(key);
                return (
                  <label
                    key={key}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                      checked
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleAmenity(key)}
                    />
                    <span
                      className={`h-2 w-2 rounded-full ${checked ? 'bg-blue-500' : 'bg-slate-300'}`}
                    />
                    {label}
                  </label>
                );
              },
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60"
        >
          {isPending ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      {/* Photos */}
      <div className="mt-8 border-t border-slate-100 pt-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Photos</h3>

        {home.photos.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {home.photos.map((url) => (
              <div key={url} className="group relative aspect-square overflow-hidden rounded-lg">
                <Image src={url} alt="Home photo" fill className="object-cover" />
                <button
                  onClick={() => handleRemovePhoto(url)}
                  className="absolute right-1 top-1 hidden rounded-full bg-black/60 p-1 text-white transition group-hover:flex items-center justify-center"
                  aria-label="Remove photo"
                >
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
                    <path
                      d="M1 1l10 10M11 1L1 11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-400 hover:text-slate-800">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handlePhotoUpload}
            disabled={uploadPending}
          />
          {uploadPending ? 'Uploading…' : '+ Add photo'}
        </label>
      </div>
    </div>
  );
}
