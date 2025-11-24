// app/(tabs)/favorites.tsx
import { useFavorites } from '@/app/src/store/favorites';
import { imageForKey } from '@/app/src/utils/images';
import { useRouter } from 'expo-router';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Favorites() {
  const { favorites } = useFavorites();
  const router = useRouter();

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

  const renderItem = (item: any) => {
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
          <Image
            source={imageForKey(item.imageKey)}
            style={{ width: '100%', height: 120 }}
            resizeMode="cover"
          />
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
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Favorite Shops</Text>
        <Text style={{ fontSize: 14, color: 'grey' }}>
          {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
        </Text>
      </View>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, flex: 1 }}>
        {favorites.length === 0 ? (
          <Text style={{ fontSize: 16, color: 'grey' }}>No favorites yet.</Text>
        ) : (
          <FlatList
            data={favorites}
            renderItem={({ item }) => renderItem(item)}
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
