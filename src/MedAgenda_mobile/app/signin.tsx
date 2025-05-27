import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { VStack, Icon, Text, Center, Heading, ScrollView, useToast } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authService } from '../services';

const signInSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
});

type SignInData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  });

  async function handleSignIn(data: SignInData) {
    try {
      setIsLoading(true);
      const response = await authService.signIn(data);
      
      // Aqui você pode salvar o token no AsyncStorage
      // await AsyncStorage.setItem('@MedAgenda:token', response.token);
      
      router.push('/home');
    } catch (error) {
      toast.show({
        title: 'Erro ao fazer login',
        description: 'Verifique suas credenciais e tente novamente',
        placement: 'top',
        bgColor: 'error.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <VStack flex={1} px={10} pb={16}>
        <Center my={24}>
          <Icon 
            as={Feather}
            name="activity"
            size={16}
            color="primary.500"
          />

          <Heading color="primary.500" fontSize="xl" mt={4} mb={6}>
            Acesse sua conta
          </Heading>
        </Center>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Senha"
              secureTextEntry
              onChangeText={onChange}
              value={value}
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Button
          title="Entrar"
          onPress={handleSubmit(handleSignIn)}
          isLoading={isLoading}
        />

        <Center mt={8}>
          <Text color="secondary.600" fontSize="sm" mb={3} fontFamily="body">
            Ainda não tem acesso?
          </Text>

          <Button
            title="Criar conta"
            variant="outline"
            onPress={() => router.push('/signup')}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
} 