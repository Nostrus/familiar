import { Text, View } from '@/components/Themed';
import { useAuth } from '@clerk/expo';
import { AuthView } from '@clerk/expo/native';
import type { Home } from '@org/types';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { HomeList } from '../../components/HomeList';
import { API_URL } from '../../lib/api';

export default function FavoritesScreen() {
  const { isSignedIn, getToken, isLoaded } = useAuth({ treatPendingAsSignedOut: false });
  const [favorites, setFavorites] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function handleFavoriteChanged(homeId: number, isFavorited: boolean) {
    if (!isFavorited) {
      setFavorites((prev) => prev.filter((home) => home.id !== homeId));
    }
  }

  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center mt-40">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <AuthView mode="signInOrUp" />;
  }

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

  return (
    <HomeList
      homes={favorites}
      vertical
      contentPadding={20}
      favoriteHomeIds={favorites.map((home) => home.id)}
      onFavoriteChanged={handleFavoriteChanged}
      ListEmptyComponent={
        loading ? null : <Text className="text-center mt-10 text-gray-500">No favorites yet.</Text>
      }
      ListHeaderComponent={
        error ? (
          <Text className="text-center mt-10 text-red-600">{error}</Text>
        ) : loading ? (
          <View className="flex-1 justify-center items-center mt-40">
            <ActivityIndicator size="large" />
          </View>
        ) : null
      }
    />
  );
}
