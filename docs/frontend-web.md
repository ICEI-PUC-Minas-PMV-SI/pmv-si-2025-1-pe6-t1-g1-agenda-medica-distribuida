# Front-end Web

O MedAgenda é uma solução web e mobile desenvolvida para otimizar o processo de agendamento de consultas médicas em uma clínica pública. O sistema visa reduzir a espera e simplificar o gerenciamento das agendas de médicos e pacientes, proporcionando uma interface acessível para reservas e acompanhamento de consultas.

## Projeto da Interface Web

O projeto foi idealizado e implementado com um enfoque prioritário na usabilidade, eficiência e na qualidade da experiência do usuário. O design visual da aplicação apresenta características limpas, modernas e intuitivas, sustentado por uma paleta de cores predominantemente azul-marinho e branco. A harmonia entre essas tonalidades é estrategicamente utilizada para ressaltar informações cruciais e elementos de navegação. A estrutura das páginas foi projetada de maneira lógica e funcional, otimizando a navegação e facilitando o acesso às principais ferramentas.

- Página de Login: Permite aos usuários autenticar-se na aplicação por meio de suas credenciais pessoais.
- Página de Agendamento de Consultas: Oferece aos usuários a possibilidade de agendar novas consultas, selecionando o profissional médico, informações específicas e horários adequados.
- Página de Perfil do Paciente: Apresenta um painel com informações sobre o paciente e consultas agendadas.
- Página de Administrador: Centraliza funcionalidades administrativas, como cadastro, edição e exclusão de médicos.
- Página “Sobre nós”: Fornece uma informações sobre o MedAgenda, destacando sua proposta e valores.
- Página de Contato: Disponibiliza canais de comunicação para facilitar o contato com o MedAgenda.

### Wireframes

MedAgenda - Homepage

