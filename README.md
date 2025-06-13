# Agenda Médica Distribuída

`CURSO: Sistemas de Informação`

`DISCIPLINA: Projeto - Arquitetura de Sistemas Distribuídos`

`SEMESTRE: 6º`

Agenda Médica Distribuída – Sistema que permite o agendamento de consultas médicas de diferentes clínicas e profissionais de saúde, garantindo sincronização e disponibilidade.

## Integrantes

* Breno de Oliveira Pereira
* Diego Calado Freitas
* Maurício Martins dos Santos
* Rodrigo Pena Furtado
* Samara Mariah dos Santos
* Sílvia de Oliveira Cunha

## Orientador

* Kleber Jacques Ferreira de Souza

# Planejamento

| Etapa         | Atividades |
|  :----:   | ----------- |
| ETAPA 1         |[Documentação de Contexto](docs/contexto.md) <br> |
| ETAPA 2         |[Planejar, desenvolver e gerenciar APIs e Web Services](docs/backend-apis.md) <br> |
| ETAPA 3         |[Planejar, desenvolver e gerenciar uma aplicação Web](docs/frontend-web.md) |
| ETAPA 4        |[Planejar, desenvolver e gerenciar uma aplicação Móvel](docs/frontend-mobile.md) <br>  |
| ETAPA 5         | [Apresentação](presentation/README.md) |
## Instruções de utilização

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
# Código

<li><a href="src/README.md"> Código Fonte</a></li>

# Apresentação

<li><a href="presentation/README.md"> Apresentação da solução</a></li>


