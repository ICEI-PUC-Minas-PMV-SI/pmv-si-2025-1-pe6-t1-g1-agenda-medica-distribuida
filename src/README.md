# Instruções de utilização

1. Pré-requisitos

- Ferramentas necessárias:

    - Node.js.
    - MongoDB (utilizado como banco de dados).

2. Configuração de Variáveis de Ambiente

- Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

    PORT: Porta de execução do backend na máquina local (ex: 3000).

    MONGO_URI : String para conexão com o MongoDB.
  
    TOKEN_SECRET : Chave secreta do JWT utilizada para assinar e verificar a autenticidade dos tokens.
  
    NODE_CODE_SENDING_EMAIL_ADDRESS: Endereço do remetente para envio de emails.
  
    NODE_CODE_SENDING_EMAIL_PASSWORD: Senha ou chave do email remetente.
  
    HMAC_VERIFICATION_CODE_SECRET: Chave secreta para criação dos códigos de verificação.  
  
3. Configuração e Execução do Banco de Dados

- Configure e execute o MongoDB usando o npm:

    ```console
        npm install
    ```

4. Execução do Backend

- No diretório do backend:
  
    ```console
        npm run start
    ```
   
7. Verificação
   
- Acesse o sistema na URL http://localhost:3000 (ou outra porta que foi configurada no .env) para garantir que o sistema foi implantado corretamente com o banco MongoDB.
