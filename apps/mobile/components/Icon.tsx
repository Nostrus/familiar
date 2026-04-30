import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import Feather from '@expo/vector-icons/Feather';
import { StyleProp, ViewStyle } from 'react-native';

type IconProps = {
  name: React.ComponentProps<typeof Feather>['name'];
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function Icon({ name, size = 20, color, style }: IconProps) {
  const colorScheme = useColorScheme();
  const themeColor = Colors[colorScheme]?.text || '#008236';
  return <Feather name={name} size={size} color={color ?? themeColor} style={style} />;
}
