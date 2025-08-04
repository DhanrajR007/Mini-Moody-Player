import { useState, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

const MoodSongs = ({ songs }) => {
  const [playingIndex, setPlayingIndex] = useState(null);
  const audioRefs = useRef([]);

  const togglePlay = (index) => {
    if (playingIndex === index) {
      // Pause the current song
      audioRefs.current[index].pause();
      setPlayingIndex(null);
    } else {
      // Pause previous song if playing
      if (playingIndex !== null && audioRefs.current[playingIndex]) {
        audioRefs.current[playingIndex].pause();
      }
      // Play new song
      audioRefs.current[index].play();
      setPlayingIndex(index);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Recommended Songs
      </h2>

      {songs.length === 0 ? (
        <p className="text-gray-500">No songs available</p>
      ) : (
        <div className="space-y-4">
          {songs.map((song, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition p-4 rounded-xl shadow-sm"
            >
              {/* Song Info */}
              <div>
                <h3 className="font-semibold text-gray-800">{song.title}</h3>
                <p className="text-sm text-gray-500">{song.artist}</p>
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={() => togglePlay(index)}
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  playingIndex === index
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {playingIndex === index ? <FaPause /> : <FaPlay className="ml-1" />}
              </button>

              {/* Hidden Audio Element */}
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                src={song.audio}
                onEnded={() => setPlayingIndex(null)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodSongs;
