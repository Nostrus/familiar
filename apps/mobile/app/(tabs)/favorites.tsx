import { Text, View } from '@/components/Themed';
import { useAuth } from '@clerk/expo';
import { AuthView } from '@clerk/expo/native';
import type { Home } from '@org/types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { HomeList } from '../../components/HomeList';
import { API_URL } from '../../lib/api';

export default function FavoritesScreen() {
  const { isSignedIn, getToken, isLoaded } = useAuth({ treatPendingAsSignedOut: false });
  const getTokenRef = useRef(getToken);
  const [favorites, setFavorites] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  const loadFavorites = useCallback(async () => {
    if (!isSignedIn) {
      setFavorites([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = await getTokenRef.current();
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
      setError(err instanceof Error ? err.message : 'Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  function handleFavoriteChanged(homeId: number, isFavorited: boolean) {
    if (!isFavorited) {
      setFavorites((prev) => prev.filter((home) => home.id !== homeId));
      return;
    }

    // If a toggle is rolled back to favorited, reload from server to restore consistency.
    void loadFavorites();
  }

  useFocusEffect(
    useCallback(() => {
      void loadFavorites();
    }, [loadFavorites]),
  );

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

  const favoriteCount = favorites.length;

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
        <View className="mt-4 mb-2">
          <Text className="text-sm text-slate-600">
            You have favorited {favoriteCount} {favoriteCount === 1 ? 'home' : 'homes'}.
          </Text>
          {error ? <Text className="text-center mt-4 text-red-600">{error}</Text> : null}
          {loading ? (
            <View className="flex-1 justify-center items-center mt-8">
              <ActivityIndicator size="large" />
            </View>
          ) : null}
        </View>
      }
    />
  );
}
