import { Bath, Bed, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type HomeCardData = {
  id: number;
  city: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  photos?: string[] | null;
};

type HomeCardProps = {
  home: HomeCardData;
  preferPhoto?: boolean;
  showLocation?: boolean;
};

export function HomeCard({ home, preferPhoto = false, showLocation = true }: HomeCardProps) {
  const photoUrl = preferPhoto ? home.photos?.[0] : null;

  return (
    <Link
      href={`/homes/${home.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 transition-all hover:border-primary hover:shadow-lg"
    >
      <div className="border-b border-slate-100 px-6 py-4">
        {showLocation ? (
          <p className="mb-1 text-xs font-semibold text-primary">
            {home.city}, {home.country}
          </p>
        ) : null}
        <div className="flex items-center gap-4 text-sm text-slate-700">
          <span className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-slate-400" />
            {home.bedrooms} {home.bedrooms === 1 ? 'bed' : 'beds'}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-slate-400" />
            {home.bathrooms} {home.bathrooms === 1 ? 'bathroom' : 'bathrooms'}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-slate-400" />
            {home.maxGuests} {home.maxGuests === 1 ? 'guest' : 'guests'}
          </span>
        </div>
      </div>

      <div className="relative h-60 bg-slate-100">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={`Home in ${home.city}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="h-60 w-full bg-linear-to-br from-slate-200 to-slate-300" />
        )}
      </div>
    </Link>
  );
}
