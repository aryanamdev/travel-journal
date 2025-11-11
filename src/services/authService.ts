// src/services/authService.ts
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from "@/lib/errors";
import { RegisterDTO, LoginDTO, VerifyDTO, ViewerDTO } from "@/schemas/auth";
import { User as UserType, UserTokenData } from "@/types/user";
import { sendEmail } from "@/helpers/verifyEmail";
import { connect } from "@/dbConfig/dbConfig";

const JWT_SECRET = String(process.env.JWT_SECRET) || "";

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 1 day in seconds


/**
 * connecting to the db
 */
connect()

export const authService = {
  async register(payload: RegisterDTO) {
    const { email, password, fullName } = payload;
    const existing = await User.findOne({ email }).lean();
    if (existing) throw new BadRequestError("User already exists with this email");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      // isVerified defaults to false (model should reflect that)
    });

    const savedUser = await newUser.save();
    // ideally hide password before returning (or remove it)
    const userObj = savedUser.toObject();

    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })

    delete userObj.password;


    return userObj;
  },

  async login(payload: LoginDTO) {
    const { email, password } = payload;
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User does not exist with this email");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedError("Incorrect email or password");

    if (!user.isVerified) throw new ForbiddenError("Please verify your email to login");

    const tokenPayload = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1d" });

    const userObj = user.toObject();
    delete userObj.password;

    return { token, user: userObj };
  },

  async logout() {
    // nothing to do server-side except tell client to clear cookie
    return true;
  },

  async verify({ token }: VerifyDTO) {
    if (!token) throw new BadRequestError("Token missing");

    const user = await User.findOne({ verifyToken: token }).exec();
    if (!user) throw new NotFoundError("Invalid token");

    if (user.isVerified) {
      // idempotent: return success even if already verified
      return { alreadyVerified: true };
    }

    // check expiry if model saves expiry date
    if (user.verifyTokenExpiryDate && user.verifyTokenExpiryDate < new Date()) {
      throw new BadRequestError("Token expired");
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiryDate = undefined;
    await user.save();

    return { alreadyVerified: false };
  },

  async me({ token }: ViewerDTO) {
    if (!token) throw new BadRequestError("Token missing");

    console.log({token})

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      console.log({decoded})
    } catch (err: any) {
      if (err?.name === "TokenExpiredError") {
        throw new UnauthorizedError("Session expired. Please login again");
      }
      throw new UnauthorizedError("Invalid token");
    }

    // validate payload shape
    if (!decoded?.id || !decoded?.email) {
      throw new UnauthorizedError("Malformed token payload");
    }

    // Fetch user to ensure token still represents an active user
    const user = await User.findById<UserType>(decoded.id).lean();
    if (!user) throw new UnauthorizedError("User no longer exists");

    const { password, ...safeUser } = user;

    return {
      success: true,
      user: safeUser,
    };
  },
  // helper to build cookie options for NextResponse
  cookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    };
  },
};
