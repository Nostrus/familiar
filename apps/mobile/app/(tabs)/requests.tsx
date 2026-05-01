import { useAuth } from '@clerk/expo';
import { AuthView } from '@clerk/expo/native';
import type { HomeStayRequest } from '@org/types';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '../../components/Themed';
import { API_URL } from '../../lib/api';

export default function RequestsScreen() {
  const { isSignedIn, getToken } = useAuth();
  const [requests, setRequests] = useState<HomeStayRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
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
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
      {loading && <Text className="text-center mt-10 text-gray-600">Loading...</Text>}
      {error && <Text className="text-center mt-10 text-red-600">{error}</Text>}
      {!loading && !error && requests.length === 0 && (
        <Text className="text-center mt-10 text-gray-500">No requests yet.</Text>
      )}
      {!loading && !error && requests.length > 0 && (
        <View>
          {requests.map((req) => (
            <View
              key={req.id}
              className="mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <Text className="font-bold">Request #{req.id}</Text>
              <Text>Status: {req.status}</Text>
              <Text>From: {req.requestedStartDate}</Text>
              <Text>To: {req.requestedEndDate}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
