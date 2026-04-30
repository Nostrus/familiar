import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { HomeList } from '../../components/HomeList';
import { Text } from '../../components/Themed';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface FeaturedHome {
  id: number;
  city: string;
  country: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  photos: string[];
  imageUrl?: string;
  title?: string;
  location?: string;
  price?: number;
}

interface HomesByCity {
  [city: string]: FeaturedHome[];
}

export default function DiscoverScreen() {
  const [homesByCity, setHomesByCity] = useState<HomesByCity>({});
  const [featured, setFeatured] = useState<FeaturedHome[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [homesRes, featuredRes] = await Promise.all([
          fetch(`${API_URL}/api/homes`),
          fetch(`${API_URL}/api/featured-homes`),
        ]);

        if (!homesRes.ok || !featuredRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [homesData, featuredData] = await Promise.all([homesRes.json(), featuredRes.json()]);

        setHomesByCity(homesData);
        setFeatured(featuredData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, overflow: 'visible' }}>
      {loading && <Text className="text-center mt-10 text-gray-600">Loading...</Text>}

      {error && <Text className="text-center mt-10 text-red-600">{error}</Text>}

      {!loading && !error && (
        <>
          <Text className="font-bold text-xl mb-3">Featured Homes</Text>
          <View className="mb-8">
            <HomeList homes={featured} />
          </View>

          {Object.entries(homesByCity).map(([cityName, homes]) => (
            <View key={cityName} className="mb-8">
              <Text className="font-bold text-xl mb-3">{cityName}</Text>
              <HomeList homes={homes} />
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}
