import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

const ADMIN_CONFIG_PREFIX = "config/admin-users";

// Simple hash function for passwords (in production, use bcrypt)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + process.env.AUTH_SECRET);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getAdminUsers(): Promise<{ email: string; passwordHash: string }[]> {
  try {
    const { blobs } = await list({ prefix: ADMIN_CONFIG_PREFIX });
    if (blobs.length === 0) return [];
    
    // Get the latest config
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

async function saveAdminUsers(users: { email: string; passwordHash: string }[]): Promise<void> {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  const configName = `${ADMIN_CONFIG_PREFIX}-${timestamp}-${randomSuffix}.json`;
  
  await put(configName, JSON.stringify(users), {
    access: "public",
    contentType: "application/json",
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    
    // Check if user already exists
    const users = await getAdminUsers();
    
    // Only allow one admin account
    if (users.length > 0) {
      return NextResponse.json({ error: "Admin account already exists. Please sign in." }, { status: 400 });
    }
    
    // Hash password and save
    const passwordHash = await hashPassword(password);
    users.push({ email: email.toLowerCase(), passwordHash });
    await saveAdminUsers(users);
    
    // Create session token
    const token = await createSessionToken(email);
    
    const response = NextResponse.json({ success: true, message: "Account created successfully" });
    
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
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
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
  
  // Base64 encode the payload and append signature
  const base64Payload = btoa(JSON.stringify(payload));
  return `${base64Payload}.${signature}`;
}
