"use client";

import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { useState, useEffect } from "react";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase"; 
import { onAuthStateChanged } from "firebase/auth";

type LibraryButtonProps = {
  id: string;
  title: string;
  author: string;
  imageLink: string;
  subTitle: string;
  averageRating: number;
  audioLink: string;
};

export default function LibraryButton({
  id,
  title,
  author,
  imageLink,
  subTitle,
  averageRating,
  audioLink,
}: LibraryButtonProps) {

  const [isSaved, setIsSaved] = useState(false);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setIsSaved(false);
      return;
    }

    const bookRef = doc(db, "users", user.uid, "library", id);

    const bookSnapshot = await getDoc(bookRef);

    setIsSaved(bookSnapshot.exists());
  });

  return () => unsubscribe();
}, [id]);

 const addToLibrary = async () => {
  const user = auth.currentUser;
  

  if (!user) {
    return;
  }

  const bookRef = doc(db, "users", user.uid, "library", id);

  if (isSaved) {
    await deleteDoc(bookRef);
    setIsSaved(false);
    return;
  }

  try {
    await setDoc(bookRef, {
      id,
      title,
      author,
      imageLink,
      subTitle,
      averageRating,
      audioLink,
    });

    
    setIsSaved(true);
  } catch (error) {
    console.error("Error saving book:", error);
  }
}; // closes addToLibrary


return (
  <button className="book__library" onClick={addToLibrary}>
    {isSaved ? (
      <IoBookmark className="book__library--saved" />
    ) : (
      <IoBookmarkOutline />
    )}

    <span>{isSaved ? "Saved!" : "Add title to My Library"}</span>
  </button>
);
} // closes LibraryButton