const express = require("express");
const doctorController = require("../controllers/doctorController");
const {identifier} = require("../middlewares/identification");
const router = express.Router();

router.post("/", identifier, doctorController.newDoctor);
router.patch("/:crm", identifier, doctorController.updateDoctor);
router.delete("/:crm", identifier, doctorController.deleteDoctor);
router.get("/", identifier, doctorController.viewDoctors);

module.exports = router;
