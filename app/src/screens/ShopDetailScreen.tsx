import { Shop, useFavorites } from '@/app/src/store/favorites';
import { imageForKey } from '@/app/src/utils/images';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ShopParam = {
  shopId?: string;
  name?: string;
  distance?: string; // pass as string in params
  open?: string; // 'true' | 'false'
  categoryId?: string; // pass as string
  imageKey?: string; // 'coffeeShop' | 'plantShop'
};

// Shop type is imported from store; imageForKey from utils

const ALL_SHOPS: Shop[] = [
  {
    id: '1',
    name: 'Green Leaf Cafe',
    distance: 0.8,
    open: true,
    imageKey: 'coffeeShop',
    categoryId: 1,
  },
  {
    id: '2',
    name: 'Bloom Garden Shop',
    distance: 1.2,
    open: false,
    imageKey: 'plantShop',
    categoryId: 2,
  },
  {
    id: '3',
    name: 'Urban Bites Food Court',
    distance: 0.5,
    open: true,
    imageKey: 'plantShop',
    categoryId: 3,
  },
  {
    id: '4',
    name: 'ArtHive Studio',
    distance: 1.9,
    open: false,
    imageKey: 'coffeeShop',
    categoryId: 4,
  },
  {
    id: '5',
    name: 'BookHive Studio',
    distance: 1.9,
    open: false,
    imageKey: 'coffeeShop',
    categoryId: 5,
  },
];

export default function ShopDetailScreen() {
  const params = useLocalSearchParams<ShopParam>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const currentShop: Shop = {
    id: params.shopId ?? '0',
    name: params.name ?? 'Shop',
    distance: Number(params.distance ?? 0),
    open: (params.open ?? 'false') === 'true',
    imageKey: (params.imageKey as Shop['imageKey']) ?? 'coffeeShop',
    categoryId: Number(params.categoryId ?? 0),
  };

  const suggestions = ALL_SHOPS.filter(
    (s) => s.categoryId === currentShop.categoryId && s.id !== currentShop.id,
  );

  const handleOpenShop = (shop: Shop) => {
    router.push({
      pathname: '/shop/[shopId]',
      params: {
        shopId: shop.id,
        name: shop.name,
        distance: String(shop.distance),
        open: String(shop.open),
        imageKey: shop.imageKey,
        categoryId: String(shop.categoryId),
      },
    });
  };

  const handleFavorite = (shop: Shop) => {
    toggleFavorite(shop);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#DDEEDC' }} edges={['top']}>
      <Stack.Screen options={{ title: currentShop.name }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Image
          source={imageForKey(currentShop.imageKey)}
          style={{ width: '100%', height: 220 }}
          resizeMode="cover"
        />
        <View style={{ padding: 16 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{currentShop.name}</Text>
            {isFavorite(currentShop.id) ? (
              <Ionicons
                name="heart"
                size={24}
                color="red"
                style={{ marginRight: 8, alignSelf: 'center' }}
                onPress={() => handleFavorite(currentShop)}
              />
            ) : (
              <Ionicons
                name="heart-outline"
                size={24}
                color="black"
                style={{ marginRight: 8, alignSelf: 'center' }}
                onPress={() => handleFavorite(currentShop)}
              />
            )}
          </View>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <View
              style={{
                backgroundColor: 'white',
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 12,
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 14, color: 'grey' }}>{currentShop.distance} km</Text>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 12,
              }}
            >
              <Text style={{ fontSize: 14, color: currentShop.open ? 'green' : 'red' }}>
                {currentShop.open ? 'Open now' : 'Closed'}
              </Text>
            </View>
          </View>
          <View style={{ height: 16 }} />
          <Text style={{ fontSize: 16, lineHeight: 22, color: '#333' }}>
            Welcome to {currentShop.name}. This is a placeholder description for the shop details,
            including address, hours, contact, and highlights. Replace this with real content.
          </Text>
        </View>

        {suggestions.length > 0 && (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
              Suggested Shops
            </Text>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleOpenShop(item)}
                  activeOpacity={0.8}
                  style={{
                    width: 200,
                    backgroundColor: 'white',
                    borderRadius: 14,
                    overflow: 'hidden',
                    marginRight: 12,
                    shadowColor: '#000',
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 2,
                  }}
                >
                  <Image
                    source={imageForKey(item.imageKey)}
                    style={{ width: '100%', height: 110 }}
                    resizeMode="cover"
                  />
                  <View style={{ padding: 10 }}>
                    <Text
                      style={{ fontSize: 16, fontWeight: 'bold', lineHeight: 20 }}
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 6,
                      }}
                    >
                      <Text style={{ fontSize: 13, color: 'grey' }}>{item.distance} km</Text>
                      <Text style={{ fontSize: 13, color: item.open ? 'green' : 'red' }}>
                        {item.open ? 'Open' : 'Closed'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
