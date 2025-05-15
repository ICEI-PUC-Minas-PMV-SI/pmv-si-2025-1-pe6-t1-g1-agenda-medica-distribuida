import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function Banner() {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push('/about')}
    >
      <ImageBackground
        source={require('../../assets/images/banner-bg.png')}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Need Health Advice?</Text>
          <Text style={styles.description}>
            Get professional medical consultation from the comfort of your home
          </Text>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Learn More</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    borderRadius: 12,
    opacity: 0.9,
  },
  content: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 