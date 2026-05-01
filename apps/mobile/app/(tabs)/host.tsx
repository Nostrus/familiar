import { useAuth } from '@clerk/expo';
import { AuthView } from '@clerk/expo/native';
import type { Home } from '@org/types';
import { useEffect, useState } from 'react';
import { Modal, Pressable, TextInput, View } from 'react-native';
import { HomeList } from '../../components/HomeList';
import { Text } from '../../components/Themed';
import { API_URL } from '../../lib/api';

export default function HostScreen() {
  const { isSignedIn, getToken } = useAuth();
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingHome, setEditingHome] = useState<Home | null>(null);
  const [draft, setDraft] = useState({
    description: '',
    city: '',
    country: '',
    bedrooms: '1',
    bathrooms: '1',
    maxGuests: '1',
  });
  const [saving, setSaving] = useState(false);

  function handleEditHome(home: Home) {
    setEditingHome(home);
    setDraft({
      description: home.description ?? '',
      city: home.city ?? '',
      country: home.country ?? '',
      bedrooms: String(home.bedrooms ?? 1),
      bathrooms: String(home.bathrooms ?? 1),
      maxGuests: String(home.maxGuests ?? 1),
    });
  }

  async function handleSaveEdit() {
    if (!editingHome || !API_URL) return;

    try {
      setSaving(true);
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`${API_URL}/api/my-homes/${editingHome.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: draft.description,
          city: draft.city,
          country: draft.country,
          bedrooms: Number(draft.bedrooms),
          bathrooms: Number(draft.bathrooms),
          maxGuests: Number(draft.maxGuests),
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || 'Failed to update home');
      }

      const updatedHome = (await res.json()) as Home;
      setHomes((prev) => prev.map((home) => (home.id === updatedHome.id ? updatedHome : home)));
      setEditingHome(null);
    } catch (err) {
      console.error('Failed to update home:', err);
      setError('Failed to update home. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!isSignedIn) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/my-homes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch homes');
        setHomes(await res.json());
      } catch (err) {
        setError('Failed to load your homes. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn]);

  if (!isSignedIn) {
    return <AuthView mode="signInOrUp" />;
  }

  return (
    <>
      <HomeList
        homes={homes}
        vertical
        contentPadding={20}
        showEditButton
        onPressEdit={handleEditHome}
        ListHeaderComponent={
          loading ? (
            <Text className="text-center mt-10 text-gray-600">Loading...</Text>
          ) : error ? (
            <Text className="text-center mt-10 text-red-600">{error}</Text>
          ) : null
        }
        ListEmptyComponent={
          !loading && !error ? (
            <Text className="text-center mt-10 text-gray-500">You have no homes listed yet.</Text>
          ) : null
        }
      />

      <Modal
        visible={!!editingHome}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingHome(null)}
      >
        <View className="flex-1 justify-end bg-black/35">
          <View className="rounded-t-3xl bg-white p-5">
            <Text className="text-lg font-semibold text-slate-900 mb-4">Edit home</Text>

            <Text className="text-xs text-slate-500 mb-1">Description</Text>
            <TextInput
              value={draft.description}
              onChangeText={(value) => setDraft((prev) => ({ ...prev, description: value }))}
              className="mb-3 rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              placeholder="Describe your home"
              multiline
            />

            <Text className="text-xs text-slate-500 mb-1">City</Text>
            <TextInput
              value={draft.city}
              onChangeText={(value) => setDraft((prev) => ({ ...prev, city: value }))}
              className="mb-3 rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              placeholder="City"
            />

            <Text className="text-xs text-slate-500 mb-1">Country</Text>
            <TextInput
              value={draft.country}
              onChangeText={(value) => setDraft((prev) => ({ ...prev, country: value }))}
              className="mb-3 rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              placeholder="Country"
            />

            <View className="flex-row gap-2 mb-4">
              <View className="flex-1">
                <Text className="text-xs text-slate-500 mb-1">Beds</Text>
                <TextInput
                  value={draft.bedrooms}
                  onChangeText={(value) => setDraft((prev) => ({ ...prev, bedrooms: value }))}
                  keyboardType="number-pad"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-500 mb-1">Baths</Text>
                <TextInput
                  value={draft.bathrooms}
                  onChangeText={(value) => setDraft((prev) => ({ ...prev, bathrooms: value }))}
                  keyboardType="number-pad"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-500 mb-1">Guests</Text>
                <TextInput
                  value={draft.maxGuests}
                  onChangeText={(value) => setDraft((prev) => ({ ...prev, maxGuests: value }))}
                  keyboardType="number-pad"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                />
              </View>
            </View>

            <View className="flex-row justify-end gap-2">
              <Pressable
                onPress={() => setEditingHome(null)}
                className="rounded-lg border border-slate-300 px-4 py-2"
              >
                <Text className="text-slate-700">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveEdit}
                disabled={saving}
                className="rounded-lg bg-primary px-4 py-2"
              >
                <Text className="text-white font-medium">{saving ? 'Saving...' : 'Save'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
