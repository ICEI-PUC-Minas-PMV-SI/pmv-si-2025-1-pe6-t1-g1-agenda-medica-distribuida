import { View, ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Header from '../../components/home/Header';
import SpecialityMenu from '../../components/home/SpecialityMenu';
import TopDoctors from '../../components/home/TopDoctors';
import Banner from '../../components/home/Banner';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'MedAgenda',
        }}
      />
      <View style={styles.content}>
        <Header />
        <SpecialityMenu />
        <TopDoctors />
        <Banner />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
}); 