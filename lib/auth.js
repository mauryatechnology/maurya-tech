import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error(
    'JWT_SECRET is missing or too short. Set a random secret of at least 32 characters (openssl rand -base64 48) in your environment.'
  );
}

const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function hashPassword(password) {
  // Bcrypt work factor 12 rounds for high security against GPU cracking
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hashedPassword) {
  if (!password || !hashedPassword) return false;
  return bcrypt.compare(password, hashedPassword);
}

export async function signToken(payload, expiresIn = '7d') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

export async function verifyToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}

// Role Hierarchy: superadmin (3) > admin (2) > editor (1)
export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  EDITOR: 'editor',
};

const ROLE_LEVELS = {
  superadmin: 3,
  admin: 2,
  editor: 1,
};

export function hasPermission(userRole, requiredRole) {
  if (!userRole) return false;
  const userLevel = ROLE_LEVELS[userRole.toLowerCase()] || 0;
  const requiredLevel = ROLE_LEVELS[requiredRole.toLowerCase()] || 0;
  return userLevel >= requiredLevel;
}

export async function authorizeAdmin(req, requiredRole = 'editor') {
  const token = req.cookies.get('admin_token')?.value;
  const authUser = await verifyToken(token);
  if (!authUser) {
    return { error: 'Unauthorized: Please log in to admin portal.', status: 401, user: null };
  }
  const userRole = authUser.role || 'admin';
  if (!hasPermission(userRole, requiredRole)) {
    return {
      error: `Forbidden: Insufficient privileges. Required role: ${requiredRole}`,
      status: 403,
      user: authUser,
    };
  }
  return { error: null, status: 200, user: authUser };
}

