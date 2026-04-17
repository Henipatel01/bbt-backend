
import  express from "express";
import * as authControllers from "../Controllers/authController.js"
import  {signupSchema} from "../validation/auth-validation.js"
import  {logInSchema} from "../validation/loginschema.js"
import  validate from "../Middleware/validation-middleware.js"

const router = express.Router();
// app.get("/", (req, res) => {
//   res.status(200).send("Welcome to");
// });

router.route("/").get(authControllers.home)

// app.get("/register", (req, res) => {
//   res.status(200).json({ msg: "registration successful" });
// });
router.route("/signup").post(validate(signupSchema),authControllers.signup)
router.route("/login").post(validate(logInSchema),authControllers.logIn)

export default router