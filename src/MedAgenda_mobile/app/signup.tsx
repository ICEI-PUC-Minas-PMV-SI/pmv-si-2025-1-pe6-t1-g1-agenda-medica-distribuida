import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { VStack, Image, Text, Center, Heading, ScrollView, useToast, Select } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authService } from '../services';

const signUpSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'A senha deve conter letras maiúsculas, minúsculas e números'),
  gender: z.enum(['Male', 'Female'], {
    errorMap: () => ({ message: 'Selecione um gênero' }),
  }),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (YYYY-MM-DD)'),
});

type SignUpData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  });

  async function handleSignUp(data: SignUpData) {
    try {
      setIsLoading(true);
      await authService.signUp(data);
      
      toast.show({
        title: 'Conta criada com sucesso!',
        description: 'Você já pode fazer login no aplicativo.',
        placement: 'top',
        bgColor: 'success.500',
      });
      
      router.push('/signin');
    } catch (error) {
      toast.show({
        title: 'Erro ao criar conta',
        description: 'Ocorreu um erro ao criar sua conta. Tente novamente.',
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
          <Image 
            source={require('../assets/logo.png')}
            alt="MedAgenda Logo"
            w={40}
            h={40}
            resizeMode="contain"
          />

          <Heading color="primary.500" fontSize="xl" mt={4} mb={6}>
            Crie sua conta
          </Heading>
        </Center>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Nome completo"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.name?.message}
            />
          )}
        />

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

        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <FormControl isInvalid={!!errors.gender} mb={4}>
              <Select
                selectedValue={value}
                minWidth="200"
                accessibilityLabel="Selecione o gênero"
                placeholder="Gênero"
                _selectedItem={{
                  bg: "primary.500",
                  endIcon: <CheckIcon size="5" />
                }}
                mt={1}
                onValueChange={onChange}
              >
                <Select.Item label="Masculino" value="Male" />
                <Select.Item label="Feminino" value="Female" />
              </Select>
              <FormControl.ErrorMessage>
                {errors.gender?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="birthdate"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Data de nascimento (YYYY-MM-DD)"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.birthdate?.message}
            />
          )}
        />

        <Button
          title="Criar conta"
          onPress={handleSubmit(handleSignUp)}
          isLoading={isLoading}
        />

        <Center mt={8}>
          <Text color="secondary.600" fontSize="sm" mb={3} fontFamily="body">
            Já tem uma conta?
          </Text>

          <Button
            title="Fazer login"
            variant="outline"
            onPress={() => router.push('/signin')}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
} 