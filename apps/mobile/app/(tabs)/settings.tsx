import { useUser } from '@clerk/expo';
import { Image, View } from 'react-native';
import { Text } from '../../components/Themed';

export default function SettingsScreen() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Sign in to view your profile.</Text>
      </View>
    );
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'No name set';
  const primaryEmail = user.primaryEmailAddress?.emailAddress ?? 'No email set';

  return (
    <View className="flex-1 bg-slate-50 px-5 pt-8">
      <Text className="text-2xl font-bold text-slate-900 mb-5">Settings</Text>

      <View className="rounded-2xl border border-slate-200 bg-white p-4">
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: user.imageUrl }}
            style={{ width: 56, height: 56, borderRadius: 999 }}
          />
          <View className="flex-1">
            <Text className="text-base font-semibold text-slate-900">{fullName}</Text>
            <Text className="text-sm text-slate-500">{primaryEmail}</Text>
          </View>
        </View>

        <View className="mt-4 border-t border-slate-100 pt-4">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
            Clerk User ID
          </Text>
          <Text className="text-sm text-slate-700">{user.id}</Text>
        </View>
      </View>
    </View>
  );
}
