import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  VStack,
  FlatList,
  Heading,
  Text,
  HStack,
  Box,
  useToast,
  Icon,
  Pressable,
  Badge,
  Avatar,
  Center,
} from 'native-base';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { appointmentService } from '../services';

interface Appointment {
  _id: string;
  doctor: {
    _id: string;
    name: string;
    speciality: string;
    doctorImage?: string;
  };
  slotDate: string;
  slotTime: string;
  amount: number;
  cancelled: boolean;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setIsLoading(true);
      const userId = await AsyncStorage.getItem('@MedAgenda:userId');
      
      if (!userId) {
        router.replace('/signin');
        return;
      }

      const response = await appointmentService.getAppointments({ _id: userId });
      setAppointments(response.appointments);
    } catch (error) {
      toast.show({
        title: 'Erro ao carregar agendamentos',
        description: 'Não foi possível carregar seus agendamentos',
        placement: 'top',
        bgColor: 'error.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancelAppointment(appointmentId: string) {
    try {
      setIsLoading(true);
      const userId = await AsyncStorage.getItem('@MedAgenda:userId');
      
      if (!userId) {
        router.replace('/signin');
        return;
      }

      await appointmentService.cancelAppointment({
        userId,
        appointmentId,
      });

      toast.show({
        title: 'Consulta cancelada',
        description: 'Sua consulta foi cancelada com sucesso',
        placement: 'top',
        bgColor: 'success.500',
      });

      loadAppointments();
    } catch (error) {
      toast.show({
        title: 'Erro ao cancelar',
        description: 'Não foi possível cancelar a consulta',
        placement: 'top',
        bgColor: 'error.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bg="gray.100" px={8}>
      <HStack w="full" justifyContent="space-between" alignItems="center" mt={12} mb={8}>
        <Heading color="secondary.700" size="lg">
          Meus Agendamentos
        </Heading>
      </HStack>

      <FlatList
        data={appointments}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <Box
            bg="white"
            rounded="lg"
            mb={4}
            p={4}
            shadow={2}
          >
            <HStack justifyContent="space-between" alignItems="center" mb={4}>
              <HStack space={4} alignItems="center" flex={1}>
                <Avatar
                  size="md"
                  source={item.doctor.doctorImage ? { uri: item.doctor.doctorImage } : undefined}
                >
                  {item.doctor.name.charAt(0)}
                </Avatar>
                <VStack flex={1}>
                  <Text color="secondary.700" fontSize="md" fontFamily="heading">
                    {item.doctor.name}
                  </Text>
                  <Text color="secondary.500" fontSize="sm">
                    {item.doctor.speciality}
                  </Text>
                </VStack>
              </HStack>
              <Badge
                colorScheme={item.cancelled ? 'red' : 'green'}
                rounded="full"
                variant="subtle"
              >
                {item.cancelled ? 'Cancelado' : 'Confirmado'}
              </Badge>
            </HStack>

            <HStack space={4} mb={2}>
              <HStack alignItems="center" space={2}>
                <Icon
                  as={<Feather name="calendar" />}
                  size={4}
                  color="secondary.500"
                />
                <Text color="secondary.600" fontSize="sm">
                  {new Date(item.slotDate).toLocaleDateString('pt-BR')}
                </Text>
              </HStack>

              <HStack alignItems="center" space={2}>
                <Icon
                  as={<Feather name="clock" />}
                  size={4}
                  color="secondary.500"
                />
                <Text color="secondary.600" fontSize="sm">
                  {item.slotTime}
                </Text>
              </HStack>

              <HStack alignItems="center" space={2}>
                <Icon
                  as={<Feather name="dollar-sign" />}
                  size={4}
                  color="secondary.500"
                />
                <Text color="secondary.600" fontSize="sm">
                  R$ {item.amount.toFixed(2)}
                </Text>
              </HStack>
            </HStack>

            {!item.cancelled && (
              <Pressable
                onPress={() => handleCancelAppointment(item._id)}
                bg="error.50"
                p={2}
                rounded="md"
                mt={2}
              >
                <HStack alignItems="center" justifyContent="center" space={2}>
                  <Icon
                    as={<Feather name="x-circle" />}
                    size={4}
                    color="error.500"
                  />
                  <Text color="error.500" fontSize="sm" fontFamily="heading">
                    Cancelar consulta
                  </Text>
                </HStack>
              </Pressable>
            )}
          </Box>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <Center flex={1} mt={10}>
            <Text color="secondary.500" fontSize="md">
              Você não tem agendamentos
            </Text>
          </Center>
        )}
        refreshing={isLoading}
        onRefresh={loadAppointments}
      />
    </VStack>
  );
} 