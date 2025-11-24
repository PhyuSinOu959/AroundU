import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, Pressable, StyleSheet, View } from 'react-native';

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

  const continueManually = () => {
    requestPermission();
    router.replace('/home');
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  const isLoading = status === null || servicesEnabled === null || requesting;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={require('@/app/src/assets/images/locationMap.jpg')} style={styles.image} />
        </View>
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
            <PrimaryButton
              label="Choose location manually"
              onPress={continueManually}
              variant="secondary"
            />
          </>
        ) : status === 'granted' && servicesEnabled === false ? (
          <>
            <PrimaryButton label="Open Settings" onPress={openSettings} />
            <ThemedText style={styles.helper}>
              Location services are turned off. Please enable them in Settings.
            </ThemedText>
            <PrimaryButton
              label="Choose location manually"
              onPress={continueManually}
              variant="secondary"
            />
          </>
        ) : (
          <>
            <PrimaryButton
              label={requesting ? 'Requesting…' : 'Use current location'}
              onPress={requestPermission}
              disabled={requesting}
            />
            <PrimaryButton
              label="Choose location manually"
              onPress={continueManually}
              variant="secondary"
            />
          </>
        )}
      </View>
    </ThemedView>
  );
}

function PrimaryButton({
  label,
  onPress,
  disabled,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled ? styles.buttonPressed : null,
        disabled ? styles.buttonDisabled : null,
        variant === 'secondary' ? styles.buttonSecondary : null,
      ]}
    >
      <ThemedText
        type="defaultSemiBold"
        style={variant === 'secondary' ? styles.buttonTextSecondary : styles.buttonText}
      >
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
  imageContainer: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
  },
  buttonTextSecondary: {
    color: '#007AFF',
  },
});
