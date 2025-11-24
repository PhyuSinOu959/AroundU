import { ImageKey } from '@/app/src/store/favorites';
import { ImageSourcePropType } from 'react-native';

export function imageForKey(key?: string): ImageSourcePropType {
  switch (key as ImageKey) {
    case 'coffeeShop':
      return require('@/app/src/assets/images/coffeeShop.jpg');
    case 'plantShop':
      return require('@/app/src/assets/images/plantShop.jpg');
    default:
      return require('@/app/src/assets/images/coffeeShop.jpg');
  }
}
