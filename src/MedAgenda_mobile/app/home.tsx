import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  VStack,
  FlatList,
  Heading,
  Text,
  HStack,
  Avatar,
  Box,
  Pressable,
  useToast,
  Select,
  Icon,
  Input,
  Center,
} from 'native-base';
import { Feather } from '@expo/vector-icons';

import { doctorService } from '../services';

interface Doctor {
  _id: string;
  name: string;
  speciality: string;
  crm: string;
  pricePerAppointment: number;
  doctorImage?: string;
  about?: string;
}

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [specialityFilter, setSpecialityFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    loadDoctors();
  }, []);

  async function loadDoctors() {
    try {
      setIsLoading(true);
      const filters = {
        ...(specialityFilter && { speciality: specialityFilter }),
      };
      const response = await doctorService.getDoctors(filters);
      setDoctors(response.doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchText.toLowerCase())
      ));
    } catch (error) {
      toast.show({
        title: 'Erro ao carregar médicos',
        description: 'Não foi possível carregar a lista de médicos',
        placement: 'top',
        bgColor: 'error.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleDoctorPress(doctor: Doctor) {
    router.push({
      pathname: '/doctor/[id]',
      params: { id: doctor._id },
    });
  }

  return (
    <VStack flex={1} bg="gray.100" px={8}>
      <HStack w="full" justifyContent="space-between" alignItems="center" mt={12} mb={8}>
        <Heading color="secondary.700" size="lg">
          Médicos
        </Heading>
      </HStack>

      <Input
        placeholder="Buscar médico..."
        mb={4}
        InputLeftElement={
          <Icon
            as={<Feather name="search" />}
            size={5}
            ml={2}
            color="secondary.300"
          />
        }
        onChangeText={setSearchText}
        value={searchText}
        onSubmitEditing={loadDoctors}
      />

      <Select
        selectedValue={specialityFilter}
        minWidth="200"
        accessibilityLabel="Filtrar por especialidade"
        placeholder="Todas as especialidades"
        mb={4}
        onValueChange={(value) => {
          setSpecialityFilter(value);
          loadDoctors();
        }}
      >
        <Select.Item label="Todas" value="" />
        <Select.Item label="Cardiologia" value="Cardiologia" />
        <Select.Item label="Dermatologia" value="Dermatologia" />
        <Select.Item label="Pediatria" value="Pediatria" />
        <Select.Item label="Psiquiatria" value="Psiquiatria" />
      </Select>

      <FlatList
        data={doctors}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleDoctorPress(item)}>
            <Box
              bg="white"
              rounded="lg"
              mb={4}
              p={4}
              shadow={2}
            >
              <HStack space={4} alignItems="center">
                <Avatar
                  size="lg"
                  source={item.doctorImage ? { uri: item.doctorImage } : undefined}
                >
                  {item.name.charAt(0)}
                </Avatar>
                <VStack flex={1}>
                  <Text color="secondary.700" fontSize="md" fontFamily="heading">
                    {item.name}
                  </Text>
                  <Text color="secondary.500" fontSize="sm">
                    {item.speciality}
                  </Text>
                  <Text color="primary.500" fontSize="sm" mt={1}>
                    R$ {item.pricePerAppointment.toFixed(2)}
                  </Text>
                </VStack>
                <Icon
                  as={<Feather name="chevron-right" />}
                  size={5}
                  color="secondary.300"
                />
              </HStack>
            </Box>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <Center flex={1} mt={10}>
            <Text color="secondary.500" fontSize="md">
              Nenhum médico encontrado
            </Text>
          </Center>
        )}
        refreshing={isLoading}
        onRefresh={loadDoctors}
      />
    </VStack>
  );
} 