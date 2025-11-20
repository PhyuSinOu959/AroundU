import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryShopListScreen() {
  const params = useLocalSearchParams<{ id?: string; name?: string }>();
  const title = params?.name ?? 'Category';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#DDEEDC' }} edges={['top']}>
      <Stack.Screen options={{ title }} />
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{title} Shops</Text>
        <Text style={{ fontSize: 14, color: 'grey' }}>Category ID: {params?.id ?? '-'}</Text>
        <View style={{ height: 16 }} />
        <Text style={{ fontSize: 16 }}>Shop list will be displayed here.</Text>
      </View>
    </SafeAreaView>
  );
}
