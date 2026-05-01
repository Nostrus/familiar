import { useAuth, useClerk, useUser, useUserProfileModal } from '@clerk/expo';
import { AuthView, UserButton } from '@clerk/expo/native';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../../components/Themed';

export default function ProfileScreen() {
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { presentUserProfile, isAvailable } = useUserProfileModal();

  if (!isSignedIn) {
    return <AuthView mode="signInOrUp" />;
  }

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.id;

  async function handleSignOut() {
    await signOut();
  }

  async function handleManageProfile() {
    if (!isAvailable) return;
    await presentUserProfile();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome</Text>
        <View style={styles.userButtonWrapper}>
          <UserButton />
        </View>
      </View>

      <View style={styles.profileCard}>
        {user?.imageUrl ? <Image source={{ uri: user.imageUrl }} style={styles.avatar} /> : null}
        <View>
          <Text style={styles.greeting}>Hello {name}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.linkButton, !isAvailable ? styles.disabledButton : null]}
        onPress={() => {
          void handleManageProfile();
        }}
        disabled={!isAvailable}
      >
        <Text style={styles.linkButtonText}>Manage Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.linkButton, styles.signOutButton]}
        onPress={() => {
          void handleSignOut();
        }}
      >
        <Text style={styles.linkButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    color: '#0f172a',
  },
  userButtonWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#0f172a',
  },
  linkButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#2563eb',
    marginBottom: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  signOutButton: {
    backgroundColor: '#666666',
  },
  linkButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
  },
});
