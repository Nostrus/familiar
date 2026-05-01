import type { Home } from '@org/types';
import { FlatList, type ListRenderItem } from 'react-native';
import { HomeCard } from './HomeCard';

interface HomeListProps {
  homes: Home[];
  showScrollIndicator?: boolean;
  vertical?: boolean;
  contentPadding?: number;
  ListEmptyComponent?: React.ReactElement | null;
  ListHeaderComponent?: React.ReactElement | null;
  showEditButton?: boolean;
  onPressEdit?: (home: Home) => void;
  showFavoriteButton?: boolean;
  favoriteHomeIds?: number[];
  onFavoriteChanged?: (homeId: number, isFavorited: boolean) => void;
  navigateOnPress?: boolean;
}

export function HomeList({
  homes,
  showScrollIndicator = false,
  vertical = false,
  contentPadding,
  ListEmptyComponent,
  ListHeaderComponent,
  showEditButton = false,
  onPressEdit,
  showFavoriteButton = true,
  favoriteHomeIds,
  onFavoriteChanged,
  navigateOnPress = true,
}: HomeListProps) {
  const renderItem: ListRenderItem<Home> = ({ item }) => (
    <HomeCard
      home={item}
      fullWidth={vertical}
      showEditButton={showEditButton}
      onPressEdit={onPressEdit}
      showFavoriteButton={showFavoriteButton}
      isFavorited={favoriteHomeIds?.includes(item.id) ?? false}
      onFavoriteChanged={onFavoriteChanged}
      navigateOnPress={navigateOnPress}
    />
  );

  return (
    <FlatList
      data={homes}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      horizontal={!vertical}
      showsHorizontalScrollIndicator={!vertical && showScrollIndicator}
      showsVerticalScrollIndicator={vertical && showScrollIndicator}
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={
        vertical
          ? { paddingVertical: 8, paddingHorizontal: contentPadding ?? 0 }
          : { paddingVertical: 8, paddingRight: 12 }
      }
    />
  );
}
