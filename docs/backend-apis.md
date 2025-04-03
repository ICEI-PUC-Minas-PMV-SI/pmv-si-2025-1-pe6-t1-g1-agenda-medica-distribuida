# APIs e Web Services

Esta API tem por objetivo cadastar, atualizar, listar e excluir usuários e seus agendamentos. O paciente poderá agendar a consulta conforme a especialidade médica desejada e também poderá cancelar sua consulta. O consultório poderá cadastrar e alterar os agendamentos, médicos e seus horários disponíveis. 

A API foi desenvolvida seguindo os padrões REST, e autenticando os usuários com JWT. A documentação foi feita utilizando Swagger. 

## Objetivos da API

- **Gerenciar agendamentos de consultas:**
  
    A API vai criar os agendamentos baseados na especialidade escolhida pelo pacientes e na disponibilidade dos médicos. A API também poderá atualizar e cancelar a consulta. Além disso, será possível visualizar os agendamentos realizados, tanto por médico como por paciente.
    
- **Gerenciar o paciente:**
  
    A API vai cadastrar com segurança login e senha de usuário para o paciente. Também será possível exluir um usuário e seus agendamentos relacionados.

- **Gerenciar os médicos:**

    Através do usuário da clínica será possível a inclusão, alteração, exclusão e visualização dos médicos.

## Modelagem da Aplicação

A modelagem da aplicação segue o padrão de API REST, onde cada recurso corresponde a uma entidade do sistema. As principais entidades incluem:

Usuário: Representado por pacientes e administradores.

Consulta: Representa os dados de uma consulta médica, incluindo data, hora, paciente e médico.



![Imagem do WhatsApp de 2025-04-02 à(s) 21 15 54_8337d146](https://github.com/user-attachments/assets/5e038037-209b-45c3-bab4-4c1309a15586)


## Tecnologias Utilizadas

- Express.js : Framework web para aplicações node.
- React/Next : Biblioteca para aplicações criação de interfaces web.
- React Native/Expo: Framework para desenvolvimente de aplicações mobile nativas, tanto para Android como IOS.
- MongoDB : Sistema de gerenciamento de banco de dados não relacional.


## API Endpoints

A figura abaixo mostra o localhost na ferramenta SWAGGER:

![image](https://github.com/user-attachments/assets/401bea6a-b632-4782-ae77-4f779c3cd294)
![image](https://github.com/user-attachments/assets/e28a6e35-40fa-4cf8-95bb-2c057fd09d82)


## Considerações de Segurança

[Discuta as considerações de segurança relevantes para a aplicação distribuída, como autenticação, autorização, proteção contra ataques, etc.]

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

1. **OPENAPI INITIATIVE**. *OpenAPI Specification v3.1.0*. 2023. Disponível em: <https://spec.openapis.org/oas/latest.html>. Acesso em: 3 abr. 2025, 21:00.

2. **JWT.IO**. *Introduction to JSON Web Tokens*. 2024. Disponível em: <https://jwt.io/introduction/>. Acesso em: 3 abr. 2025, 21:07.

3. **SWAGGER**. *Swagger UI Documentation*. 2025. Disponível em: <https://swagger.io/tools/swagger-ui/>. Acesso em: 3 abr. 2025, 21:15.
