const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, alreadyLoggedIn } = require("../middleware/auth");

router.post("/login", alreadyLoggedIn, userController.loginUser);
router.post("/register", alreadyLoggedIn, userController.createUser);

router.use(verifyToken);

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.patch("/:id", userController.patchUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
