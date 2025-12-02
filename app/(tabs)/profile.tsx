// app/(tabs)/profile.tsx
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude: number;
  longitude: number;
  profileImage: any;
};

function SettingsItem({
  icon,
  label,
  danger,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  danger?: boolean;
  onPress?: () => void;
}) {
  const theme = useColorScheme() ?? 'light';
  const iconColor = danger ? Colors[theme].danger : Colors[theme].tint;
  const textColor = danger ? Colors[theme].danger : Colors[theme].text;
  return (
    <TouchableOpacity style={styles.itemRow} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={20} color={iconColor} />
        <Text style={[styles.itemLabel, { color: textColor }]}>{label}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={danger ? Colors[theme].danger : Colors[theme].icon}
      />
    </TouchableOpacity>
  );
}

export default function Profile() {
  const theme = useColorScheme() ?? 'light';
  const user: User = {
    id: 1,
    name: 'Rosy',
    email: 'rosy@example.com',
    phone: '1234567890',
    address: '123 Main St, Anytown, USA',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
    country: 'USA',
    latitude: 37.774929,
    longitude: -122.419416,
    profileImage: require('@/app/src/assets/images/profile.png'),
  };
  const items = [
    { icon: 'pencil', label: 'Edit Profile Name' },
    { icon: 'list-outline', label: 'List project' },
    { icon: 'lock-closed-outline', label: 'Change Password' },
    { icon: 'mail-outline', label: 'Change Email Address' },
    { icon: 'settings-outline', label: 'Settings' },
    { icon: 'options-outline', label: 'Preferences' },
  ] as const;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].muted }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: Colors[theme].tint }]}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrap}>
            <Image source={user.profileImage} style={styles.profileImage} />
          </View>
          <TouchableOpacity
            style={[
              styles.editBadge,
              { backgroundColor: Colors[theme].card, borderColor: '#FFFFFF' },
            ]}
            activeOpacity={0.8}
          >
            <Ionicons name="pencil" size={20} color={Colors[theme].tint} />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: Colors[theme].card }]}>
        {items.map((it) => (
          <SettingsItem key={it.label} icon={it.icon} label={it.label} />
        ))}
        <View style={styles.divider} />
        <SettingsItem icon="log-out-outline" label="Logout" danger onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  header: {
    width: '100%',
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
    overflow: 'hidden',
  },
  avatarContainer: {
    position: 'relative',
    width: 110,
    height: 110,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  editBadge: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  userName: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  card: {
    marginTop: -24,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemLabel: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    opacity: 0.6,
    marginHorizontal: 16,
  },
});
