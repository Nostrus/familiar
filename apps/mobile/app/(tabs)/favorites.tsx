import { useAuth } from '@clerk/expo';
import { AuthView } from '@clerk/expo/native';
import type { Home } from '@org/types';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { HomeList } from '../../components/HomeList';
import { Text } from '../../components/Themed';
import { API_URL } from '../../lib/api';

export default function FavoritesScreen() {
  const { isSignedIn, getToken } = useAuth();
  const [favorites, setFavorites] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/my-favorites`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
          const body = await res.text();
          console.error('Response status:', res.status, body);
          throw new Error(`Failed to fetch favorites: ${res.status} ${body}`);
        }
        setFavorites(await res.json());
      } catch (err) {
        console.error('Favorites fetch error:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load favorites. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn]);

  if (!isSignedIn) {
    return <AuthView mode="signInOrUp" />;
  }

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, overflow: 'visible' }}>
      {loading && <Text className="text-center mt-10 text-gray-600">Loading...</Text>}
      {error && <Text className="text-center mt-10 text-red-600">{error}</Text>}
      {!loading && !error && favorites.length === 0 && (
        <Text className="text-center mt-10 text-gray-500">No favorites yet.</Text>
      )}
      {!loading && !error && favorites.length > 0 && <HomeList homes={favorites} />}
    </ScrollView>
  );
}
