import { ScrollView, View, Alert } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../constants/theme';
import { auth } from '../../services/api';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu nome completo');
      return false;
    }
    
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu email');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return false;
    }
    
    if (!password) {
      Alert.alert('Erro', 'Por favor, insira uma senha');
      return false;
    }
    
    // Validação da senha conforme requisitos do backend
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Senha Inválida', 
        'A senha deve ter pelo menos 8 caracteres e conter:\n• Uma letra minúscula\n• Uma letra maiúscula\n• Um número'
      );
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim() || undefined
      };

      console.log('Tentando cadastrar usuário:', { ...userData, password: '[HIDDEN]' });
      
      const user = await auth.register(userData);
      
      console.log('Cadastro realizado com sucesso:', user.name);
      
      Alert.alert(
        'Sucesso!', 
        'Conta criada com sucesso! Você pode fazer login agora.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login')
          }
        ]
      );
      
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      if (error.status === 504) {
        errorMessage = 'O servidor está temporariamente indisponível. Isso pode ser devido a:\n\n• Problemas de conexão com o banco de dados\n• Timeout do servidor\n\nTente novamente em alguns minutos.';
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      }
      
      Alert.alert('Erro no Cadastro', errorMessage);
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
        disabled={loading}
      />

      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ marginBottom: 16 }}
        disabled={loading}
      />

      <TextInput
        mode="outlined"
        label="Telefone (opcional)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={{ marginBottom: 16 }}
        disabled={loading}
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
        disabled={loading}
      />

      <TextInput
        mode="outlined"
        label="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
        style={{ marginBottom: 24 }}
        disabled={loading}
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        style={{ marginBottom: 16 }}
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Cadastrando...' : 'Cadastrar'}
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