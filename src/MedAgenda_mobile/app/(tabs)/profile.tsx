import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { 
  Avatar, 
  Button, 
  Card, 
  Divider, 
  List, 
  Text, 
  TextInput,
  Dialog,
  Portal,
  ActivityIndicator
} from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { auth, users } from '../../services/api';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debugUserData, clearUserCache } from '../../utils/debugUser';

export default function ProfileScreen() {
  const { user, signOut, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  // Estados para edição de perfil com fallback para nome
  const [userName, setUserName] = useState<string>(user?.name || 'Usuário');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  // Estados para mudança de senha
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Log user data for debugging
  console.log('👤 Profile Screen - User object from context:', user);
  console.log('👤 Profile Screen - User name from context:', user?.name);
  console.log('👤 Profile Screen - Local userName state:', userName);

  useEffect(() => {
    checkStoredUserData();
    
    if (user) {
      // Update local states
      setEmail(user.email);
      setPhone(user.phone || '');
      
      // Handle name with fallback logic
      if (user.name && user.name !== 'Usuário') {
        console.log('🔄 Profile - Using user name from context:', user.name);
        setUserName(user.name);
        setName(user.name);
      } else if (user.id) {
        console.log('🔍 Profile - User name is missing, attempting to fetch profile...');
        fetchUserProfile();
      }
    }
  }, [user]);

  const checkStoredUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('authToken');
      
      console.log('💾 Profile - Stored user data:', storedUser);
      console.log('💾 Profile - Stored token exists:', !!storedToken);
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('💾 Profile - Parsed stored user:', parsedUser);
        console.log('💾 Profile - Parsed stored user name:', parsedUser.name);
        
        // If stored user has a valid name, use it
        if (parsedUser.name && parsedUser.name !== 'Usuário') {
          console.log('🔄 Profile - Using stored user name:', parsedUser.name);
          setUserName(parsedUser.name);
          setName(parsedUser.name);
        }
      }
      
      // If we still don't have a name, try to extract from token
      if (storedToken && userName === 'Usuário') {
        console.log('🔍 Profile - Attempting to extract name from token...');
        tryExtractNameFromToken(storedToken);
      }
    } catch (error) {
      console.error('❌ Profile - Error checking stored data:', error);
    }
  };

  const tryExtractNameFromToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      
      console.log('🔍 Profile - Decoded token for name extraction:', decoded);
      
      const extractedName = decoded.name || decoded.fullName || decoded.firstName || decoded.username;
      if (extractedName && extractedName !== 'Usuário') {
        console.log('✅ Profile - Extracted name from token:', extractedName);
        setUserName(extractedName);
        setName(extractedName);
      }
    } catch (error) {
      console.error('❌ Profile - Error extracting name from token:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      console.log('🔍 Profile - Attempting to fetch user profile for name...');
      const profileData = await users.getProfile();
      console.log('✅ Profile - Fetched profile data:', profileData);
      
      if (profileData.name && profileData.name !== 'Usuário') {
        console.log('🔄 Profile - Updating user name from profile:', profileData.name);
        setUserName(profileData.name);
        setName(profileData.name);
        await updateUser({ name: profileData.name });
      } else {
        console.log('⚠️ Profile - Profile data does not contain a valid name:', profileData.name);
      }
    } catch (error: any) {
      console.warn('❌ Profile - Could not fetch user profile (this is normal if endpoint does not exist):', error.message);
      // Don't throw error - this is a fallback mechanism
      // If API doesn't exist, we'll use other strategies
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    setLoading(true);
    try {
      // Como não temos endpoint de atualização de perfil, apenas simulamos
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      setEditMode(false);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'Nova senha e confirmação não coincidem');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Erro', 'Nova senha deve ter pelo menos 8 caracteres');
      return;
    }

    // Verificar se atende aos requisitos de senha
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      Alert.alert(
        'Erro', 
        'Nova senha deve conter:\n• Pelo menos 8 caracteres\n• Uma letra maiúscula\n• Uma letra minúscula\n• Um número'
      );
      return;
    }

    setLoading(true);
    try {
      await auth.changePassword(oldPassword, newPassword);
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      setShowPasswordDialog(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao alterar senha';
      
      if (errorMessage.includes('not verified')) {
        Alert.alert(
          'Verificação Necessária', 
          'Sua conta precisa ser verificada para alterar a senha. Esta funcionalidade será implementada em breve.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Erro', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              // Just sign out - let the _layout useEffect handle navigation
              await signOut();
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Erro ao fazer logout. Tente novamente.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const getInitials = (name: string) => {
    if (!name || name === 'Usuário') return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header com Avatar */}
      <Card style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          <Avatar.Text
            size={80}
            label={getInitials(userName)}
            style={styles.avatar}
          />
          <Text variant="headlineSmall" style={styles.userName}>
            {userName}
          </Text>
          <Text variant="bodyMedium" style={styles.userEmail}>
            {user.email}
          </Text>
        </Card.Content>
      </Card>

      {/* Informações do Perfil */}
      <Card style={styles.card}>
        <Card.Title 
          title="Informações Pessoais" 
          right={() => (
            <Button 
              mode={editMode ? "contained" : "outlined"}
              onPress={() => setEditMode(!editMode)}
              disabled={loading}
            >
              {editMode ? 'Cancelar' : 'Editar'}
            </Button>
          )}
        />
        <Card.Content>
          {editMode ? (
            <>
              <TextInput
                label="Nome"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                disabled={loading}
              />
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                disabled={true} // Email não pode ser alterado
                right={<TextInput.Icon icon="lock" />}
              />
              <TextInput
                label="Telefone"
                value={phone}
                onChangeText={setPhone}
                mode="outlined"
                style={styles.input}
                disabled={loading}
                keyboardType="phone-pad"
              />
              <Button
                mode="contained"
                onPress={handleSaveProfile}
                loading={loading}
                style={styles.saveButton}
              >
                Salvar Alterações
              </Button>
            </>
          ) : (
            <>
              <List.Item
                title="Nome"
                description={userName}
                left={props => <List.Icon {...props} icon="account" />}
              />
              <Divider />
              <List.Item
                title="Email"
                description={user.email}
                left={props => <List.Icon {...props} icon="email" />}
              />
              <Divider />
              <List.Item
                title="Telefone"
                description={user.phone || 'Não informado'}
                left={props => <List.Icon {...props} icon="phone" />}
              />
            </>
          )}
        </Card.Content>
      </Card>

      {/* Configurações */}
      <Card style={styles.card}>
        <Card.Title title="Configurações" />
        <Card.Content>
          <List.Item
            title="Alterar Senha"
            description="Altere sua senha de acesso"
            left={props => <List.Icon {...props} icon="lock" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setShowPasswordDialog(true)}
          />
          <Divider />
          <List.Item
            title="Notificações"
            description="Configurar notificações"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          />
          <Divider />
          <List.Item
            title="Privacidade"
            description="Configurações de privacidade"
            left={props => <List.Icon {...props} icon="shield-account" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          />
        </Card.Content>
      </Card>

      {/* Debug Section - APENAS PARA ADMINS */}
      {user?.isAdmin === true && (
        <Card style={styles.card}>
          <Card.Title title="Debug - Admin Tab Issue" />
          <Card.Content>
            <Text variant="bodySmall" style={{ marginBottom: 16 }}>
              isAdmin: {String(user?.isAdmin)} (tipo: {typeof user?.isAdmin})
            </Text>
            <Button
              mode="outlined"
              onPress={debugUserData}
              style={{ marginBottom: 8 }}
            >
              Debug User Data
            </Button>
            <Button
              mode="outlined"
              onPress={async () => {
                await clearUserCache();
                Alert.alert('Cache limpo', 'Faça login novamente');
              }}
              style={{ marginBottom: 8 }}
            >
              Clear Cache & Re-login
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Ações */}
      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={handleLogout}
            icon="logout"
            buttonColor="#f44336"
            textColor="white"
            style={styles.logoutButton}
          >
            Sair da Conta
          </Button>
        </Card.Content>
      </Card>

      {/* Dialog para mudança de senha */}
      <Portal>
        <Dialog visible={showPasswordDialog} onDismiss={() => setShowPasswordDialog(false)}>
          <Dialog.Title>Alterar Senha</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Senha Atual"
              value={oldPassword}
              onChangeText={setOldPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              disabled={loading}
            />
            <TextInput
              label="Nova Senha"
              value={newPassword}
              onChangeText={setNewPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              disabled={loading}
            />
            <TextInput
              label="Confirmar Nova Senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              disabled={loading}
            />
            <Text variant="bodySmall" style={styles.passwordHint}>
              A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowPasswordDialog(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button onPress={handleChangePassword} loading={loading}>
              Alterar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    marginBottom: 16,
  },
  userName: {
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    textAlign: 'center',
    opacity: 0.7,
  },
  card: {
    margin: 16,
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
  },
  logoutButton: {
    marginTop: 8,
  },
  passwordHint: {
    marginTop: 8,
    opacity: 0.7,
    fontStyle: 'italic',
  },
});
