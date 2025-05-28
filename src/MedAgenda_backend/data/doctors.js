const doctors = [
  {
    name: 'Dra. Maria Silva',
    specialty: 'Cardiologia',
    crm: '123456-SP',
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200',
    experience: '15 anos',
    rating: 4.8,
    about: 'Especialista em cardiologia com foco em prevenção e tratamento de doenças cardíacas.',
    education: [
      {
        degree: 'Medicina',
        institution: 'USP',
        year: '2008'
      },
      {
        degree: 'Especialização em Cardiologia',
        institution: 'InCor',
        year: '2010'
      }
    ],
    availability: [
      { day: 'Segunda', startTime: '08:00', endTime: '17:00' },
      { day: 'Quarta', startTime: '08:00', endTime: '17:00' },
      { day: 'Sexta', startTime: '08:00', endTime: '12:00' }
    ],
    location: 'São Paulo, SP'
  },
  {
    name: 'Dr. João Santos',
    specialty: 'Clínico Geral',
    crm: '234567-SP',
    profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200',
    experience: '10 anos',
    rating: 4.9,
    about: 'Médico clínico geral com experiência em atendimento familiar e medicina preventiva.',
    education: [
      {
        degree: 'Medicina',
        institution: 'UNIFESP',
        year: '2013'
      }
    ],
    availability: [
      { day: 'Segunda', startTime: '13:00', endTime: '18:00' },
      { day: 'Terça', startTime: '08:00', endTime: '18:00' },
      { day: 'Quinta', startTime: '08:00', endTime: '18:00' }
    ],
    location: 'São Paulo, SP'
  },
  {
    name: 'Dra. Ana Oliveira',
    specialty: 'Dermatologia',
    crm: '345678-SP',
    profileImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200',
    experience: '8 anos',
    rating: 4.7,
    about: 'Dermatologista especializada em tratamentos estéticos e clínicos.',
    education: [
      {
        degree: 'Medicina',
        institution: 'UNESP',
        year: '2015'
      },
      {
        degree: 'Especialização em Dermatologia',
        institution: 'SBD',
        year: '2018'
      }
    ],
    availability: [
      { day: 'Terça', startTime: '09:00', endTime: '18:00' },
      { day: 'Quinta', startTime: '09:00', endTime: '18:00' }
    ],
    location: 'São Paulo, SP'
  },
  {
    name: 'Dr. Pedro Costa',
    specialty: 'Ortopedia',
    crm: '456789-SP',
    profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200',
    experience: '12 anos',
    rating: 4.9,
    about: 'Ortopedista especializado em traumatologia esportiva e cirurgia do joelho.',
    education: [
      {
        degree: 'Medicina',
        institution: 'UNICAMP',
        year: '2011'
      },
      {
        degree: 'Especialização em Ortopedia',
        institution: 'SBOT',
        year: '2014'
      }
    ],
    availability: [
      { day: 'Segunda', startTime: '08:00', endTime: '18:00' },
      { day: 'Quarta', startTime: '08:00', endTime: '18:00' },
      { day: 'Sexta', startTime: '08:00', endTime: '18:00' }
    ],
    location: 'São Paulo, SP'
  }
];

const specialties = [
  'Cardiologia',
  'Clínico Geral',
  'Dermatologia',
  'Ortopedia',
  'Pediatria',
  'Ginecologia',
  'Oftalmologia',
  'Neurologia'
];

module.exports = { doctors, specialties }; 