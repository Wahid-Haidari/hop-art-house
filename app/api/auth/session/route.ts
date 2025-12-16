import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";

const ADMIN_CONFIG_PREFIX = "config/admin-users";

async function getAdminUsers(): Promise<{ email: string; passwordHash: string }[]> {
  try {
    const { blobs } = await list({ prefix: ADMIN_CONFIG_PREFIX });
    if (blobs.length === 0) return [];
    
    const latestBlob = blobs.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    
    const response = await fetch(latestBlob.url, { cache: 'no-store' });
    if (response.ok) {
      return await response.json();
    }
    return [];
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
