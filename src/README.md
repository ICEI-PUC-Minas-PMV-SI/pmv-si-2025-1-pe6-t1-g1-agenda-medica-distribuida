# Instruções de utilização

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
