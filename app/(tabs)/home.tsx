// app/(tabs)/home.tsx
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { type Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const [search, setSearch] = useState('');
  const categories = [
    {
      id: 1,
      name: 'Coffee',
      icon: 'cafe-outline',
    },
    {
      id: 2,
      name: 'Plant',
      icon: 'leaf-outline',
    },
    {
      id: 3,
      name: 'Food',
      icon: 'restaurant-outline',
    },
    {
      id: 4,
      name: 'Book',
      icon: 'book-outline',
    },
    {
      id: 5,
      name: 'Art',
      icon: 'brush-outline',
    },
  ];

  const shops = [
    {
      name: 'Green Leaf Cafe',
      distance: 0.8,
      open: true,
      image: require('@/app/src/assets/images/coffeeShop.jpg'),
    },
    {
      name: 'Bloom Garden Shop',
      distance: 1.2,
      open: false,
      image: require('@/app/src/assets/images/plantShop.jpg'),
    },
    {
      name: 'Urban Bites Food Court',
      distance: 0.5,
      open: true,
      image: require('@/app/src/assets/images/plantShop.jpg'),
    },
    {
      name: 'ArtHive Studio',
      distance: 1.9,
      open: false,
      image: require('@/app/src/assets/images/coffeeShop.jpg'),
    },
  ];

  const [region, setRegion] = useState<Region>({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!mounted) return;
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch {
        // Ignore; permission gating handled before entering this screen
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const renderCategoryItem = (item: any) => {
    return (
      <View style={{ alignItems: 'center', padding: 8 }}>
        <View
          style={{
            backgroundColor: 'white',
            width: 56,
            height: 56,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          <Ionicons name={item.icon} size={24} color="green" />
        </View>
        <Text style={{ fontSize: 16, textAlign: 'center' }}>{item.name}</Text>
      </View>
    );
  };

  const renderShopItem = (item: any) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 12,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
          margin: 6,
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
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#DDEEDC' }} edges={['top']}>
      <FlatList
        data={shops}
        renderItem={({ item }) => renderShopItem(item)}
        numColumns={2}
        keyExtractor={(item) => item.name}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 10 }}
        ListHeaderComponent={
          <View>
            <View style={{ padding: 8, backgroundColor: 'white', borderRadius: 16, margin: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }}>
                <Ionicons name="search" size={18} color="grey" style={{ marginRight: 6 }} />
                <TextInput
                  placeholder="Find a shop or place"
                  style={{ flex: 1, paddingVertical: 8 }}
                  value={search}
                  onChangeText={setSearch}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Ionicons name="close" size={18} color="grey" style={{ marginRight: 6 }} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={{ margin: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Near You</Text>
              <View
                style={{ backgroundColor: 'white', borderRadius: 16, padding: 8, marginTop: 8 }}
              >
                <MapView
                  style={{ width: '100%', height: 200 }}
                  region={region}
                  onRegionChangeComplete={setRegion}
                  showsUserLocation
                  showsMyLocationButton
                  followsUserLocation
                  zoomEnabled
                  zoomControlEnabled
                />
              </View>
            </View>
            <View style={{ margin: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Explore By Category</Text>
              <FlatList
                data={categories}
                renderItem={({ item }) => renderCategoryItem(item)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 8 }}
              />
            </View>
            <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Suggested Shops</Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
