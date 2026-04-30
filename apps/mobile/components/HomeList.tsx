import type { Home } from '@org/types';
import { FlatList } from 'react-native';
import { HomeCard } from './HomeCard';

interface HomeListProps {
  homes: Home[];
  showScrollIndicator?: boolean;
}

export function HomeList({ homes, showScrollIndicator = false }: HomeListProps) {
  return (
    <FlatList
      data={homes}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <HomeCard
          image={item.photos[0] || 'https://placehold.co/220x120'}
          title={`${item.bedrooms}BR Home`}
          location={`${item.city}, ${item.country}`}
          price={`${item.maxGuests} guests`}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={showScrollIndicator}
      contentContainerStyle={{ paddingVertical: 8, paddingRight: 12 }}
    />
  );
}
