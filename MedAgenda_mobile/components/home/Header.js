import { View, Text, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Find & Book</Text>
        <Text style={styles.subtitle}>Appointment with a doctor</Text>
        <Text style={styles.description}>
          Book appointments with the best doctors and specialists in your area
        </Text>
        <Link href="/doctors" style={styles.button}>
          <Text style={styles.buttonText}>Book Now</Text>
        </Link>
      </View>
      <Image
        source={require('../../assets/images/doctor.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 120,
    height: 120,
  },
}); 