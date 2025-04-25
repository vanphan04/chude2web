const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

console.log("userController:", userController);

router.get(
  "/getallstaff",
  verifyToken,
  checkRole([3]),
  userController.getAllUsers,
);
router.post("/addUser", verifyToken, checkRole([3]), userController.addUser);
router.delete(
  "/deleteUser/:id",
  verifyToken,
  checkRole([3]),
  userController.deleteUser,
);
router.put(
  "/updateUser/:id",
  verifyToken,
  checkRole([3]),
  userController.updateUser,
);

module.exports = router;
