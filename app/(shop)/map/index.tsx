import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker, type MapPressEvent, type Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapScreen() {
  const [region, setRegion] = useState<Region>({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [manualCoordinate, setManualCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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
        // Ignore errors; permission gating handled elsewhere
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handlePress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setManualCoordinate({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#DDEEDC' }} edges={['top']}>
      <Stack.Screen options={{ title: 'Map' }} />
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <MapView
          style={{ flex: 1 }}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={handlePress}
          showsUserLocation
          showsMyLocationButton
          followsUserLocation
          zoomEnabled
          zoomControlEnabled
        >
          {manualCoordinate ? (
            <Marker
              coordinate={manualCoordinate}
              draggable
              onDragEnd={(e) => {
                const { coordinate } = e.nativeEvent;
                setManualCoordinate({
                  latitude: coordinate.latitude,
                  longitude: coordinate.longitude,
                });
              }}
              title="Selected location"
            />
          ) : null}
        </MapView>
      </View>
    </SafeAreaView>
  );
}
