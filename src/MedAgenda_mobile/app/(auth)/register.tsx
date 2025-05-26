import { ScrollView, View } from 'react-native';
import { Button, Text, TextInput, HelperText } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signUp({
        name,
        email,
        password,
        phone
      });
      router.replace('/(tabs)');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Erro ao criar conta. Por favor, tente novamente.');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={{ 
        flexGrow: 1, 
        padding: 16, 
        justifyContent: 'center',
        backgroundColor: COLORS.background 
      }}
    >
      <Text variant="headlineMedium" style={{ textAlign: 'center', marginBottom: 24, color: COLORS.primary }}>
        Criar Conta
      </Text>
      
      <TextInput
        mode="outlined"
        label="Nome Completo"
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 16 }}
      />

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
        label="Telefone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
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
        style={{ marginBottom: 16 }}
      />

      <TextInput
        mode="outlined"
        label="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
        style={{ marginBottom: 24 }}
      />

      {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}

      <Button
        mode="contained"
        onPress={handleRegister}
        style={{ marginBottom: 16 }}
        loading={loading}
        disabled={loading}
      >
        Cadastrar
      </Button>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
        <Text variant="bodyMedium">Já tem uma conta?</Text>
        <Link href="/(auth)/login" asChild>
          <Text variant="bodyMedium" style={{ color: COLORS.primary }}>
            Faça login
          </Text>
        </Link>
      </View>
    </ScrollView>
  );
} 