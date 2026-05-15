import { getCities } from '@org/db';
import { DiscoverFilter } from './discover-filter';

const MAX_CITIES = 20;

export async function DiscoverFilterSection() {
  const citiesData = await getCities({ limit: MAX_CITIES });
  const allCityNames = citiesData.map((city) => city.city);

  return <DiscoverFilter allCities={allCityNames} />;
}
