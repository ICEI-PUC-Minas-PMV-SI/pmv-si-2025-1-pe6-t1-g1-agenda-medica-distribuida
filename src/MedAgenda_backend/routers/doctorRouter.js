const express = require("express");
const doctorController = require("../controllers/doctorController");
const {identifier} = require("../middlewares/identification");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Gerenciamento de médicos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         speciality:
 *           type: string
 *         crm:
 *           type: string
 *         pricePerAppointment:
 *           type: number
 *         doctorImage:
 *           type: string
 *         about:
 *           type: string
 *         scheduledAppointments:
 *           type: object
 *           additionalProperties:
 *             type: array
 *             items:
 *               type: string
 */

/**
 * @swagger
 * /api/doctors:
 *   post:
 *     summary: Cria um novo médico (apenas admin)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Doctor'
 *     responses:
 *       201:
 *         description: Médico criado com sucesso
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
 *                   $ref: '#/components/schemas/Doctor'
 *       401:
 *         description: Não autorizado ou dados inválidos
 */
router.post("/", identifier, doctorController.newDoctor);

/**
 * @swagger
 * /api/doctors/{crm}:
 *   patch:
 *     summary: Atualiza informações de um médico (apenas admin)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: crm
 *         required: true
 *         schema:
 *           type: string
 *         description: CRM do médico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               speciality:
 *                 type: string
 *               pricePerAppointment:
 *                 type: number
 *               doctorImage:
 *                 type: string
 *               about:
 *                 type: string
 *     responses:
 *       200:
 *         description: Médico atualizado com sucesso
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
 *         description: Não autorizado ou dados inválidos
 */
router.patch("/:crm", identifier, doctorController.updateDoctor);

/**
 * @swagger
 * /api/doctors/{crm}:
 *   delete:
 *     summary: Remove um médico (apenas admin)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: crm
 *         required: true
 *         schema:
 *           type: string
 *         description: CRM do médico
 *     responses:
 *       200:
 *         description: Médico removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 doctorToDelete:
 *                   type: object
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Não foi possível remover o médico
 */
router.delete("/:crm", identifier, doctorController.deleteDoctor);

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Lista médicos
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: any
 *         style: form
 *         explode: true
 *         schema:
 *           type: object
 *           additionalProperties: true
 *         description: |
 *           Filtros dinâmicos. Exemplos:
 *           - ?speciality=Cardiologia
 *           - ?minPrice=200&available=true
 *     responses:
 *       200:
 *         description: Lista de médicos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 doctors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Doctor'
 */
router.get("/", identifier, doctorController.viewDoctors);

module.exports = router;
