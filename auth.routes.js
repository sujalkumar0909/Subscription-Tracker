import { Router } from "express";
import { signin, signOut, signup } from "./controllers/auth.controller.js";

const authRouter=Router();

authRouter.post('/sign-up',signup);
authRouter.post('/sign-in',signin);
authRouter.post('/sign-out',signOut);

export default authRouter;