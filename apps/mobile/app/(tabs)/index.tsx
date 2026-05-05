import { useAuth } from '@clerk/expo';
import type { Home, HomesByCity } from '@org/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import {
  DiscoverFilters,
  type DiscoverFiltersHandle,
  type DiscoverFiltersValue,
} from '../../components/DiscoverFilters';
import { HomeList } from '../../components/HomeList';
import { Text } from '../../components/Themed';
import { API_URL } from '../../lib/api';

const EMPTY_FILTERS: DiscoverFiltersValue = {
  cities: [],
  from: '',
  to: '',
  guests: '',
};

function hasFilters(filters: DiscoverFiltersValue) {
  return (
    filters.cities.length > 0 ||
    filters.from.trim().length > 0 ||
    filters.to.trim().length > 0 ||
    filters.guests.trim().length > 0
  );
}

function buildHomesUrl(filters: DiscoverFiltersValue) {
  const params = new URLSearchParams();

  if (filters.cities.length > 0) {
    params.set('cities', filters.cities.join(','));
  }
  if (filters.from.trim()) {
    params.set('dateFrom', filters.from.trim());
  }
  if (filters.to.trim()) {
    params.set('dateTo', filters.to.trim());
  }
  if (filters.guests.trim()) {
    params.set('guests', filters.guests.trim());
  }

  const query = params.toString();
  return query ? `${API_URL}/api/homes?${query}` : `${API_URL}/api/homes`;
}

export default function DiscoverScreen() {
  const { isSignedIn, getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  const filtersRef = useRef<DiscoverFiltersHandle>(null);
  const [homesByCity, setHomesByCity] = useState<HomesByCity<Home>>({});
  const [featured, setFeatured] = useState<Home[]>([]);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [draftFilters, setDraftFilters] = useState<DiscoverFiltersValue>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<DiscoverFiltersValue>(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteHomeIds, setFavoriteHomeIds] = useState<number[]>([]);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  const loadFavoriteIds = useCallback(async () => {
    if (!isSignedIn) {
      setFavoriteHomeIds([]);
      return;
    }
    try {
      const token = await getTokenRef.current();
      if (!token) return;
      const res = await fetch(`${API_URL}/api/my-favorites`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) return;
      const data = (await res.json()) as Array<{ id: number }>;
      setFavoriteHomeIds(data.map((h) => h.id));
    } catch {
      // silently ignore — favorites overlay is non-critical
    }
  }, [isSignedIn]);

  useEffect(() => {
    void loadFavoriteIds();
  }, [loadFavoriteIds]);

  function handleFavoriteChanged(homeId: number, isFavorited: boolean) {
    setFavoriteHomeIds((prev) =>
      isFavorited ? [...prev, homeId] : prev.filter((id) => id !== homeId),
    );
  }

  useEffect(() => {
    (async () => {
      try {
        const citiesRes = await fetch(`${API_URL}/api/cities?limit=20`);
        if (!citiesRes.ok) {
          throw new Error('Failed to fetch cities');
        }

        const citiesData = (await citiesRes.json()) as Array<{ city: string }>;
        setAllCities(citiesData.map((city) => city.city));
      } catch (err) {
        console.error('Error fetching cities:', err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const homesRes = await fetch(buildHomesUrl(appliedFilters));
        if (!homesRes.ok) {
          throw new Error('Failed to fetch homes');
        }

        const homesData = (await homesRes.json()) as HomesByCity<Home>;
        setHomesByCity(homesData);

        if (hasFilters(appliedFilters)) {
          setFeatured([]);
          return;
        }

        const featuredRes = await fetch(`${API_URL}/api/featured-homes`);
        if (!featuredRes.ok) {
          throw new Error('Failed to fetch featured homes');
        }

        const featuredData = (await featuredRes.json()) as Home[];
        setFeatured(featuredData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [appliedFilters]);

  const hasAppliedFilters = hasFilters(appliedFilters);
  const cityEntries = Object.entries(homesByCity);

  function applyFilters() {
    setAppliedFilters(draftFilters);
  }

  function clearFilters() {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 20, overflow: 'visible' }}
      onTouchStart={() => filtersRef.current?.closePopovers()}
      onScrollBeginDrag={() => filtersRef.current?.closePopovers()}
    >
      <DiscoverFilters
        ref={filtersRef}
        allCities={allCities}
        value={draftFilters}
        hasAppliedFilters={hasAppliedFilters}
        onChange={setDraftFilters}
        onApply={applyFilters}
        onClear={clearFilters}
      />

      {loading && (
        <View className="flex-1 justify-center items-center mt-40">
          <ActivityIndicator size="large" />
        </View>
      )}

      {error && <Text className="text-center mt-10 text-red-600">{error}</Text>}

      {!loading && !error && (
        <>
          {!hasAppliedFilters && (
            <>
              <Text className="font-bold text-xl mb-3">Featured Homes</Text>
              <View className="mb-8">
                <HomeList
                  homes={featured}
                  favoriteHomeIds={favoriteHomeIds}
                  onFavoriteChanged={handleFavoriteChanged}
                />
              </View>
            </>
          )}

          {hasAppliedFilters && cityEntries.length === 0 && (
            <View className="items-center py-8">
              <Text className="text-lg font-semibold text-slate-900">
                No homes match your filters.
              </Text>
              <Text className="mt-1 text-slate-600 text-center">
                Try adjusting the date range, guests, or selected cities.
              </Text>
            </View>
          )}

          {cityEntries.map(([cityName, homes]) => (
            <View key={cityName} className="mb-8">
              <Text className="font-bold text-xl mb-3">{cityName}</Text>
              <HomeList
                homes={homes}
                favoriteHomeIds={favoriteHomeIds}
                onFavoriteChanged={handleFavoriteChanged}
              />
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}
