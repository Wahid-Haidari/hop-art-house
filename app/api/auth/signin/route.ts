import { NextRequest, NextResponse } from "next/server";
import { kv } from "../../../lib/kv";

// KV key for admin users
const ADMIN_USERS_KEY = "admin:users";

interface AdminUser {
  email: string;
  passwordHash: string;
}

// Simple hash function for passwords (must match signup)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + process.env.AUTH_SECRET);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const users = await kv.get<AdminUser[]>(ADMIN_USERS_KEY);
    return users || [];
  } catch {
    return [];
  }
}

async function createSessionToken(email: string): Promise<string> {
  const payload = {
    email,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
  };
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload) + process.env.AUTH_SECRET);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  const base64Payload = btoa(JSON.stringify(payload));
  return `${base64Payload}.${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    
    const users = await getAdminUsers();
    const user = users.find(u => u.email === email.toLowerCase());
    
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    
    // Verify password
    const passwordHash = await hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    
    // Create session token
    const token = await createSessionToken(email);
    
    const response = NextResponse.json({ success: true, message: "Signed in successfully" });
    
    // Set HTTP-only cookie
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 });
  }
}
