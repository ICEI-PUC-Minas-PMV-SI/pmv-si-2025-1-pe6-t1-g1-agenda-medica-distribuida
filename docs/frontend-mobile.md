# Front-end Móvel


Aplicativo desenvolvido em React-Native com o objetivo de disponibilizar uma agenda médica distribuída, permitindo que pacientes e profissionais da saúde realizem agendamentos, visualizem consultas e gerenciem compromissos médicos de forma prática e segura, diretamente pelo dispositivo móvel.

## Projeto da Interface

O aplicativo apresenta uma interface moderna, responsiva e de fácil navegação. A navegação é feita por meio de telas sequenciais e menus que facilitam o acesso às principais funcionalidades como login, cadastro, agendamento, histórico de consultas e perfil do usuário. Há ainda um acesso especifico de Administrador para gestão do cadastro de Médicos. 

### Wireframes

Os wireframes foram projetados para garantir uma experiência intuitiva. As principais telas incluem:

* Tela de Login 

![Imagem do WhatsApp de 2025-06-10 à(s) 21 34 03_dac96d89](https://github.com/user-attachments/assets/f3ce6a7a-32d1-43ed-bb49-f01818427f1d)


* Tela de Cadastro

![Imagem do WhatsApp de 2025-06-10 à(s) 21 34 02_bccaf580](https://github.com/user-attachments/assets/04f5fed6-a143-405f-99d0-1476cbc20241)


* Tela de Agendamentos

![Imagem do WhatsApp de 2025-06-10 à(s) 21 34 02_fbdbb591](https://github.com/user-attachments/assets/54412017-e9f7-455a-8d32-51747f966a15)


* Tela de Histórico de Consultas

![Imagem do WhatsApp de 2025-06-10 à(s) 21 34 02_33c67873](https://github.com/user-attachments/assets/e59a4110-7405-4a76-a7a2-204d2c6d4dfa)


* Tela de Perfil do Usuário

![Imagem do WhatsApp de 2025-06-10 à(s) 21 34 01_0e07e630](https://github.com/user-attachments/assets/733dd2c9-052f-41ff-85c6-70deee47994c)

* Tela de administração dos Médicos - Cadastro do Médico

![Imagem do WhatsApp de 2025-06-10 à(s) 21 34 01_1af601c4](https://github.com/user-attachments/assets/a76ccf68-f6cc-4667-9094-6e2fc127d1d0)

* Tela de cadastrar, editar ou remover Medicos

![Imagem do WhatsApp de 2025-06-10 à(s) 21 34 01_295cbbeb](https://github.com/user-attachments/assets/2e673ff0-bbd9-4416-bcf6-abe4d529d218)


### Design Visual


O design foi baseado nos princípios do Material Design, seguindo as diretrizes visuais do React-Native.

Paleta de Cores: Tons de azul, branco e cinza, representando confiança e profissionalismo na área da saúde.

Tipografia: Fonte Roboto, garantindo legibilidade e consistência.


## Fluxo de Dados


O aplicativo se comunica diretamente com uma API REST hospedada externamente no vercel (https://med-agenda-backend.vercel.app/)

A comunicação ocorre via protocolo HTTPS.

Após autenticação, o app recebe um token JWT, que é utilizado nas requisições subsequentes para acessar endpoints protegidos.

Fluxo simplificado:

Login/Cadastro ➝ API ➝ Token JWT

Token ➝ Agendamentos, Consultas, Perfil ➝ Respostas da API ➝ Renderização no App

Arquitetura Geral do fluxo de dados

A aplicação MedAgenda Mobile utiliza uma arquitetura baseada em React Native com Expo Router, organizando o fluxo de dados através de três camadas principais:

- Camada de Apresentação (UI)
Localização: src/MedAgenda_mobile/app/(tabs)/
Componentes principais: profile.tsx, appointments.tsx, doctors.tsx, new-appointment.tsx
Responsabilidade: Renderização da interface e interação com usuário

- Camada de Estado Global
Localização: src/MedAgenda_mobile/context/AuthContext.tsx
Responsabilidade: Gerenciamento centralizado do estado de autenticação e dados do usuário

- Camada de Serviços
Localização: src/MedAgenda_mobile/services/api.ts
Responsabilidade: Comunicação com backend, transformação de dados e cache local

Fluxo Detalhado de Dados

Inicialização da Aplicação

  1. Carregamento do Context Provider:

   // _layout.tsx
   <AuthProvider>
     <Stack screenOptions={{ headerShown: false }}>
       <Stack.Screen name="(auth)" />
       <Stack.Screen name="(tabs)" />
     </Stack>
   </AuthProvider>

  2. Verificação de Dados Armazenados:
  
    O AuthContext verifica automaticamente dados no AsyncStorage
    Recupera token de autenticação e dados do usuário
    Sanitiza dados críticos como isAdmin e verified

Fluxo de Autenticação

  Login (signIn):
    signIn(email, password) → 
    auth.login(email, password) → 
    Backend API → 
    Transformação de dados (transformUser) → 
    Armazenamento local (AsyncStorage) → 
    Atualização do Context → 
    Navegação automática

Persistência de Dados:

  Token: Armazenado em AsyncStorage com chave 'authToken'
  Dados do usuário: Armazenados em AsyncStorage com chave 'user'
  Interceptador de requisições: Adiciona automaticamente o token em todas as chamadas API

Fluxo de Dados nas Telas

  Tela de Perfil (profile.tsx):
  
    1.Inicialização:
    const { user, updateUser } = useAuth(); // Obtém dados do context

    2. Estratégias de Recuperação de Nome:
    
      - Prioridade 1: Dados do context (user.name)
      - Prioridade 2: Dados do AsyncStorage
      - Prioridade 3: Extração do token JWT
      - Prioridade 4: Chamada à API (users.getProfile())
      - Fallback: "Usuário" como padrão

    3. Fluxo de Atualização:

      Edição do perfil → 
      handleSaveProfile() → 
      Validação local → 
      updateUser() → 
      AsyncStorage.setItem() → 
      Context atualizado → 
      UI re-renderizada

Tela de Agendamentos (appointments.tsx):

  1. Carregamento de Dados:
     
      useEffect(() => {
         if (user?.id) {
           appointments.getByUserId(user.id) → 
           Backend API → 
           transformAppointment() → 
           setAppointmentsList()
         }
       }, [user?.id]);

  2. Transformação de Dados Backend:

    - Backend Structure: BackendAppointment com referências populadas
    - Frontend Structure: Appointment com objetos doctor e user completos
    - Mapeamento: _id → id, slotDate → date, etc.

  Gerenciamento de Estado

  Estado Local vs Global:

    Estado Global (AuthContext):
    
    - Dados do usuário logado
    - Status de autenticação
    - Funções de login/logout
    
    Estado Local (useState):
    
    - Listas de dados específicos da tela (agendamentos, médicos)
    - Estados de loading e erro
    - Formulários e inputs temporários

    Estratégia de Cache:
    
    - Primeiro Nível: Context API (dados em memória)
    - Segundo Nível: AsyncStorage (persistência local)
    - Terceiro Nível: API Backend (fonte de verdade)

Interceptadores e Middleware

    Request Interceptor:

      api.interceptors.request.use(async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      config.headers.client = 'not-browser'; // Identificação para backend
      return config;
      });

  Response Interceptor:

      api.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            // Auto-logout em caso de token expirado
            AsyncStorage.removeItem('authToken');
            AsyncStorage.removeItem('user');
           }
          return Promise.reject(error);
        }
      );

Transformação de Dados

    Backend → Frontend:

      const transformDoctor = (backendDoctor: BackendDoctor): Doctor => ({
        id: backendDoctor._id,
        name: backendDoctor.name,
        specialty: backendDoctor.speciality, // Mapeamento de campo
        image: backendDoctor.doctorImage || backendDoctor.image,
        // ... outros campos
      }); 
 
Tratamento de Erros

  - Nível de Serviço: handleApiError() padroniza erros da API
  - Nível de Componente: Estados de loading e mensagens de erro
  - Nível Global: Interceptadores para erros de autenticação


Refresh e Sincronização

  Pull-to-Refresh:
  
    const onRefresh = async () => {
      setRefreshing(true);
      await loadAppointments(); // Recarrega dados do backend
      setRefreshing(false);
    };


Auto-Refresh:

  - Dados são recarregados quando o usuário navega entre telas
  - useEffect com dependências monitora mudanças no context

## Tecnologias Utilizadas

Linguagem: React-Native

Framework: Expo SDK 53.0.9 - React 19.0.0 - React Native 0.79.2 - Expo Router 5.0.7

Gerenciamento de Estado: React Context API + useState/useEffect

Gerenciamento de Dependências: NPM (Node Package Manager)

Consumo de API: HTTPS (via pacote https)

Persistência Local: AsyncStorage

Autenticação: JWT

Controle de Versionamento: Git e GitHub


## Considerações de Segurança

Autenticação e Autorização:
   * JWT (JSON Web Tokens) com expiração de 8 horas; 
   * Verificação rigorosa de roles: user?.isAdmin === true (boolean estrito);
   * Interceptor automático para adicionar token em requisições
   *Header personalizado (client: 'not-browser') para identificação
   *Sanitização de dados do usuário no frontend.

Armazenamento Seguro: 
   * AsyncStorage para persistência local (nativo React Native)
   * Limpeza automática em caso de token inválido (401)
   * Dados sanitizados antes do armazenamento

Criptografia: 
   * Comunicação HTTPS com backend (positivo)
   * Hashing de senhas apenas no backend (bcrypt)
   * Validação: Os formulários possuem validações para prevenir entradas incorretas ou maliciosas.

Gestão de Sessão:
   * Expiração automática de tokens (8 horas)
   * Logout limpa dados locais completamente
   * Interceptor detecta 401 e remove tokens automaticamente
   * Loading states para evitar race conditions

Validação:
   * Validação de senhas com regex complexo: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$
   * TypeScript para tipagem estática
   * Joi no backend para validação de schemas
   * Validação de email com domínios permitidos

## Implantação


1. Requisitos de Hardware e Software
   
Mobile (Build Local):

SDK e Expo

Android Studio (Android) ou Xcode (iOS)

Dispositivo Android (mínimo Android 8.0) ou iOS (mínimo iOS 12) ou emuladores

Backend/API:

CPU: 1 vCPU ou mais

RAM: 1 GB (mínimo)

Armazenamento: 1 GB ou mais

Sistema Operacional: Ubuntu 20.04 ou superior

Node.js v18+

Banco de dados: MongoDB, PostgreSQL ou similar

2. Plataforma de Hospedagem
   
Backend/API: Render, Railway, Heroku, Vercel ou AWS (Elastic Beanstalk ou EC2)

Banco de Dados: MongoDB Atlas, Supabase (PostgreSQL), ElephantSQL ou outro

Mobile:

Android: Google Play Store ou distribuição via APK

3. Configuração do Ambiente de Implantação
   
Instalar Node.js no servidor

Clonar o repositório do GitHub

Executar npm install

Definir variáveis de ambiente:

DATABASE_URL

JWT_SECRET

PORT

Para o app mobile:

Atualizar URLs de API no código

Gerar builds com:

flutter build apk (IOs) 
Android build apk (Android)

4. Deploy da Aplicação
   
No backend:

Configurar o deploy automático via GitHub na plataforma escolhida

Inserir as variáveis de ambiente no painel da plataforma

Executar o app (npm run start ou configuração automática)

No mobile:

Submeter para Google Play ou Apple Store

Ou distribuir manualmente via APK (Android) e TestFlight (iOS)

5. Testes em Produção
    
Funcional: Testar todos os fluxos do app (login, cadastro, agendamento, etc.)

Integração: Verificar comunicação entre app e API

Segurança: Testar validade de tokens e rotas protegidas

Performance: Avaliar tempo de resposta e estabilidade

Cross-Plataforma: Verificar compatibilidade em diferentes versões de Android e iOS

## Testes

Estratégia de Teste:

Validação manual dos fluxos funcionais

Testes unitários (em desenvolvimento no backend e podem ser aplicados no mobile futuramente)

Testes de integração entre app e API

Plano de Teste:

1. Criar casos de teste para cada funcionalidade
   
2. Implementar testes unitários (backend e, opcionalmente, mobile)
   
3. Realizar testes de integração entre API e mobile

4. Executar testes de carga na API usando ferramentas como Postman ou JMeter


--------------------------------------------------------
   
# Referências

Expo
EXPO. Expo Documentation. Disponível em: docs.expo.dev. Acesso em: maio/jun. 2025

Flutter Docs
FLUTTER. Flutter Documentation. Disponível em: docs.flutter.dev. Acesso em: maio/jun. 2025.

HTTP Package Flutter
FLUTTER. Fetch data from the internet - Flutter. Disponível em: docs.flutter.dev. Acesso em: maio/jun. 2025.

JWT Decoder
JWT.IO. JSON Web Tokens - jwt.io. Disponível em: jwt.io. Acesso em: maio/jun. 2025.

Material Design Guidelines
GOOGLE. Material Design Guidelines. Disponível em: m2.material.io. Acesso em: maio/jun. 2025.

Node.js Documentation
NODE.JS FOUNDATION. Node.js Documentation. Disponível em: nodejs.org. Acesso em: maio/jun. 2025.

MongoDB Documentation
MONGODB INC. MongoDB Documentation. Disponível em: mongodb.com. Acesso em: maio/jun. 2025.

Railway Docs
RAILWAY. Railway Documentation. Disponível em: docs.railway.com. Acesso em: maio/jun. 2025.

React-Native Language
META PLATFORMS. React Native Documentation. Disponível em: reactnative.dev. Acesso em: maio/jun. 2025.

Render Docs
RENDER. Render Documentation. Disponível em: render.com. Acesso em: maio/jun. 2025.





