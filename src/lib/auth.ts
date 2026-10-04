import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET_STRING =
  process.env.JWT_SECRET || "sma_alfalah_banjaran_jwt_secret_token_secure_2026";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
export const AUTH_COOKIE_NAME = "admin_token";
export const ORTU_COOKIE_NAME = "ortu_token";

export interface UserPayload {
  userId: string;
  nama_pengguna: string;
  email: string;
  nama: string;
  peran: string;
}

export interface OrtuPayload {
  ortuId: string;
  username: string;
  nama: string;
  siswaId: string;
  namaSiswa: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  plainText: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

export async function signToken(payload: UserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    if (!payload || typeof payload !== "object") return null;
    return {
      userId: String(payload.userId || ""),
      nama_pengguna: String(payload.nama_pengguna || ""),
      email: String(payload.email || ""),
      nama: String(payload.nama || ""),
      peran: String(payload.peran || ""),
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function signOrtuToken(payload: OrtuPayload): Promise<string> {
  return new SignJWT({ ...payload, isOrtu: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET_KEY);
}

export async function verifyOrtuToken(token: string): Promise<OrtuPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    if (!payload || typeof payload !== "object" || !payload.isOrtu) return null;
    return {
      ortuId: String(payload.ortuId || ""),
      username: String(payload.username || ""),
      nama: String(payload.nama || ""),
      siswaId: String(payload.siswaId || ""),
      namaSiswa: String(payload.namaSiswa || ""),
    };
  } catch {
    return null;
  }
}

export async function getOrtuSessionUser(): Promise<OrtuPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ORTU_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyOrtuToken(token);
}

