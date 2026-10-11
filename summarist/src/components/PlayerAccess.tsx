"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

type PlayerAccessProps = {
  children: React.ReactNode;
  subscriptionRequired: boolean;
};

export default function PlayerAccess({
  children,
  subscriptionRequired,
}: PlayerAccessProps) {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
const [isAuthOpen, setIsAuthOpen] = useState(false);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setIsAuthOpen(true);
      setIsChecking(false);
      return;
    }

    try {
      if (subscriptionRequired) {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        const subscription = userSnapshot.exists()
          ? userSnapshot.data().subscription
          : "basic";

        if (
          subscription !== "premium" &&
          subscription !== "premium-plus"
        ) {
          router.replace("/choose-plan");
          return;
        }
      }

      setIsChecking(false);
    } catch (error) {
      console.error("Error checking player access:", error);
      router.replace("/choose-plan");
    }
  });

  return () => unsubscribe();
}, [subscriptionRequired, router]);

if (isAuthOpen) {
  return (
    <AuthModal
      isOpen={isAuthOpen}
      onClose={() => {
        setIsAuthOpen(false);
        router.push("/for-you");
      }}
    />
  );
}

return <>{children}</>;
}