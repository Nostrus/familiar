import { useAuth } from '@clerk/expo';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { Home, HomeAvailability } from '@org/types';
import { formatDate } from '@org/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, View } from 'react-native';
import { Text } from '../../components/Themed';
import { getAmenity } from '../../lib/amenities';
import { API_URL } from '../../lib/api';

type HomeDetail = Home & { availability: HomeAvailability[] };

export default function HomeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();

  const [home, setHome] = useState<HomeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/api/homes/${id}`);
        if (!res.ok) throw new Error('Home not found');
        setHome(await res.json());
      } catch {
        setError('Failed to load home. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id || !isSignedIn || !API_URL) {
      setFavorited(false);
      return;
    }

    (async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch(`${API_URL}/api/my-favorites`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          return;
        }

        const favorites = (await res.json()) as Array<{ id: number }>;
        const homeId = Number(id);
        setFavorited(favorites.some((favoriteHome) => favoriteHome.id === homeId));
      } catch {
        // ignore
      }
    })();
  }, [id, isSignedIn, getToken]);

  async function handleToggleFavorite() {
    if (!isSignedIn || togglingFavorite || !API_URL) return;
    try {
      setTogglingFavorite(true);
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${API_URL}/api/toggle-favorite`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeId: Number(id) }),
      });
      if (res.ok) {
        const data = (await res.json()) as { isFavorited: boolean };
        setFavorited(data.isFavorited);
      }
    } catch {
      // ignore
    } finally {
      setTogglingFavorite(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !home) {
    return (
      <View className="flex-1 justify-center items-center px-8">
        <Text className="text-center text-red-600 mb-4">{error ?? 'Home not found.'}</Text>
        <Pressable onPress={() => router.back()} className="rounded-lg bg-primary px-4 py-2">
          <Text className="text-white font-medium">Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Photo */}
      <View className="relative">
        <Image
          source={{ uri: home.photos[0] || 'https://placehold.co/400x240' }}
          style={{ width: '100%', height: 280 }}
          resizeMode="cover"
        />
        {isSignedIn ? (
          <Pressable
            onPress={handleToggleFavorite}
            disabled={togglingFavorite}
            className="absolute top-4 right-4 rounded-full bg-white/95 p-3"
          >
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={20}
              color={favorited ? '#e11d48' : '#64748b'}
            />
          </Pressable>
        ) : null}
      </View>

      <View className="px-5 pt-4 pb-10">
        {/* Title & location */}
        <Text className="text-2xl font-bold text-slate-900 mb-1">{home.description}</Text>
        <View className="flex-row items-center gap-1 mb-4">
          <Feather name="map-pin" size={14} color="#94a3b8" />
          <Text className="text-base text-slate-500">
            {home.city}, {home.country}
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-row gap-4 mb-6 bg-slate-50 rounded-2xl p-4">
          <View className="flex-1 items-center gap-1">
            <Feather name="home" size={20} color="#64748b" />
            <Text className="text-lg font-bold text-slate-900">{home.bedrooms}</Text>
            <Text className="text-xs text-slate-500">{home.bedrooms === 1 ? 'bed' : 'beds'}</Text>
          </View>
          <View className="w-px bg-slate-200" />
          <View className="flex-1 items-center gap-1">
            <Feather name="droplet" size={20} color="#64748b" />
            <Text className="text-lg font-bold text-slate-900">{home.bathrooms}</Text>
            <Text className="text-xs text-slate-500">
              {home.bathrooms === 1 ? 'bath' : 'baths'}
            </Text>
          </View>
          <View className="w-px bg-slate-200" />
          <View className="flex-1 items-center gap-1">
            <Feather name="users" size={20} color="#64748b" />
            <Text className="text-lg font-bold text-slate-900">{home.maxGuests}</Text>
            <Text className="text-xs text-slate-500">
              {home.maxGuests === 1 ? 'guest' : 'guests'}
            </Text>
          </View>
        </View>

        {/* Amenities */}
        {home.amenities && home.amenities.length > 0 ? (
          <View className="mb-6">
            <Text className="text-lg font-bold text-slate-900 mb-3">Amenities</Text>
            <View className="flex-row flex-wrap gap-2">
              {home.amenities.map((amenity) => {
                const amenityInfo = getAmenity(amenity);
                return (
                  <View
                    key={amenity}
                    className="flex-row items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1.5"
                  >
                    {amenityInfo.icon ? (
                      <Feather name={amenityInfo.icon} size={12} color="#64748b" />
                    ) : (
                      <Feather name="check" size={12} color="#10b981" />
                    )}
                    <Text className="text-sm text-slate-700">{amenityInfo.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {/* Availability */}
        {home.availability && home.availability.length > 0 ? (
          <View className="mb-6">
            <Text className="text-lg font-bold text-slate-900 mb-3">Available dates</Text>
            <View className="gap-2">
              {home.availability.map((range) => (
                <View
                  key={range.id}
                  className="flex-row items-center gap-2 bg-emerald-50 rounded-xl px-4 py-3"
                >
                  <Feather name="calendar" size={16} color="#10b981" />
                  <Text className="text-sm text-emerald-800 font-medium">
                    {formatDate(range.startDate)} – {formatDate(range.endDate)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View className="mb-6">
            <Text className="text-lg font-bold text-slate-900 mb-3">Available dates</Text>
            <Text className="text-slate-500">No availability dates set.</Text>
          </View>
        )}

        {/* Additional photos */}
        {home.photos.length > 1 ? (
          <View className="mb-6">
            <Text className="text-lg font-bold text-slate-900 mb-3">Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {home.photos.slice(1).map((photo, i) => (
                  <Image
                    key={i}
                    source={{ uri: photo }}
                    style={{ width: 160, height: 120, borderRadius: 12 }}
                    resizeMode="cover"
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
