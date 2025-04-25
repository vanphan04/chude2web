const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middleware/authMiddleware");
const roleController = require("../controllers/roleController");

router.get(
  "/getallrole",
  verifyToken,
  checkRole([3]),
  roleController.getAllRoles,
);

module.exports = router;
