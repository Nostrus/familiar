import { Image, View } from 'react-native';
import { Text } from '../components/Themed';

export type HomeCardProps = {
  image: string;
  title: string;
  location: string;
  price: string;
};

export function HomeCard({ image, title, location, price }: HomeCardProps) {
  return (
    <View className="w-[220px] rounded-2xl bg-white mr-6 p-3 my-4 shadow-sm border-gray-100 border">
      <Image source={{ uri: image }} className="w-full h-[120px] rounded-xl mb-2" />
      <Text className="font-bold text-base mb-0.5">{title}</Text>
      <Text className="text-sm text-gray-600 mb-0.5">{location}</Text>
      <Text className="font-semibold text-[15px] text-green-700">{price}</Text>
    </View>
  );
}
