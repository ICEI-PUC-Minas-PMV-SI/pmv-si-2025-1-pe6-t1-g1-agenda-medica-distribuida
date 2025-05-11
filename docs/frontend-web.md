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

MedAgenda - Admin Panel - Consultas

![Admin Panel (8)](https://github.com/user-attachments/assets/8f717822-8932-4dd0-b858-0763ea77c39d)

MedAgenda -  Admin Panel - Adicionar Doutor

![Admin Panel (8)](https://github.com/user-attachments/assets/5d86bb76-1422-4704-aff7-ca2a5290bbf6)

MedAgenda - Admin Panel - Lista de Doutores

![Admin Panel (1)](https://github.com/user-attachments/assets/c612c2de-7a75-40ab-8641-7299c0be6d19)






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

[Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.

## Testes

[Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.
