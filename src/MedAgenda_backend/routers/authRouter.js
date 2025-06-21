const express = require("express");
const authController = require("../controllers/authController");
const {identifier} = require("../middlewares/identification");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Autenticação e gerenciamento de usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         gender:
 *           type: string
 *         birthdate:
 *           type: string
 *           format: date
 *         userImage:
 *           type: string
 *         isAdmin:
 *           type: boolean
 *         verified:
 *           type: boolean
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               gender:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *               userImage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Dados inválidos ou usuário já existe
 */
router.post("/signup", authController.signup);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 message:
 *                   type: string
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: Cookie de autenticação
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/signin", authController.signin);

/**
 * @swagger
 * /api/auth/signout:
 *   post:
 *     summary: Desconecta o usuário
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post("/signout", identifier, authController.signout);

/**
 * @swagger
 * /api/auth/send-verification-code:
 *   patch:
 *     summary: Envia código de verificação por email
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Código enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Não autorizado ou usuário já verificado
 */
router.patch(
  "/send-verification-code",
  identifier,
  authController.sendVerificationCode
);

/**
 * @swagger
 * /api/auth/verify-verification-code:
 *   patch:
 *     summary: Verifica código de verificação
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - providedCode
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               providedCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Código verificado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Código inválido ou expirado
 *       401:
 *         description: Não autorizado
 */
router.patch(
  "/verify-verification-code",
  identifier,
  authController.verifyVerificationCode
);

/**
 * @swagger
 * /api/auth/change-password:
 *   patch:
 *     summary: Altera a senha do usuário
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas ou usuário não verificado
 */
router.patch("/change-password", identifier, authController.changePassword);

/**
 * @swagger
 * /api/auth/send-forgot-password-code:
 *   patch:
 *     summary: Envia código para redefinir senha
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Código enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Usuário não encontrado
 */
router.patch(
  "/send-forgot-password-code",
  authController.sendForgotPasswordCode
);

/**
 * @swagger
 * /api/auth/verify-forgot-password-code:
 *   patch:
 *     summary: Verifica código e redefine senha
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - providedCode
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               providedCode:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Código inválido ou expirado
 *       401:
 *         description: Usuário não encontrado
 */
router.patch(
  "/verify-forgot-password-code",
  authController.verifyForgotPasswordCode
);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Busca dados do usuário logado
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/profile", identifier, authController.getUserProfile);

module.exports = router;
