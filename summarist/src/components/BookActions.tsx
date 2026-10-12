"use client";
import { useState } from "react";
import { auth } from "@/firebase/firebase";
import AuthModal from "@/components/AuthModal";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

type BookActionsProps = {
  bookId: string;
  subscriptionRequired: boolean;
};

export default function BookActions({
  bookId,
  subscriptionRequired,
}: BookActionsProps) {

const [isAuthOpen, setIsAuthOpen] = useState(false); 

const router = useRouter();

const handleBookAccess = async () => {
  const user = auth.currentUser;
  

  if (!user) {
    setIsAuthOpen(true);
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);
    

    const subscription = userSnapshot.exists()
      ? userSnapshot.data().subscription
      : "basic";
 


    if (
      subscriptionRequired &&
      subscription !== "premium" &&
      subscription !== "premium-plus"
    ) {
      router.push("/choose-plan");
      return;
    }

    router.push(`/player/${bookId}`);
  } catch (error) {
  }
};
return (
  <>
    <div className="book__actions">
      <button className="book__read" onClick={handleBookAccess}>
        Read
      </button>

      <button className="book__listen" onClick={handleBookAccess}>
        Listen
      </button>
    </div>
   
    <AuthModal
      isOpen={isAuthOpen}
      onClose={() => setIsAuthOpen(false)}
    />
  </>
);
}

