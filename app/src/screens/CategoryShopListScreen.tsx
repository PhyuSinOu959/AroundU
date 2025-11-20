import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryShopListScreen() {
  const params = useLocalSearchParams<{ id?: string; name?: string }>();
  const title = params?.name ?? 'Category';
  const router = useRouter();

  const allShops = [
    {
      id: '1',
      name: 'Green Leaf Cafe',
      distance: 0.8,
      open: true,
      image: require('@/app/src/assets/images/coffeeShop.jpg'),
      imageKey: 'coffeeShop',
      categoryId: 1,
    },
    {
      id: '2',
      name: 'Bloom Garden Shop',
      distance: 1.2,
      open: false,
      image: require('@/app/src/assets/images/plantShop.jpg'),
      imageKey: 'plantShop',
      categoryId: 2,
    },
    {
      id: '3',
      name: 'Urban Bites Food Court',
      distance: 0.5,
      open: true,
      image: require('@/app/src/assets/images/plantShop.jpg'),
      imageKey: 'plantShop',
      categoryId: 3,
    },
    {
      id: '4',
      name: 'ArtHive Studio',
      distance: 1.9,
      open: false,
      image: require('@/app/src/assets/images/coffeeShop.jpg'),
      imageKey: 'coffeeShop',
      categoryId: 4,
    },
  ];

  const categoryId = Number(params?.id ?? 0);
  const shops = allShops.filter((s) => s.categoryId === categoryId);

  const openShop = (item: any) => {
    router.push({
      pathname: '/shop/[shopId]',
      params: {
        shopId: String(item.id),
        name: item.name,
        distance: String(item.distance),
        open: String(item.open),
        imageKey: item.imageKey,
        categoryId: String(item.categoryId),
      },
    } as any);
  };

  const renderShopItem = (item: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => openShop(item)}
        style={{ flex: 1, marginBottom: 12 }}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 2,
          }}
        >
          <Image source={item.image} style={{ width: '100%', height: 120 }} resizeMode="cover" />
          <View style={{ padding: 12 }}>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', lineHeight: 22, minHeight: 44 }}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
              <Text style={{ fontSize: 14, color: 'grey' }}>{item.distance} km</Text>
              <Text style={{ fontSize: 14, color: item.open ? 'green' : 'red' }}>
                {item.open ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#DDEEDC' }} edges={['top']}>
      <Stack.Screen options={{ title }} />
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{title} Shops</Text>
        <Text style={{ fontSize: 14, color: 'grey' }}>Category ID: {params?.id ?? '-'}</Text>
      </View>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, flex: 1 }}>
        {shops.length === 0 ? (
          <Text style={{ fontSize: 16, color: 'grey' }}>No shops found in this category.</Text>
        ) : (
          <FlatList
            data={shops}
            renderItem={({ item }) => renderShopItem(item)}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
