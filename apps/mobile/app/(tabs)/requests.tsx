import { useAuth } from '@clerk/expo';
import { AuthView } from '@clerk/expo/native';
import Feather from '@expo/vector-icons/Feather';
import type { StayRequestWithHome } from '@org/types';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, View } from 'react-native';
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

export default function RequestsScreen() {
  const { isSignedIn, getToken } = useAuth();
  const [requests, setRequests] = useState<StayRequestWithHome[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  async function cancelRequest(requestId: number) {
    if (!API_URL || cancelingId) return;
    try {
      setCancelingId(requestId);
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      const res = await fetch(`${API_URL}/api/my-requests/${requestId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || 'Failed to cancel request');
      }
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
    } catch (err) {
      console.error('Failed to cancel request:', err);
      Alert.alert('Could not cancel request', 'Please try again.');
    } finally {
      setCancelingId(null);
    }
  }

  useEffect(() => {
    if (!isSignedIn) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/my-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch requests');
        setRequests(await res.json());
      } catch {
        setError('Failed to load requests. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn]);

  if (!isSignedIn) {
    return <AuthView mode="signInOrUp" />;
  }

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ padding: 20 }}
      ListHeaderComponent={
        error ? (
          <Text className="text-center mt-10 text-red-600">{error}</Text>
        ) : loading ? (
          <Text className="text-center mt-10 text-gray-600">Loading...</Text>
        ) : null
      }
      ListEmptyComponent={
        !loading && !error ? (
          <Text className="text-center mt-10 text-gray-500">No stay requests yet.</Text>
        ) : null
      }
      renderItem={({ item }) => {
        const status = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.pending;
        return (
          <View className="mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <View className="p-4">
              <View className="flex-row items-start justify-between mb-1">
                <Text
                  className="text-base font-semibold text-slate-900 flex-1 mr-2"
                  numberOfLines={2}
                >
                  {item.homeDescription}
                </Text>
                <View className={`rounded-full px-3 py-1 ${status.bg}`}>
                  <Text className={`text-xs font-semibold ${status.text}`}>{status.label}</Text>
                </View>
              </View>

              <View className="flex-row items-center gap-1 mb-3">
                <Feather name="map-pin" size={12} color="#94a3b8" />
                <Text className="text-sm text-slate-500">
                  {item.homeCity}, {item.homeCountry}
                </Text>
              </View>

              <View className="flex-row items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                <Feather name="calendar" size={14} color="#64748b" />
                <Text className="text-sm text-slate-600">
                  {formatDate(item.requestedStartDate)} – {formatDate(item.requestedEndDate)}
                </Text>
              </View>

              {item.status === 'pending' ? (
                <Pressable
                  disabled={cancelingId === item.id}
                  onPress={() => {
                    Alert.alert('Cancel request?', 'This will remove your pending stay request.', [
                      { text: 'Keep', style: 'cancel' },
                      {
                        text: cancelingId === item.id ? 'Canceling…' : 'Cancel request',
                        style: 'destructive',
                        onPress: () => {
                          void cancelRequest(item.id);
                        },
                      },
                    ]);
                  }}
                  className="mt-3 self-start rounded-lg border border-red-200 bg-red-50 px-3 py-2"
                >
                  <Text className="text-sm font-semibold text-red-600">
                    {cancelingId === item.id ? 'Canceling…' : 'Cancel Request'}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        );
      }}
    />
  );
}
