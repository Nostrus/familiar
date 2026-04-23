import { getAmenity } from '@/lib/amenities';

type HomeAmenitiesProps = {
  amenities: string[];
};

export function HomeAmenities({ amenities }: HomeAmenitiesProps) {
  return (
    <div className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Amenities</h2>
      {amenities.length > 0 ? (
        <div className="grid grid-cols-2 gap-0 sm:grid-cols-3 lg:grid-cols-4">
          {amenities.map((amenity) => {
            const amenityInfo = getAmenity(amenity);
            const Icon = amenityInfo.icon;
            return (
              <div key={amenity} className="flex items-center gap-3  p-0">
                {Icon && <Icon className="h-4 w-4 text-slate-400" />}
                <span className="text-sm font-medium text-slate-700">{amenityInfo.label}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-slate-600">No amenities listed.</p>
      )}
    </div>
  );
}
