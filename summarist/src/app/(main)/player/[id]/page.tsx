import SearchBar from "@/components/SearchBar";
import AudioPlayer from "@/components/AudioPlayer";
import PlayerAccess from "@/components/PlayerAccess";

type PlayerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  const response = await fetch(
    `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`,
  );

  if (!response.ok) {
  throw new Error(`Failed to fetch book: ${response.status}`);
}

const responseText = await response.text();


const book = JSON.parse(responseText);

return (
  <div className="player">
    <SearchBar />

    <PlayerAccess subscriptionRequired={book.subscriptionRequired}>

    <div className="player__summary">
      <h2>{book.title}</h2>
      <p>{book.summary}</p>
    </div>

       <AudioPlayer
      bookId={id}
      audioLink={book.audioLink}
      title={book.title}
      author={book.author}
      imageLink={book.imageLink}
    />

    </PlayerAccess>
  </div>
);
}
