// app/api/auth/register/route.ts
import "@/dbConfig/dbConfig"; // ensure connection runs once
import { registerController } from "@/controllers/authController";

export { registerController as POST };
