import { useContext } from "react";
import { getSong } from "../services/song.api";
import { SongContext } from "../song.context";

export const useSong = () => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("useSong must be used within a SongContextProvider");
  }

  const { song, setSong, Loading: loading, setLoading: setLoadingState } = context;

  const handleGetSong = async ({ mood }) => {
    try {
      setLoadingState(true);
      const response = await getSong(mood);
      if (response && response.song) {
        setSong(response.song);
      }
      setLoadingState(false);
    } catch (error) {
      console.error("Error fetching song:", error);
      setLoadingState(false);
    }
  };

  return {
    loading,
    song,
    handleGetSong,
  };
};

