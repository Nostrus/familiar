import { useAuth } from '@clerk/expo';
import { AuthView } from '@clerk/expo/native';
import { Text, View } from '../../components/Themed';

export default function FavoritesScreen() {
  const { isSignedIn, isLoaded } = useAuth({ treatPendingAsSignedOut: false });

  if (!isSignedIn) {
    return <AuthView mode="signInOrUp" />;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Favorites</Text>
    </View>
  );
}
