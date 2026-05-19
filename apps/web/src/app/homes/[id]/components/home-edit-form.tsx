'use client';

import { AMENITIES, AmenityKey } from '@/lib/amenities';
import type { CitySummary, Home } from '@org/types';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { updateHome } from '../actions';
import { HomePhotoEditor } from './home-photo-editor';

type Props = {
  home: Pick<Home, 'id' | 'description' | 'city' | 'country' | 'amenities' | 'photos'>;
  cities?: CitySummary[];
  defaultOpen?: boolean;
  onClose?: () => void;
};

export function HomeEditForm({ home, cities = [], defaultOpen = false, onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(defaultOpen);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultOpen) setOpen(true);
  }, [defaultOpen]);

  useEffect(() => {
    if (open) {
      containerRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    }
  }, [open]);

  function close() {
    setOpen(false);
    onClose?.();
    router.replace(pathname);
  }
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(home.amenities);
  const [selectedCity, setSelectedCity] = useState<CitySummary>(
    cities.find((c) => c.city === home.city) ?? cities[0],
  );
  function toggleAmenity(key: string) {
    setSelectedAmenities((items) =>
      items.includes(key) ? items.filter((a) => a !== key) : [...items, key],
    );
  }

  function handleAction(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await updateHome(formData);
        close();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save.');
      }
    });
  }

  if (!open) return null;

  return (
    <div ref={containerRef} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Edit home</h2>
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
            required
            defaultValue={home.description}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
            <select
              name="city"
              required
              value={selectedCity.city}
              onChange={(e) => setSelectedCity(cities.find((c) => c.city === e.target.value)!)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {cities.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Country</label>
            <p className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 select-none">
              {selectedCity.country}
            </p>
            <input type="hidden" name="country" value={selectedCity.country} />
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

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={close}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60"
          >
            {isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>

      <HomePhotoEditor homeId={home.id} initialPhotos={home.photos} />
    </div>
  );
}
