import { createContext, useState } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
  const [song, setSong] = useState({
    url: "https://ik.imagekit.io/adarshh/Backend/day-13/songs/Jatt_Mehkma__RiskyjaTT.CoM__68HQZloQs.mp3",
    posterUrl:
      "https://ik.imagekit.io/adarshh/Backend/day-13/posters/Jatt_Mehkma__RiskyjaTT.CoM__xUI5V3TUb.jpeg",
    title: "Jatt Mehkma (RiskyjaTT.CoM)",
    mood: "happy",
  });

  const [Loading, setLoading] = useState(false);

  return (
    <SongContext.Provider value={{ song, setSong, Loading, setLoading }}>
      {children}
    </SongContext.Provider>
  );
};
