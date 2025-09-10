import { useState } from "react";
import { auth, providers } from "../firebaseConfig";
import {
  signInWithPopup,
  fetchSignInMethodsForEmail,
  linkWithPopup,
} from "firebase/auth";
import axios from "axios";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (providerName: string) => {
    const provider = providers[providerName];
    if (!provider) return;

    setLoading(true);

    try {
      // Thử đăng nhập popup
      const result = await signInWithPopup(auth, provider);

      console.log("Firebase User object:", result.user);

      const token = await result.user.getIdToken();
      console.log("Firebase ID Token:", token);

      // Gửi token lên backend
      const res = await axios.get("http://localhost:4000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Backend full response:", res);
      alert(`Hello ${res.data.user.email}!`);
    } catch (err: any) {
      console.error("Firebase login error:", err);

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

        await linkWithPopup(oldUserResult.user, provider); // Link new provider
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

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Login with Firebase</h1>
      <button onClick={() => handleLogin("google")} disabled={loading}>
        Login with Google
      </button>
      <button onClick={() => handleLogin("facebook")} disabled={loading}>
        Login with Facebook
      </button>
      <button onClick={() => handleLogin("github")} disabled={loading}>
        Login with GitHub
      </button>
    </div>
  );
}
