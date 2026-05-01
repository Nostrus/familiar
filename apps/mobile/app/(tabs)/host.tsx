import { useAuth } from '@clerk/expo';
import { AuthView } from '@clerk/expo/native';
import Feather from '@expo/vector-icons/Feather';
import type { Home, IncomingStayRequest } from '@org/types';
import { useEffect, useState } from 'react';
import { FlatList, SectionList, View } from 'react-native';
import { HomeEditModal, type HomeEditDraft } from '../../components/HomeEditModal';
import { HomeList } from '../../components/HomeList';
import { Text } from '../../components/Themed';
import { API_URL } from '../../lib/api';

const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-700' },
  approved: { label: 'Approved', bg: 'bg-green-100', text: 'text-green-700' },
  rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-600' },
} as const;

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function HostScreen() {
  const { isSignedIn, getToken } = useAuth();
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [incomingRequests, setIncomingRequests] = useState<IncomingStayRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [editingHome, setEditingHome] = useState<Home | null>(null);
  const [draft, setDraft] = useState<HomeEditDraft>({
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
      } catch {
        setError('Failed to load your homes. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn]);

  useEffect(() => {
    if (!isSignedIn) return;
    (async () => {
      try {
        setRequestsLoading(true);
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/my-homes/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setIncomingRequests(await res.json());
      } catch {
        // non-critical, ignore
      } finally {
        setRequestsLoading(false);
      }
    })();
  }, [isSignedIn]);

  if (!isSignedIn) {
    return <AuthView mode="signInOrUp" />;
  }

  const sections = [
    {
      key: 'homes',
      data: ['homes'] as const,
    },
    {
      key: 'requests',
      data: ['requests'] as const,
    },
  ];

  return (
    <>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={() => null}
        renderItem={({ item }) => {
          if (item === 'homes') {
            return (
              <View className="px-5 pb-8">
                <Text className="text-lg font-bold text-slate-900 pt-5 pb-2">Your Home</Text>
                <HomeList
                  homes={homes}
                  vertical
                  contentPadding={20}
                  showEditButton
                  showFavoriteButton={false}
                  onPressEdit={handleEditHome}
                  ListHeaderComponent={
                    loading ? (
                      <Text className="text-center mt-4 text-gray-600">Loading...</Text>
                    ) : error ? (
                      <Text className="text-center mt-4 text-red-600">{error}</Text>
                    ) : null
                  }
                  ListEmptyComponent={
                    !loading && !error ? (
                      <Text className="text-center mt-4 mb-4 text-gray-500">
                        You have no homes listed yet.
                      </Text>
                    ) : null
                  }
                />
              </View>
            );
          }

          return (
            <View className="px-5 pb-8">
              <Text className="text-lg font-bold text-slate-900 pt-2 pb-5">Incoming Requests</Text>
              {requestsLoading ? (
                <Text className="text-center text-gray-600 mt-2">Loading...</Text>
              ) : incomingRequests.length === 0 ? (
                <Text className="text-center text-gray-500 mt-2">No incoming requests yet.</Text>
              ) : (
                <FlatList
                  data={incomingRequests}
                  keyExtractor={(req) => String(req.id)}
                  scrollEnabled={false}
                  renderItem={({ item }) => {
                    const status = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.pending;
                    const requester = [item.requesterFirstName, item.requesterLastName]
                      .filter(Boolean)
                      .join(' ');
                    return (
                      <View className="mb-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <View className="p-4">
                          <View className="flex-row items-start justify-between mb-1">
                            <Text
                              className="text-base font-semibold text-slate-900 flex-1 mr-2"
                              numberOfLines={2}
                            >
                              {item.homeDescription}
                            </Text>
                            <View className={`rounded-full px-3 py-1 ${status.bg}`}>
                              <Text className={`text-xs font-semibold ${status.text}`}>
                                {status.label}
                              </Text>
                            </View>
                          </View>

                          <View className="flex-row items-center gap-1 mb-2">
                            <Feather name="map-pin" size={12} color="#94a3b8" />
                            <Text className="text-sm text-slate-500">
                              {item.homeCity}, {item.homeCountry}
                            </Text>
                          </View>

                          {requester ? (
                            <View className="flex-row items-center gap-1 mb-2">
                              <Feather name="user" size={12} color="#94a3b8" />
                              <Text className="text-sm text-slate-500">{requester}</Text>
                            </View>
                          ) : null}

                          <View className="flex-row items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                            <Feather name="calendar" size={14} color="#64748b" />
                            <Text className="text-sm text-slate-600">
                              {formatDate(item.requestedStartDate)} –{' '}
                              {formatDate(item.requestedEndDate)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                />
              )}
            </View>
          );
        }}
      />

      <HomeEditModal
        home={editingHome}
        draft={draft}
        saving={saving}
        onClose={() => setEditingHome(null)}
        onSave={handleSaveEdit}
        onDraftChange={setDraft}
      />
    </>
  );
}
