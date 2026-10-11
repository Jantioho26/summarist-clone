"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import SearchBar from "@/components/SearchBar";
import AuthModal from "@/components/AuthModal";
import Link from "next/link";

export default function SettingsPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [subscription, setSubscription] = useState<
    "basic" | "premium" | "premium-plus"
  >("basic");

 
useEffect(() => {
  let unsubscribeSnapshot: (() => void) | undefined;

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    // Stop listening to the previous user's subscription
    unsubscribeSnapshot?.();
    unsubscribeSnapshot = undefined;

    if (user) {
      setEmail(user.email);
      setIsLoggedIn(true);

      const userRef = doc(db, "users", user.uid);

      unsubscribeSnapshot = onSnapshot(
        userRef,
        (userSnap) => {
          const plan = userSnap.data()?.subscription;

          if (plan === "premium" || plan === "premium-plus") {
            setSubscription(plan);
          } else {
            setSubscription("basic");
          }

          setIsLoading(false);
        },
        (error) => {
          console.error("Error loading subscription:", error);
          setSubscription("basic");
          setIsLoading(false);
        }
      );
    } else {
      setEmail(null);
      setIsLoggedIn(false);
      setSubscription("basic");
      setIsLoading(false);
    }
  });

  return () => {
    unsubscribeAuth();
    unsubscribeSnapshot?.();
  };
}, []);


return(
  <>
      <SearchBar />
      <section className="settings">
        <h1 className="settings__title">Settings</h1>

       {isLoading ? (
  <p>Loading your account details...</p>
) : isLoggedIn ? (
          <>
            <div className="settings__section">
              <h3>Your Subscription Plan</h3>

              <p>
                {subscription === "basic"
                  ? "Basic"
                  : subscription === "premium"
                    ? "Premium"
                    : "Premium Plus"}
              </p>

              {subscription === "basic" && (
                <Link href="/choose-plan" className="settings__upgrade">
                  Upgrade to Premium
                </Link>
              )}
            </div>

            <div className="settings__section">
              <h3>Email</h3>
              <p>{email}</p>
            </div>
          </>
        ) : (
          <div className="settings__logged-out">
            <img
              src="/login.png"
              alt="Login required"
              className="settings__logged-out--image"
            />
            <h2>Log in to your account to see your details.</h2>

            <button
              className="settings__login"
              onClick={() => setIsAuthOpen(true)}
            >
              Login
            </button>
          </div>
        )}
      </section>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
