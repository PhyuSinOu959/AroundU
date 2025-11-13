import * as Location from 'expo-location';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function IndexGate() {
  const [dest, setDest] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [perm, servicesEnabled] = await Promise.all([
          Location.getForegroundPermissionsAsync(),
          Location.hasServicesEnabledAsync(),
        ]);
        if (!mounted) return;
        const hasPermission = perm.status === 'granted';
        const ready = hasPermission && servicesEnabled;
        setDest(ready ? '/(tabs)' : '/permission');
      } catch {
        if (!mounted) return;
        setDest('/permission');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!dest) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={dest} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


