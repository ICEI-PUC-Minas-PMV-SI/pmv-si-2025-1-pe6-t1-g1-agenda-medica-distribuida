import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  VStack,
  ScrollView,
  Avatar,
  Heading,
  Text,
  HStack,
  Box,
  useToast,
  Icon,
  Pressable,
  Select,
} from 'native-base';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from '../../components/Button';
import { doctorService, appointmentService } from '../../services';

interface Doctor {
  _id: string;
  name: string;
  speciality: string;
  crm: string;
  pricePerAppointment: number;
  doctorImage?: string;
  about?: string;
  scheduledAppointments?: Record<string, string[]>;
}

const AVAILABLE_TIMES = [
  '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00'
];

export default function DoctorDetails() {
  const { id } = useLocalSearchParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    loadDoctor();
  }, [id]);

  async function loadDoctor() {
    try {
      const response = await doctorService.getDoctors({ _id: id });
      if (response.doctors.length > 0) {
        setDoctor(response.doctors[0]);
      }
    } catch (error) {
      toast.show({
        title: 'Erro ao carregar médico',
        description: 'Não foi possível carregar os dados do médico',
        placement: 'top',
        bgColor: 'error.500',
      });
    }
  }

  function getAvailableTimes(date: string) {
    if (!doctor?.scheduledAppointments?.[date]) {
      return AVAILABLE_TIMES;
    }

    return AVAILABLE_TIMES.filter(
      time => !doctor.scheduledAppointments![date].includes(time)
    );
  }

  async function handleScheduleAppointment() {
    if (!selectedDate || !selectedTime) {
      toast.show({
        title: 'Selecione data e horário',
        description: 'Você precisa selecionar uma data e horário para agendar',
        placement: 'top',
        bgColor: 'error.500',
      });
      return;
    }

    try {
      setIsLoading(true);
      const userId = await AsyncStorage.getItem('@MedAgenda:userId');
      
      if (!userId) {
        toast.show({
          title: 'Erro ao agendar',
          description: 'Você precisa estar logado para agendar uma consulta',
          placement: 'top',
          bgColor: 'error.500',
        });
        return;
      }

      await appointmentService.createAppointment({
        userId,
        docId: doctor!._id,
        slotDate: selectedDate,
        slotTime: selectedTime,
      });

      toast.show({
        title: 'Agendamento realizado',
        description: 'Sua consulta foi agendada com sucesso',
        placement: 'top',
        bgColor: 'success.500',
      });

      router.push('/appointments');
    } catch (error) {
      toast.show({
        title: 'Erro ao agendar',
        description: 'Não foi possível realizar o agendamento',
        placement: 'top',
        bgColor: 'error.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!doctor) {
    return (
      <Center flex={1}>
        <Spinner size="lg" color="primary.500" />
      </Center>
    );
  }

  return (
    <ScrollView flex={1} bg="gray.100">
      <VStack flex={1} px={8} pb={16}>
        <HStack w="full" justifyContent="space-between" alignItems="center" mt={12} mb={8}>
          <Pressable onPress={() => router.back()}>
            <Icon
              as={<Feather name="arrow-left" />}
              size={6}
              color="secondary.700"
            />
          </Pressable>
        </HStack>

        <VStack alignItems="center" mb={8}>
          <Avatar
            size="2xl"
            source={doctor.doctorImage ? { uri: doctor.doctorImage } : undefined}
          >
            {doctor.name.charAt(0)}
          </Avatar>
          <Heading color="secondary.700" fontSize="xl" mt={4}>
            {doctor.name}
          </Heading>
          <Text color="secondary.500" fontSize="md">
            {doctor.speciality}
          </Text>
          <Text color="primary.500" fontSize="lg" mt={2}>
            R$ {doctor.pricePerAppointment.toFixed(2)}
          </Text>
        </VStack>

        {doctor.about && (
          <Box bg="white" p={4} rounded="lg" mb={8}>
            <Heading color="secondary.700" fontSize="md" mb={2}>
              Sobre o médico
            </Heading>
            <Text color="secondary.600">{doctor.about}</Text>
          </Box>
        )}

        <Box bg="white" p={4} rounded="lg" mb={8}>
          <Heading color="secondary.700" fontSize="md" mb={4}>
            Agendar consulta
          </Heading>

          <Select
            selectedValue={selectedDate}
            minWidth="200"
            accessibilityLabel="Escolha a data"
            placeholder="Selecione uma data"
            mb={4}
            onValueChange={setSelectedDate}
          >
            {/* Aqui você pode gerar as próximas datas disponíveis */}
            <Select.Item label="2024-05-30" value="2024-05-30" />
            <Select.Item label="2024-05-31" value="2024-05-31" />
            <Select.Item label="2024-06-01" value="2024-06-01" />
          </Select>

          <Select
            selectedValue={selectedTime}
            minWidth="200"
            accessibilityLabel="Escolha o horário"
            placeholder="Selecione um horário"
            mb={4}
            onValueChange={setSelectedTime}
            isDisabled={!selectedDate}
          >
            {getAvailableTimes(selectedDate).map(time => (
              <Select.Item key={time} label={time} value={time} />
            ))}
          </Select>

          <Button
            title="Agendar consulta"
            onPress={handleScheduleAppointment}
            isLoading={isLoading}
          />
        </Box>
      </VStack>
    </ScrollView>
  );
} 