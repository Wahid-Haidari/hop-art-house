import { NextRequest, NextResponse } from "next/server";
import { kv } from "../../../lib/kv";

// KV key for admin users
const ADMIN_USERS_KEY = "admin:users";

interface AdminUser {
  email: string;
  passwordHash: string;
}

async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const users = await kv.get<AdminUser[]>(ADMIN_USERS_KEY);
    return users || [];
  } catch {
    return [];
  }
}

async function verifyToken(token: string): Promise<{ valid: boolean; email?: string }> {
  try {
    const [base64Payload, signature] = token.split('.');
    if (!base64Payload || !signature) return { valid: false };
    
    const payload = JSON.parse(atob(base64Payload));
    
    // Check expiration
    if (payload.exp < Date.now()) return { valid: false };
    
    // Verify signature
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(payload) + process.env.AUTH_SECRET);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const expectedSignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    if (signature !== expectedSignature) return { valid: false };
    
    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_session')?.value;
    
    if (!token) {
      // Check if any admin exists
      const users = await getAdminUsers();
      return NextResponse.json({ 
        authenticated: false, 
        hasAdmin: users.length > 0 
      });
    }
    
    const { valid, email } = await verifyToken(token);
    
    if (!valid) {
      const users = await getAdminUsers();
      return NextResponse.json({ 
        authenticated: false, 
        hasAdmin: users.length > 0 
      });
    }
    
    return NextResponse.json({ 
      authenticated: true, 
      email,
      hasAdmin: true 
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ authenticated: false, hasAdmin: false }, { status: 500 });
  }
}
