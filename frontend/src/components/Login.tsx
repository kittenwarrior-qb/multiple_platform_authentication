import { useState } from "react";
import { auth, providers } from "../firebaseConfig";
import {
  signInWithPopup,
  fetchSignInMethodsForEmail,
  linkWithPopup,
} from "firebase/auth";
import axios from "axios";

interface FirebaseAuthError extends Error {
  code: string;
  email?: string;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const handleLogin = async (providerName: string) => {
    const provider = providers[providerName];
    if (!provider) return;

    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);

      console.log("Firebase User object:", result.user);

      const token = await result.user.getIdToken();
      console.log("Firebase ID Token:", token);

      const res = await axios.get("http://localhost:4000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Backend full response:", res);
      alert(`Hello ${res.data.user.email}!`);
    } catch (error) {
      console.error("Firebase login error:", error);
      const err = error as FirebaseAuthError;

      if (err.code === "auth/account-exists-with-different-credential") {
        const email = err.email;
        console.log("Conflict email:", email);

        if (!email) {
          alert("Cannot resolve email for account linking.");
          return;
        }

        const methods = await fetchSignInMethodsForEmail(auth, email);
        console.log("Existing sign-in methods:", methods);

        const oldProviderName = methods[0].split(".")[0];
        const oldProvider = providers[oldProviderName];

        if (!oldProvider) {
          alert("Old provider not configured!");
          return;
        }

        alert(
          `This email is already registered with ${methods[0]}. Logging in with existing provider...`
        );

        const oldUserResult = await signInWithPopup(auth, oldProvider);
        console.log("Old provider user object:", oldUserResult.user);

        await linkWithPopup(oldUserResult.user, provider);
        console.log("Account linked with new provider!");

        const token = await oldUserResult.user.getIdToken();
        console.log("New ID Token after linking:", token);

        const res = await axios.get("http://localhost:4000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Backend response after linking:", res);
        alert(`Account linked successfully! Welcome ${res.data.user.email}`);
      } else {
        alert("Login failed, check console.");
      }
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: "400px",
    width: "100%",
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    padding: "40px",
    textAlign: "center",
  };

  const logoStyle: React.CSSProperties = {
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    color: "white",
    fontSize: "24px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "8px",
  };

  const subtitleStyle: React.CSSProperties = {
    color: "#666",
    marginBottom: "30px",
    fontSize: "16px",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 20px",
    margin: "8px 0",
    border: "2px solid #e1e5e9",
    borderRadius: "12px",
    backgroundColor: "white",
    color: "#333",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  };

  const getButtonStyle = (buttonName: string) => {
    if (loading) {
      return {
        ...buttonStyle,
        opacity: 0.6,
        cursor: "not-allowed",
        transform: "none",
      };
    }
    if (hoveredButton === buttonName) {
      return {
        ...buttonStyle,
        borderColor: "#667eea",
        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
        transform: "translateY(-2px)",
      };
    }
    return buttonStyle;
  };

  const footerStyle: React.CSSProperties = {
    marginTop: "30px",
    fontSize: "14px",
    color: "#666",
  };

  const linkStyle: React.CSSProperties = {
    color: "#667eea",
    textDecoration: "none",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Header */}
        <div style={logoStyle}>
          🔐
        </div>
        <h1 style={titleStyle}>Welcome Back</h1>
        <p style={subtitleStyle}>Sign in to your account using your preferred method</p>

        {/* Login Buttons */}
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => handleLogin("google")}
            disabled={loading}
            style={getButtonStyle("google")}
            onMouseEnter={() => setHoveredButton("google")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          <button
            onClick={() => handleLogin("facebook")}
            disabled={loading}
            style={getButtonStyle("facebook")}
            onMouseEnter={() => setHoveredButton("facebook")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <svg width="20" height="20" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            {loading ? "Signing in..." : "Continue with Facebook"}
          </button>

          <button
            onClick={() => handleLogin("github")}
            disabled={loading}
            style={getButtonStyle("github")}
            onMouseEnter={() => setHoveredButton("github")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <svg width="20" height="20" fill="#333" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12-12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            {loading ? "Signing in..." : "Continue with GitHub"}
          </button>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <p>
            By signing in, you agree to our{" "}
            <a href="#" style={linkStyle}>Terms of Service</a>
            {" "}and{" "}
            <a href="#" style={linkStyle}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}