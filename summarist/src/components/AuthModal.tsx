"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    if (!email.includes("@") || !email.includes(".")) {
      setErrorMessage("Invalid email");
      return;
    }

    if (isRegistering) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);

        console.log("Account created!");

        setEmail("");
        setPassword("");
        onClose();
      } catch (error: any) {
        console.error("Error creating account:", error);

        if (error.code === "auth/invalid-email") {
          setErrorMessage("Invalid email");
        } else {
          setErrorMessage("Invalid email or password");
        }
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);

        setEmail("");
        setPassword("");
        onClose();
        router.push("/for-you");
      } catch (error: any) {
        console.error("Error logging in:", error);

        if (error.code === "auth/invalid-email") {
          setErrorMessage("Invalid email");
        } else if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/invalid-credential"
        ) {
          setErrorMessage("User not found");
        } else {
          setErrorMessage("Invalid email or password");
        }
      }
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
      router.push("/for-you");
   

      onClose();
    } catch (error) {
      console.error("Error logging in as guest:", error);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);
      router.push("/for-you");

    

      onClose();
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };
  const handlePasswordReset = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);

      console.log("Password reset email sent!");
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };

  if (!isOpen) return null;
  if (isResettingPassword) {
    return (
      <div className="auth__overlay" onClick={onClose}>
        <div
          className="auth__modal"
          onClick={(event) => event.stopPropagation()}
        >
          <button className="auth__close" onClick={onClose} aria-label="Close">
            ×
          </button>

          <h2 className="auth__title">Reset your password</h2>

          <form className="auth__form" onSubmit={handlePasswordReset}>
            <input
              type="email"
              placeholder="Email address"
              className="auth__input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <button type="submit" className="btn auth__submit">
              Send reset password link
            </button>
          </form>

          <div className="auth__register">
            <button onClick={() => setIsResettingPassword(false)}>
              Go to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth__overlay" onClick={onClose}>
      <div className="auth__modal" onClick={(event) => event.stopPropagation()}>
        <button
          className="auth__close"
          onClick={onClose}
          aria-label="Close login"
        >
          ×
        </button>
        <h2 className="auth__title">
          {isRegistering ? "Sign up to Summarist" : "Log in to Summarist"}
        </h2>

        {!isRegistering && (
          <>
            <button className="auth__guest" onClick={handleGuestLogin}>
              Login as a Guest
            </button>

            <div className="auth__divider">
              <span>or</span>
            </div>
          </>
        )}

        <button className="auth__google" onClick={handleGoogleLogin}>
          <img src="/google.png" alt="Google" className="auth__google--img" />
          <span>
            {isRegistering ? "Sign up with Google" : "Login with Google"}
          </span>
        </button>

        <div className="auth__divider">
          <span>or</span>
        </div>

        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="Email Address"
            className="auth__input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="auth__input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {errorMessage && <div className="auth__error">{errorMessage}</div>}

          <button type="submit" className="btn auth__submit">
            {isRegistering ? "Sign up" : "Login"}
          </button>
        </form>

        {!isRegistering && (
          <button
            className="auth__forgot"
            onClick={() => setIsResettingPassword(true)}
          >
            Forgot your password?
          </button>
        )}

        <div className="auth__register">
          {isRegistering ? (
            <button onClick={() => setIsRegistering(false)}>
              Already have an account?
            </button>
          ) : (
            <>
              Don't have an account?{" "}
              <button onClick={() => setIsRegistering(true)}>Sign up</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
