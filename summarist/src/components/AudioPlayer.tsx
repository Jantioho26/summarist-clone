"use client";
import { useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdReplay10, MdForward10 } from "react-icons/md";
import { auth, db } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

type AudioPlayerProps = {
  bookId: string;
  audioLink: string;
  title: string;
  author: string;
  imageLink: string;
};

export default function AudioPlayer({
  bookId,
  audioLink,
  title,
  author,
  imageLink,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const saveFinishedBook = async () => {
    const user = auth.currentUser;

    if (!user) return;

    try {
      await setDoc(doc(db, "users", user.uid, "finishedBooks", bookId), {
        bookId,
        title,
        author,
        imageLink,
        finishedAt: new Date(),
      });

      console.log("Finished book saved to Firebase!");
    } catch (error) {
      console.error("Error saving finished book:", error);
    }
  };
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const skipAudio = (seconds: number) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime += seconds;
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="audio__player">
      <div className="audio__book">
        <img src={imageLink} alt={title} className="audio__book--image" />

        <div className="audio__book--info">
          <p>{title}</p>
          <span>{author}</span>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={audioLink}
        preload="metadata"
        onEnded={() => {
          setIsPlaying(false);
          void saveFinishedBook();
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
        }}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;

          setCurrentTime(audio.currentTime);

          if (Number.isFinite(audio.duration)) {
            setDuration(audio.duration);
          }
        }}
      />
      <div className="audio__controls">
        <button onClick={() => skipAudio(-10)} aria-label="Rewind 10 seconds">
          <MdReplay10 />
        </button>

        <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <button onClick={() => skipAudio(10)} aria-label="Forward 10 seconds">
          <MdForward10 />
        </button>
      </div>
      <div className="audio__time">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={Number.isFinite(duration) && duration > 0 ? duration : 1}
          value={duration > 0 && Number.isFinite(duration) ? currentTime : 0}
          //   disabled={!Number.isFinite(duration) || duration <= 0}
          onChange={(event) => {
            if (!audioRef.current) return;

            audioRef.current.currentTime = Number(event.target.value);
            setCurrentTime(Number(event.target.value));
          }}
        />
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
