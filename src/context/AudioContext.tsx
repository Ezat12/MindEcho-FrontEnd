import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { libraryData } from "../data/libraryData";
import { mediaData } from "../data/mediaData";

interface Track {
  id: number;
  title: string;
  audioUrl: string;
  artist?: string;
  thumbnail?: string;
  mood?: string;
  category?: string;
  duration?: string;
}

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const allTracks: Track[] = [...libraryData, ...mediaData] as unknown as Track[];

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(new Audio());

  // 2. استخدام useCallback لمنع إعادة تعريف الدوال بشكل غير ضروري ولحل مشكلة الترتيب
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (currentTrack) audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentTrack]);

  const playTrack = useCallback(
    (track: Track) => {
      if (currentTrack?.id === track.id) {
        togglePlay();
        return;
      }
      setCurrentTrack(track);
      audioRef.current.src =
        track.audioUrl ||
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      audioRef.current.play();
      setIsPlaying(true);
    },
    [currentTrack, togglePlay],
  );

  const nextTrack = useCallback(() => {
    if (!currentTrack) return;
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * allTracks.length);
    } else {
      const currentIndex = allTracks.findIndex((t) => t.id === currentTrack.id);
      nextIndex = (currentIndex + 1) % allTracks.length;
    }
    playTrack(allTracks[nextIndex]);
  }, [currentTrack, isShuffle, playTrack]);

  const prevTrack = useCallback(() => {
    if (!currentTrack) return;
    const currentIndex = allTracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + allTracks.length) % allTracks.length;
    playTrack(allTracks[prevIndex]);
  }, [currentTrack, playTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [isRepeat, nextTrack]); // اعتماد الـ Effect على nextTrack المستقرة بـ useCallback

  const toggleShuffle = () => setIsShuffle((prev) => !prev);
  const toggleRepeat = () => setIsRepeat((prev) => !prev);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isShuffle,
        isRepeat,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        toggleShuffle,
        toggleRepeat,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
};