![MedAgenda - Homepage (5)](https://github.com/user-attachments/assets/0031dafe-7a76-4038-9540-99e8ab89a9db)

MedAgenda - Appointment Page

![MedAgenda - Appointment Page (2)](https://github.com/user-attachments/assets/835bd99c-0581-4c2c-aa6a-645364852c8d)

MedAgenda - Doctors Page

![Prescripto - Doctors Page (2)](https://github.com/user-attachments/assets/4c1df396-f8fd-4256-8209-d75e9a393ae9)

MedAgenda - About Page

![Prescripto - About Page (5)](https://github.com/user-attachments/assets/13d95e22-1931-4673-b35d-1c6f65adc4d7)

MedAgenda - Contact Page

![Prescripto - Contact Page (2)](https://github.com/user-attachments/assets/be4b951b-f8a6-4c4a-b877-832578755593)

MedAgenda - Profile Page

![Prescripto - Profile Page (7)](https://github.com/user-attachments/assets/78a17dc6-0a76-4ac7-b396-52e181020449)


MedAgenda - Sign Up Page

![Prescripto - Sign Up Page (1)](https://github.com/user-attachments/assets/2e163b27-270b-459a-8086-77b6e83f72d5)


MedAgenda - My Appointments Page

![Prescripto - My Appointments Page (1)](https://github.com/user-attachments/assets/45961a5c-3fe3-4961-9aa6-c11567cd53b9)

MedAgenda - Login Page

![Prescripto - Login Page (1)](https://github.com/user-attachments/assets/ab6c314f-a546-4de9-a32b-03785d71e94d)


MedAgenda - Admin Panel - Consultas

![Admin Panel (8)](https://github.com/user-attachments/assets/8f717822-8932-4dd0-b858-0763ea77c39d)

MedAgenda -  Admin Panel - Adicionar Doutor

![Admin Panel (8)](https://github.com/user-attachments/assets/5d86bb76-1422-4704-aff7-ca2a5290bbf6)

MedAgenda - Admin Panel - Lista de Doutores

![Admin Panel (1)](https://github.com/user-attachments/assets/c612c2de-7a75-40ab-8641-7299c0be6d19)


MedAgenda - Login Admin

![Admin Login (2)](https://github.com/user-attachments/assets/cb1a2d36-b8da-4204-b566-a88e7aec6b47)



[Inclua os wireframes das páginas principais da interface, mostrando a disposição dos elementos na página.]

### Design Visual

A interface do sistema adota uma abordagem utility-first por meio do framework Tailwind CSS, permitindo a aplicação direta de classes utilitárias no código HTML/JSX para a estilização de elementos. Essa metodologia promove um desenvolvimento ágil e uma personalização refinada da interface, com foco em eficiência e consistência visual.

A paleta de cores apresenta um estilo visual moderno e funcional, com foco em clareza e usabilidade. A paleta de cores predominante utiliza tons de azul, branco e cinza, proporcionando um visual limpo e profissional, adequado ao contexto da área da saúde. Os tons de azul transmitem confiança e tranquilidade, enquanto os fundos brancos e os elementos em cinza claro ajudam a manter uma aparência neutra e organizada. Essas cores são aplicadas em botões, textos e fundos, garantindo contraste adequado, harmonia visual e acessibilidade para os usuários.

A tipografia é gerenciada através das classes utilitárias do Tailwind, como text-base e font-semibold que asseguram uma hierarquia visual clara e uma boa legibilidade em diferentes tamanhos de tela. O projeto pode utilizar fontes padrão do sistema ou integrar fontes personalizadas por meio de serviços como o Google Fonts.

Os ícones utilizados na interface são provenientes de bibliotecas compatíveis com Tailwind CSS, como o Heroicons, integrando-se de maneira fluida ao restante da interface. Elementos gráficos como botões, campos de entrada e cartões são estilizados utilizando classes específicas do Tailwind, o que favorece a consistência no design e facilita a criação de componentes reutilizáveis.

Por fim, o layout é construído com classes como flex, grid, p-4 e m-2, que proporcionam uma estrutura visual organizada e responsiva. O uso de breakpoints (sm:, md:, lg:, xl:) permite adaptar a interface a diferentes tamanhos de tela, garantindo uma boa experiência tanto em dispositivos móveis quanto em desktops.

## Fluxo de Dados

O fluxo de dados do MedAgenda ocorre entre o cliente (navegador), a API e o banco de dados:

Requisição do Cliente: O usuário realiza uma ação (ex.: agendar consulta).
Processamento no Back-end: A API recebe a solicitação, valida, e consulta ou atualiza o banco.
Resposta ao Cliente: O back-end envia dados de confirmação ou resposta de erro ao front-end.

## Tecnologias Utilizadas

- React: Para criação das interfaces responsivas.
- JavaScript: Para a interatividade da página e manipulação assíncrona de dados.
- JWT (JSON Web Tokens): Para autenticação e segurança da aplicação.

## Considerações de Segurança

- Autenticação: JWT para sessões seguras de usuários.
- Autorização: Diferentes níveis de acesso (pacientes e administradores).
- Armazenamento Seguro: Criptografia para dados sensíveis e senhas.

## Implantação

### 1. Requisitos de Hardware e Software

**Hardware mínimo recomendado (por instância):**
- CPU: 1 vCPU
- RAM: 2 GB
- Armazenamento: 10 GB SSD

**Software necessário:**
- Instalar o Node.js (versão 18 ou superior)
- Instalar o gerenciador de pacotes (npm ou yarn).
- Instalar o Git para clonar o repositório
- Executar npm install ou yarn install para instalar as dependências

  
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.

## Testes

[Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.


## Instalação de Dependências
Esta seção descreve como configurar o ambiente de implantação do projeto MedAgenda, incluindo a instalação de dependências e a configuração das variáveis de ambiente. Antes de começar, certifique-se de ter a branch **front-sh** selecionada e o Node.js instalado. Você pode baixar o instalador oficial no site: https://nodejs.org/en/download/

### Backend

- Abra o terminal
- Acesse a pasta backend:  
`cd src/MedAgenda_backend`
- Instale as dependências:  
`npm install`

### Frontend

- Abra o terminal
- Acesse a pasta frontend:  
`cd src/MedAgenda_frontend`
- Instale as dependências:  
`npm install`

### Admin Panel

- Abra o terminal
- Acesse a pasta admin:  
`cd src/admin`
- Instale as dependências:  
`npm install`

## Configuração das Variáveis de Ambiente

Dentro da pasta backend, crie um arquivo chamado `.env` com o seguinte conteúdo:

VITE_BACKEND_URL = https://med-agenda-backend.vercel.app

MONGODB_URI = "sua_URI_de_conexao_com_o_MongoDB"

CLOUDINARY_NAME = "nome_do_seu_cloudinary"

CLOUDINARY_API_KEY = "sua_api_key_do_cloudinary"

CLOUDINARY_SECRET_KEY = "sua_secret_key_do_cloudinary"


### Explicação das Variáveis:

- VITE_BACKEND_URL: URL onde o backend está hospedado.
- MONGODB_URI: String de conexão com o MongoDB. Exemplo de formato:  
mongodb+srv://usuario:senha@cluster0.mongodb.net/nomedobanco?retryWrites=true&w=majority
- CLOUDINARY_NAME, CLOUDINARY_API_KEY e CLOUDINARY_SECRET_KEY: Obtidos após criar uma conta gratuita no site https://cloudinary.com/

## Inicialização dos Servidores

### Rodar o Backend

Antes de iniciar o frontend ou o painel admin, certifique-se de que o backend está rodando. Execute o comando abaixo dentro da pasta backend:  
`npm run dev`

### Rodar o Frontend

Dentro da pasta frontend, execute:  
`npm run dev`

### Rodar o Admin Panel

Dentro da pasta admin, execute:  
`npm run dev`

Importante: sempre inicie o backend antes de iniciar o frontend e o painel admin.

4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

# Referências

- **TAILWIND CSS**. *Introduction to Tailwind CSS*. GeeksforGeeks, 2024. Disponível em: [https://www.geeksforgeeks.org/css/introduction-to-tailwind-css/](https://www.geeksforgeeks.org/css/introduction-to-tailwind-css/). Acesso em: 4 jun. 2025, 14:22.

- **TAILWIND LABS**. *Framework guides – Get started with Tailwind CSS*. 2025. Disponível em: [https://tailwindcss.com/docs/installation/framework-guides](https://tailwindcss.com/docs/installation/framework-guides). Acesso em: 4 jun. 2025, 14:25.

- **REACT.DEV**. *Getting Started with React*. 2025. Disponível em: [https://react.dev/docs/getting-started](https://react.dev/docs/getting-started). Acesso em: 20 jun. 2025, 15:30.

- **VITE.DEV**. *Introduction to Vite – Guide*. 2025. Disponível em: [https://vite.dev/guide](https://vite.dev/guide). Acesso em: 20 jun. 2025, 15:35.

