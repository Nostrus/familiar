import { useAuth } from '@clerk/expo';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { Home } from '@org/types';
import { useEffect, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { Text } from '../components/Themed';
import { API_URL } from '../lib/api';

export type HomeCardProps = {
  home: Home;
  fullWidth?: boolean;
  showEditButton?: boolean;
  onPressEdit?: (home: Home) => void;
  showFavoriteButton?: boolean;
  isFavorited?: boolean;
  onFavoriteChanged?: (homeId: number, isFavorited: boolean) => void;
};

export function HomeCard({
  home,
  fullWidth = false,
  showEditButton = false,
  onPressEdit,
  showFavoriteButton = true,
  isFavorited = false,
  onFavoriteChanged,
}: HomeCardProps) {
  const { isSignedIn, getToken } = useAuth();
  const [favorited, setFavorited] = useState(isFavorited);
  const [togglingFavorite, setTogglingFavorite] = useState(false);

  useEffect(() => {
    setFavorited(isFavorited);
  }, [isFavorited]);

  async function handleToggleFavorite() {
    if (!isSignedIn || togglingFavorite || !API_URL) return;

    try {
      setTogglingFavorite(true);
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/api/toggle-favorite`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ homeId: home.id }),
      });

      if (!res.ok) {
        throw new Error('Failed to toggle favorite');
      }

      const data = (await res.json()) as { isFavorited: boolean };
      setFavorited(data.isFavorited);
      onFavoriteChanged?.(home.id, data.isFavorited);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    } finally {
      setTogglingFavorite(false);
    }
  }

  return (
    <View
      className="rounded-2xl bg-white mr-6 p-3 my-4 shadow-sm border-gray-100 border"
      style={{ width: fullWidth ? '100%' : 220 }}
    >
      <View className="relative">
        <Image
          source={{ uri: home.photos[0] || 'https://placehold.co/220x120' }}
          className="w-full rounded-xl mb-2"
          style={{ height: fullWidth ? 200 : 120 }}
        />
        {showFavoriteButton ? (
          <Pressable
            onPress={handleToggleFavorite}
            disabled={!isSignedIn || togglingFavorite}
            className="absolute top-2 right-2 rounded-full bg-white/95 p-2"
          >
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={16}
              color={favorited ? '#e11d48' : '#64748b'}
            />
          </Pressable>
        ) : null}
      </View>
      <Text className="text-xs font-semibold text-primary mb-1">
        {home.city}, {home.country}
      </Text>
      <View className="flex-row items-center gap-3 mt-1">
        <View className="flex-row items-center gap-1">
          <Feather name="home" size={13} color="#94a3b8" />
          <Text className="text-sm text-slate-700">
            {home.bedrooms} {home.bedrooms === 1 ? 'bed' : 'beds'}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Feather name="droplet" size={13} color="#94a3b8" />
          <Text className="text-sm text-slate-700">
            {home.bathrooms} {home.bathrooms === 1 ? 'bath' : 'baths'}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Feather name="users" size={13} color="#94a3b8" />
          <Text className="text-sm text-slate-700">
            {home.maxGuests} {home.maxGuests === 1 ? 'guest' : 'guests'}
          </Text>
        </View>
      </View>
      {showEditButton && onPressEdit ? (
        <Pressable
          onPress={() => onPressEdit(home)}
          className="mt-3 self-start rounded-lg border border-slate-300 bg-white px-3 py-2"
        >
          <Text className="text-sm font-medium text-slate-700">Edit home</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
