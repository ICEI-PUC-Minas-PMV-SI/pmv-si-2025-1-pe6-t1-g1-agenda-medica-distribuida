const express = require("express");
const apppointmentsController = require("../controllers/appointmentController");
const {identifier} = require("../middlewares/identification");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Operações relacionadas a agendamentos
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: ID do usuário
 *         doctor:
 *           type: string
 *           description: ID do médico
 *         amount:
 *           type: number
 *           description: Valor da consulta
 *         slotTime:
 *           type: string
 *           description: Horário do agendamento
 *         slotDate:
 *           type: string
 *           format: date
 *           description: Data do agendamento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data de criação do agendamento
 *         cancelled:
 *           type: boolean
 *           description: Indica se o agendamento foi cancelado
 */

/**
 * @swagger
 * /api/appointment:
 *   get:
 *     summary: Lista agendamentos
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: _id
 *         schema:
 *           type: string
 *         description: ID do usuário (obrigatório para não-admins)
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 appointments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Não autorizado
 */
router.get("/", identifier, apppointmentsController.viewAppointments);

/**
 * @swagger
 * /api/appointment:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - docId
 *               - slotDate
 *               - slotTime
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID do usuário
 *               docId:
 *                 type: string
 *                 description: ID do médico
 *               slotDate:
 *                 type: string
 *                 format: date
 *                 description: Data do agendamento (YYYY-MM-DD)
 *               slotTime:
 *                 type: string
 *                 description: Horário do agendamento (HH:MM)
 *     responses:
 *       200:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 newAppointment:
 *                   $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Não autorizado ou dados inválidos
 *       403:
 *         description: Horário não disponível
 */
router.post("/", identifier, apppointmentsController.newAppointment);

/**
 * @swagger
 * /api/appointment/cancel:
 *   post:
 *     summary: Cancela um agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - appointmentId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID do usuário
 *               appointmentId:
 *                 type: string
 *                 description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento cancelado com sucesso
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
 *         description: Não autorizado
 *       403:
 *         description: Agendamento já cancelado
 */
router.post("/cancel", identifier, apppointmentsController.cancelAppointment);

module.exports = router;
