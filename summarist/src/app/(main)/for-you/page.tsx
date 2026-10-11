"use client";

import { IoIosSearch } from "react-icons/io";
import { useEffect, useState, useRef } from "react";
import { IoTimeOutline } from "react-icons/io5";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "next/navigation";
import BookSkeleton from "@/components/BookSkeleton";

type Book = {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  audioLink: string;
  averageRating: number;
  imageLink: string;
  subscriptionRequired: boolean;
};

export default function ForYou() {
  const [book, setBook] = useState<Book | null>(null);
  const [isSelectedLoading, setIsSelectedLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = Math.floor(timeRemaining % 60);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [isRecommendedLoading, setIsRecommendedLoading] = useState(true);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [isSuggestedLoading, setIsSuggestedLoading] = useState(true);
  const [search, setSearch] = useState("");
  const recommendedListRef = useRef<HTMLDivElement>(null);
  const suggestedListRef = useRef<HTMLDivElement>(null);
  const allBooks = [...recommendedBooks, ...suggestedBooks];
  const filteredBooks = allBooks.filter((book) => {
    return book.title.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    if (isRecommendedLoading || recommendedBooks.length === 0) {
      return;
    }

    const container = recommendedListRef.current;
    if (!container) return;

    const initializeScroll = () => {
      const oneSetWidth = container.scrollWidth / 3;

      // Start at the middle copy of the books
      container.scrollLeft = oneSetWidth;
    };

    const handleScroll = () => {
      const oneSetWidth = container.scrollWidth / 3;

      if (oneSetWidth === 0) return;

      // Reached the third copy? Jump back to the middle.
      if (container.scrollLeft >= oneSetWidth * 2) {
        container.scrollLeft -= oneSetWidth;
      }

      // Reached the first copy? Jump forward to the middle.
      if (container.scrollLeft < oneSetWidth) {
        container.scrollLeft += oneSetWidth;
      }
    };

    initializeScroll();

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [isRecommendedLoading, recommendedBooks]);


useEffect(() => {
  if (isSuggestedLoading || suggestedBooks.length === 0) {
    return;
  }

  const container = suggestedListRef.current;
  if (!container) return;

  const initializeScroll = () => {
    const oneSetWidth = container.scrollWidth / 3;

    // Start at the middle copy
    container.scrollLeft = oneSetWidth;
  };

  const handleScroll = () => {
    const oneSetWidth = container.scrollWidth / 3;

    if (oneSetWidth === 0) return;

    // If we reach the third copy, jump back
    if (container.scrollLeft >= oneSetWidth * 2) {
      container.scrollLeft -= oneSetWidth;
    }

    // If we reach the first copy, jump forward
    if (container.scrollLeft < oneSetWidth) {
      container.scrollLeft += oneSetWidth;
    }
  };

  initializeScroll();

  container.addEventListener("scroll", handleScroll);

  return () => {
    container.removeEventListener("scroll", handleScroll);
  };
}, [isSuggestedLoading, suggestedBooks]);


  useEffect(() => {
    fetch(
      "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected",
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load selected book");
        }

        return response.json();
      })
      .then((data) => {
        setBook(data[0]);
      })
      .catch((error) => {
        console.error("Error loading selected book:", error);
      })
      .finally(() => {
        setIsSelectedLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(
      "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended",
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load recommended books");
        }

        return response.json();
      })
      .then((data) => {
        setRecommendedBooks(data);
      })
      .catch((error) => {
        console.error("Error loading recommended books:", error);
      })
      .finally(() => {
        setIsRecommendedLoading(false);
      });
  }, []);
  useEffect(() => {
    fetch(
      "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested",
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load suggested books");
        }

        return response.json();
      })
      .then((data) => {
        setSuggestedBooks(data);
      })
      .catch((error) => {
        console.error("Error loading suggested books:", error);
      })
      .finally(() => {
        setIsSuggestedLoading(false);
      });
  }, []);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const router = useRouter();

  return (
    <div>
      <SearchBar />

      <section className="selected">
        <h2 className="selected__title">Selected just for you</h2>
        {isSelectedLoading ? (
          <div className="selected__skeleton">
            <div className="selected__skeleton--image" />

            <div className="selected__skeleton--info">
              <div className="selected__skeleton--title" />
              <div className="selected__skeleton--text" />
              <div className="selected__skeleton--text" />
            </div>
          </div>
        ) : (
          <div
            className="selected__book"
            onClick={() => {
              if (book) {
                router.push(`/book/${book.id}`);
              }
            }}
          >
            <audio
              ref={audioRef}
              src={book?.audioLink}
              preload="metadata"
              onLoadedMetadata={(event) => {
                setTimeRemaining(event.currentTarget.duration);
              }}
              onTimeUpdate={(event) => {
                const audio = event.currentTarget;
                setTimeRemaining(audio.duration - audio.currentTime);
              }}
            />
            <div className="selected__book--audio">
              <button
                className="selected__book--play"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleAudio();
                }}
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>

              <span className="selected__book--time">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </span>
            </div>
            <div className="selected__book--subtitle">{book?.subTitle}</div>

            <div className="selected__book--image">
              {book?.subscriptionRequired && (
                <span className="book__premium">Premium</span>
              )}

              <img src={book?.imageLink} alt={book?.title} />
            </div>

            <div className="selected__book--info">
              <h3>{book?.title}</h3>
              <p>{book?.author}</p>
            </div>
          </div>
        )}
      </section>

      <section>
        <div className="recommended__books">
          <h1 className="recommended__title">Recommended for you</h1>
          <p className="recommended__subtitle"> We think you'll like these</p>
          <div className="recommended__list" ref={recommendedListRef}>
            {isRecommendedLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <BookSkeleton key={index} />
                ))
              : [
                  ...recommendedBooks,
                  ...recommendedBooks,
                  ...recommendedBooks,
                ].map((book, index) => (
                  <Link
                    href={`/book/${book.id}`}
                    className="recommended__book"
                    key={`${book.id}-${index}`}
                  >
                    {book.subscriptionRequired && (
                      <span className="book__premium">Premium</span>
                    )}
                    <img src={book.imageLink} alt={book.title} />
                    <h3 className="recommended__book--title">{book.title}</h3>
                    <p className="recommended__book--author">{book.author}</p>
                    <p className="recommended__book--subtitle">
                      {book.subTitle}
                    </p>
                    <div className="recommended__details">
                      {book.averageRating} ⭐{" "}
                      <p className="recommended__duration">
                        <IoTimeOutline />
                        {Number.isFinite(durations[book.id])
                          ? `${Math.floor(durations[book.id] / 60)}:${Math.floor(
                              durations[book.id] % 60,
                            )
                              .toString()
                              .padStart(2, "0")}`
                          : "--:--"}
                      </p>
                    </div>
                    <audio
                      preload="metadata"
                      src={book.audioLink}
                      onLoadedMetadata={(event) => {
                        const duration = event.currentTarget.duration;

                        setDurations((current) => ({
                          ...current,
                          [book.id]: duration,
                        }));
                      }}
                    />
                  </Link>
                ))}
          </div>
        </div>
      </section>
      <section>
        <div className="suggested__books">
          <h1 className="suggested__title">Suggested Books</h1>
          <p className="suggested__subtitle">Browse those books</p>

        <div className="suggested__list" ref={suggestedListRef}>
            {isSuggestedLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <BookSkeleton key={index} />
                ))
              : [...suggestedBooks, ...suggestedBooks, ...suggestedBooks].map(
                  (book, index) => (
                    <Link
                      href={`/book/${book.id}`}
                      className="suggested__book"
                     key={`${book.id}-${index}`}
                    >
                      {book.subscriptionRequired && (
                        <span className="book__premium">Premium</span>
                      )}
                      <img src={book.imageLink} alt={book.title} />
                      <h3 className="suggested__book--title">{book.title}</h3>
                      <p className="suggested__book--author">{book.author}</p>
                      <p className="suggested__book--subtitle">
                        {book.subTitle}
                      </p>
                      <div className="suggested__details">
                        {book.averageRating} ⭐{" "}
                        <p className="recommended__duration">
                          <IoTimeOutline />
                          {Math.floor(durations[book.id] / 60)}:
                          {Math.floor(durations[book.id] % 60)
                            .toString()
                            .padStart(2, "0")}
                        </p>
                      </div>
                      <audio
                        src={book.audioLink}
                        onLoadedMetadata={(event) => {
                          const duration = event.currentTarget.duration;

                          setDurations((current) => ({
                            ...current,
                            [book.id]: duration,
                          }));
                        }}
                      />
                    </Link>
                  ),
                )}
          </div>
        </div>
      </section>
    </div>
  );
}
