// app/api/auth/logout/route.ts
import "@/dbConfig/dbConfig";
import { logoutController } from "@/controllers/authController";

export { logoutController as GET };
