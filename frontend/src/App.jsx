import React, { useState } from "react";
import FaceMoodDetector from "./components/FacialEx";
import MoodSongs from "./components/Songs";

const App = () => {
  const [songs, setSongs] = useState([]);
  return (
    <div>
      <FaceMoodDetector setSongs={setSongs} />
      <MoodSongs songs={songs} setSongs={setSongs} />
    </div>
  );
};

export default App;
