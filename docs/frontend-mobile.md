# Front-end Móvel

[Inclua uma breve descrição do projeto e seus objetivos.]

Aplicativo desenvolvido em Flutter com o objetivo de disponibilizar uma agenda médica distribuída, permitindo que pacientes e profissionais da saúde realizem agendamentos, visualizem consultas e gerenciem compromissos médicos de forma prática e segura, diretamente pelo dispositivo móvel.

## Projeto da Interface
[Descreva o projeto da interface móvel da aplicação, incluindo o design visual, layout das páginas, interações do usuário e outros aspectos relevantes.]

O aplicativo apresenta uma interface moderna, responsiva e de fácil navegação. A navegação é feita por meio de telas sequenciais e menus que facilitam o acesso às principais funcionalidades como login, cadastro, agendamento, histórico de consultas e perfil do usuário.

### Wireframes

[Inclua os wireframes das páginas principais da interface, mostrando a disposição dos elementos na página.]
Os wireframes foram projetados para garantir uma experiência intuitiva. As principais telas incluem:

Tela de Login

Tela de Cadastro

Tela de Agendamentos

Tela de Histórico de Consultas

Tela de Perfil do Usuário

### Design Visual

[Descreva o estilo visual da interface, incluindo paleta de cores, tipografia, ícones e outros elementos gráficos.]
O design foi baseado nos princípios do Material Design, seguindo as diretrizes visuais do Flutter.

Paleta de Cores: Tons de azul, branco e cinza, representando confiança e profissionalismo na área da saúde.

Tipografia: Fonte padrão do Flutter (Roboto), garantindo legibilidade e consistência.


## Fluxo de Dados

[Diagrama ou descrição do fluxo de dados na aplicação.]

O aplicativo se comunica diretamente com uma API REST hospedada externamente.

A comunicação ocorre via protocolo HTTPS.

Após autenticação, o app recebe um token JWT, que é utilizado nas requisições subsequentes para acessar endpoints protegidos.

Fluxo simplificado:

Login/Cadastro ➝ API ➝ Token JWT

Token ➝ Agendamentos, Consultas, Perfil ➝ Respostas da API ➝ Renderização no App

## Tecnologias Utilizadas

[Lista das tecnologias principais que serão utilizadas no projeto.]

Linguagem: Dart

Framework: Flutter

Gerenciamento de Estado: Provider

Gerenciamento de Dependências: Pubspec

Consumo de API: HTTP (via pacote http)

Persistência Local: Shared Preferences e Flutter Secure Storage

Autenticação: JWT

Controle de Versionamento: Git e GitHub

## Considerações de Segurança

[Discuta as considerações de segurança relevantes para a aplicação distribuída, como autenticação, autorização, proteção contra ataques, etc.]

Autenticação e Autorização: Implementada via JWT. As requisições autenticadas incluem o token no cabeçalho Authorization.

Armazenamento Seguro: O token é armazenado de forma segura utilizando flutter_secure_storage.

Criptografia: Comunicação entre app e API ocorre via HTTPS, garantindo criptografia dos dados em trânsito.

Validação: Os formulários possuem validações para prevenir entradas incorretas ou maliciosas.

Gestão de Sessão: O app realiza verificação da validade do token, garantindo que sessões expiradas sejam desconectadas.

## Implantação

[Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Requisitos de Hardware e Software
   
Mobile (Build Local):

Flutter SDK

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

Clonar o repositório do backend

Executar npm install

Definir variáveis de ambiente:

DATABASE_URL

JWT_SECRET

PORT

Para o app mobile:

Atualizar URLs de API no código

Gerar builds com:

flutter build apk (Android)

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


1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.

## Testes

[Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

Estratégia de Teste:

Validação manual dos fluxos funcionais

Testes unitários (em desenvolvimento no backend e podem ser aplicados no mobile futuramente)

Testes de integração entre app e API

Plano de Teste:

1. Criar casos de teste para cada funcionalidade
   
2. Implementar testes unitários (backend e, opcionalmente, mobile)
   
3.Realizar testes de integração entre API e mobile

4. Executar testes de carga na API usando ferramentas como Postman ou JMeter
   
5. Usar Flutter Test (flutter test) para testes de widgets e lógica no ap.

   
1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.

Flutter Docs

Dart Language

Provider Package

Flutter Secure Storage

HTTP Package Flutter

JWT Decoder

Material Design Guidelines

Node.js Documentation

MongoDB Documentation

Render Docs

Railway Docs
