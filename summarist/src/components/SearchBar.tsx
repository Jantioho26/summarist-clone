"use client";

import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import Link from "next/link";
import BookSkeleton from "@/components/BookSkeleton";


type Book = {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  audioLink: string;
  averageRating: number;
  imageLink: string;
};

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  

useEffect(() => {
  if (!search.trim()) {
    setBooks([]);
    setIsLoading(false);
    return;
  }

  setIsLoading(true);

  const controller = new AbortController();

  const timer = setTimeout(async () => {
    try {
      const response = await fetch(
        `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(search.trim())}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error("Failed to search books");
      }

      const data = await response.json();
      setBooks(data);
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error("Error searching books:", error);
        setBooks([]);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, 300);

  return () => {
    clearTimeout(timer);
    controller.abort();
  };
}, [search]);
return (
  <div className="search__background">
    <div className="search__wrapper">
      <div className="search">
        <div className="search__input--wrapper">
          <input
            className="search__input"
            placeholder="Search for books"
            type="text"
            value={search}
           onChange={(event) => {
  setSearch(event.target.value);
  setBooks([]);
  setIsLoading(Boolean(event.target.value.trim()));
}}
          />
         <IoIosSearch className="search__icon" />
        </div>
        {search && (
  <div className="search__results">
    {isLoading ? (
      <div className="search__skeletons">
        {Array.from({ length: 3 }).map((_, index) => (
          <BookSkeleton key={index} />
        ))}
      </div>
    ) : (
      <>
       {books.length === 0 && <p>No books found</p>}

        {books.map((book) => (
          <Link href={`/book/${book.id}`} key={book.id}>
            <div className="search__result">
              <img
                className="search__result--image"
                src={book.imageLink}
                alt={book.title}
          />

              <div>
                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </div>
            </div>
          </Link>
        ))}
          </>
    )}
  </div>
)}
      </div>
    </div>
  </div>
);
}