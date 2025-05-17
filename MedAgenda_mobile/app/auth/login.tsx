import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Link } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // TODO: Implement login logic
    console.log('Login:', { email, password });
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', backgroundColor: COLORS.background }}>
      <Text variant="headlineMedium" style={{ textAlign: 'center', marginBottom: 24, color: COLORS.primary }}>
        MedAgenda
      </Text>
      
      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ marginBottom: 16 }}
      />

      <TextInput
        mode="outlined"
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        style={{ marginBottom: 24 }}
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        style={{ marginBottom: 16 }}
      >
        Entrar
      </Button>

      <Button
        mode="outlined"
        onPress={() => {}}
        style={{ marginBottom: 16 }}
      >
        Entrar como Administrador
      </Button>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
        <Text variant="bodyMedium">Não tem uma conta?</Text>
        <Link href="/(auth)/register" asChild>
          <Text variant="bodyMedium" style={{ color: COLORS.primary }}>
            Cadastre-se
          </Text>
        </Link>
      </View>
    </View>
  );
} 