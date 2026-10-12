"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import BookSkeleton from "@/components/BookSkeleton";

type LibraryBook = {
  id: string; 
  title: string;
  author: string;
  imageLink:string;
  subTitle: string;
  averageRating: number;
  audioLink: string;
};

export default function MyLibrary() {
const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>([]);
const [finishedBooks, setFinishedBooks] = useState<LibraryBook[]>([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchLibrary = async () => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

   const libraryRef = collection(
  db,
  "users",
  user.uid,
  "library"
);
const snapshot = await getDocs(libraryRef);
const books = snapshot.docs.map((doc) => {
    return doc.data() as LibraryBook;
});
   setLibraryBooks(books);
  };
  const fetchFinishedBooks = async () => {
  const user = auth.currentUser;

  if (!user) return;

  try {
    const finishedRef = collection(
      db,
      "users",
      user.uid,
      "finishedBooks"
    );

    const snapshot = await getDocs(finishedRef);

    const books = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as LibraryBook[];

    setFinishedBooks(books);

    
  } catch (error) {
    console.error("Error loading finished books:", error);
  }
};
 const loadBooks = async () => {
  try {
    await Promise.all([
      fetchLibrary(),
      fetchFinishedBooks(),
    ]);
  } finally {
    setIsLoading(false);
  }
};

loadBooks();
}, []);

return (
<>
     <SearchBar />

    <div className="library">
      <h1 className="library__title">Saved Books</h1>
    <div className="library__books">
  {isLoading
    ? Array.from({ length: 5 }).map((_, index) => (
        <BookSkeleton key={index} />
      ))
    : libraryBooks.map((book) => (
  <Link
    href={`/book/${book.id}`}
    className="library__book"
    key={book.id}
  >
          <img
          className="library__book--image"
           src={book.imageLink} alt={book.title} />
          <h3 className="library__book--title">{book.title}</h3>
          <p className="library__book--author">{book.author}</p>
           {book.subTitle && (
  <p className="library__book--subtitle">
    {book.subTitle}
  </p>
)}
           {book.averageRating && (
  <p className="library__book--rating">
    ⭐ {book.averageRating}
  </p>
)}
        </Link>
      ))}
      </div>
      <div className="library__finished">
  <h2 className="library__title">Finished Books</h2>

  <div className="library__books">
  {isLoading
    ? Array.from({ length: 5 }).map((_, index) => (
        <BookSkeleton key={index} />
      ))
    : finishedBooks.map((book) => (
      <Link
        href={`/book/${book.id}`}
        className="library__book"
        key={book.id}
      >
        <img
          className="library__book--image"
          src={book.imageLink}
          alt={book.title}
        />

        <h3 className="library__book--title">
          {book.title}
        </h3>

        <p className="library__book--author">
          {book.author}
        </p>
      </Link>
    ))}
  </div>
</div>
    </div>
  </>
  );
}