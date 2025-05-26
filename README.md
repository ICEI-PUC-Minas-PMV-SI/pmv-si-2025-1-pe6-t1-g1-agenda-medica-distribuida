# MedAgenda - Sistema de Agendamento Médico

## Configuração do Ambiente

### Backend (Node.js)

1. Navegue até a pasta do backend:
```bash
cd src/MedAgenda_backend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` baseado no `.env.example` e configure suas variáveis de ambiente:
```
PORT=5000
MONGODB_URI=sua_uri_do_mongodb
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=7d
```

4. Inicie o servidor:
```bash
npm start
```

### Frontend (React Native)

1. Navegue até a pasta do frontend:
```bash
cd src/MedAgenda_mobile
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o aplicativo:
```bash
npx expo start
```

## Funcionalidades

### Médicos
- Lista de médicos por especialidade
- Detalhes do médico
- Gerenciamento de disponibilidade
- Perfil com foto, especialidade e experiência

### Agendamentos
- Criação de novos agendamentos
- Listagem de agendamentos
- Cancelamento de agendamentos
- Filtro por status

### Usuários
- Cadastro
- Login
- Atualização de perfil

## Dados Iniciais

O sistema já vem com alguns dados pré-cadastrados:

### Especialidades
- Cardiologia
- Clínico Geral
- Dermatologia
- Ortopedia
- Pediatria
- Ginecologia
- Oftalmologia
- Neurologia

### Médicos
- Dra. Maria Silva (Cardiologia)
- Dr. João Santos (Clínico Geral)
- Dra. Ana Oliveira (Dermatologia)
- Dr. Pedro Costa (Ortopedia)

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- MongoDB
- JWT para autenticação
- Joi para validação

### Frontend
- React Native
- Expo
- Axios
- AsyncStorage
- React Navigation
