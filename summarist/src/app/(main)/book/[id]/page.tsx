import SearchBar from "@/components/SearchBar";
import { IoBookmarkOutline } from "react-icons/io5";
import LibraryButton from "@/components/LibraryButton";
import BookActions from "@/components/BookActions";

type BookPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;

  const response = await fetch(
    `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`,
  );

  const book = await response.json();
 

  return (
    <div>
      <SearchBar />
      <div className="book__details--top">
        <div className="book__details--info">
          <h1 className="book__title">{book.title}</h1>

          <h2 className="book__author">{book.author}</h2>
          <h3 className="book__subTitle">{book.subTitle}</h3>

          <div className="book__stats">
            <div className="book__stat">
              ⭐
              <span>
                {book.averageRating} ({book.totalRating} ratings)
              </span>
            </div>
            <div className="book__stat">
              ⏱<span>Duration</span>
            </div>

            <div className="book__stat">
              🎙
              <span>{book.type}</span>
            </div>

            <div className="book__stat">
              💡
              <span>{book.keyIdeas} Key ideas</span>
            </div>
          </div>
          <BookActions
  bookId={book.id}
  subscriptionRequired={book.subscriptionRequired}
/>
          <LibraryButton
            id={book.id}
            title={book.title}
            author={book.author}
            imageLink={book.imageLink}
            subTitle={book.subTitle}
            averageRating={book.averageRating}
            audioLink={book.audioLink}
          />
        </div>
        <div className="book__details--image">
        <img 
        className="book__image" 
        src={book.imageLink} 
        alt={book.title} 
        />
        </div>
      </div>
      <div className="book__description">
        <h3>What's it about?</h3>

        <div className="book__tags">
          {book.tags?.map((tag: string) => (
            <span className="book__tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <p>{book.bookDescription}</p>

        <h3>About the author</h3>
        <p>{book.authorDescription}</p>
      </div>
    </div>
  );
}
