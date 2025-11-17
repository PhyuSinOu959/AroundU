import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type PermissionState = 'undetermined' | 'granted' | 'denied' | null;

export default function PermissionScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<PermissionState>(null);
  const [servicesEnabled, setServicesEnabled] = useState<boolean | null>(null);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      Location.getForegroundPermissionsAsync(),
      Location.hasServicesEnabledAsync(),
    ]).then(([perm, enabled]) => {
      if (!mounted) return;
      setStatus(perm.status);
      setServicesEnabled(enabled);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (status === 'granted' && servicesEnabled) {
      router.replace('/');
    }
  }, [status, servicesEnabled, router]);

  const requestPermission = async () => {
    try {
      setRequesting(true);
      const [res, enabled] = await Promise.all([
        Location.requestForegroundPermissionsAsync(),
        Location.hasServicesEnabledAsync(),
      ]);
      setStatus(res.status);
      setServicesEnabled(enabled);
    } finally {
      setRequesting(false);
    }
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  const isLoading = status === null || servicesEnabled === null || requesting;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Enable your location
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          We use your location to show nearby places and features around you.
        </ThemedText>

        {isLoading ? (
          <ActivityIndicator style={styles.spinner} />
        ) : status === 'denied' ? (
          <>
            <PrimaryButton label="Open Settings" onPress={openSettings} />
            <ThemedText style={styles.helper}>
              Location permission is denied. You can change this in Settings.
            </ThemedText>
          </>
        ) : status === 'granted' && servicesEnabled === false ? (
          <>
            <PrimaryButton label="Open Settings" onPress={openSettings} />
            <ThemedText style={styles.helper}>
              Location services are turned off. Please enable them in Settings.
            </ThemedText>
          </>
        ) : (
          <PrimaryButton
            label={requesting ? 'Requesting…' : 'Allow Location Access'}
            onPress={requestPermission}
            disabled={requesting}
          />
        )}
      </View>
    </ThemedView>
  );
}

function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled ? styles.buttonPressed : null,
        disabled ? styles.buttonDisabled : null,
      ]}>
      <ThemedText type="defaultSemiBold" style={styles.buttonText}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    maxWidth: 520,
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  spinner: {
    marginTop: 8,
  },
  helper: {
    textAlign: 'center',
    opacity: 0.8,
  },
  button: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
  },
});


