// app/api/auth/login/route.ts
import "@/dbConfig/dbConfig";
import { loginController } from "@/controllers/authController";

export { loginController as POST };
