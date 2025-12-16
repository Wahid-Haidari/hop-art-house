"use client";

import { useState } from "react";

interface AdminAuthProps {
  hasAdmin: boolean;
  onAuthenticated: () => void;
}

export default function AdminAuth({ hasAdmin, onAuthenticated }: AdminAuthProps) {
  const [isSignUp, setIsSignUp] = useState(!hasAdmin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/signin";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "Authentication failed");
        return;
      }
      
      onAuthenticated();
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .auth-input::placeholder {
          color: #666;
          opacity: 1;
        }
      `}</style>
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}>
          <h1 style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "8px",
          color: "#000",
          textAlign: "center",
        }}>
          Admin Portal
        </h1>
        <p style={{
          fontSize: "14px",
          color: "#666",
          marginBottom: "32px",
          textAlign: "center",
        }}>
          {isSignUp ? "Create your admin account" : "Sign in to manage the gallery"}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#000",
              marginBottom: "8px",
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
                color: "#000",
              }}
              onFocus={(e) => e.target.style.borderColor = "#F5C542"}
              onBlur={(e) => e.target.style.borderColor = "#ddd"}
              placeholder="admin@example.com"
              className="auth-input"
            />
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#000",
              marginBottom: "8px",
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
                color: "#000",
              }}
              onFocus={(e) => e.target.style.borderColor = "#F5C542"}
              onBlur={(e) => e.target.style.borderColor = "#ddd"}
              placeholder="Enter password"
              className="auth-input"
            />
          </div>
          
          {isSignUp && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#000",
                marginBottom: "8px",
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                  color: "#000",
                }}
                onFocus={(e) => e.target.style.borderColor = "#F5C542"}
                onBlur={(e) => e.target.style.borderColor = "#ddd"}
                placeholder="Confirm password"
                className="auth-input"
              />
            </div>
          )}
          
          {error && (
            <div style={{
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "14px",
              marginBottom: "20px",
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#F5C542",
              color: "#000",
              border: "2px solid #000",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
              transition: "all 0.2s",
            }}
          >
            {isLoading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
          </button>
        </form>
        
        {hasAdmin && (
          <div style={{
            marginTop: "24px",
            textAlign: "center",
          }}>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#666",
                fontSize: "14px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
            </button>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
