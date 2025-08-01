import React, { useState } from "react";
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaYoutube } from "react-icons/fa";

const MoodSongs = () => {
  const [songs, setSongs] = useState([
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      url: "https://youtube.com/watch?v=4NRXx6U8ABQ",
      liked: false,
      playing: false
    },
    {
      id: 2,
      title: "Save Your Tears",
      artist: "The Weeknd",
      url: "https://youtube.com/watch?v=XXYlFuWEuKI",
      liked: true,
      playing: false
    },
    {
      id: 3,
      title: "Stay",
      artist: "The Kid LAROI, Justin Bieber",
      url: "https://youtube.com/watch?v=kTJczUoc26U",
      liked: false,
      playing: false
    },
    {
      id: 4,
      title: "good 4 u",
      artist: "Olivia Rodrigo",
      url: "https://youtube.com/watch?v=gNi_6U5Pm_o",
      liked: false,
      playing: true
    },
  ]);

  const togglePlay = (id) => {
    setSongs(songs.map(song => ({
      ...song,
      playing: song.id === id ? !song.playing : false
    })));
  };

  const toggleLike = (id) => {
    setSongs(songs.map(song => 
      song.id === id ? { ...song, liked: !song.liked } : song
    ));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Recommended Songs</h2>
      <p className="text-gray-600 mb-6">Based on your current mood</p>
      
      <div className="space-y-4">
        {songs.map((song) => (
          <div 
            key={song.id}
            className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
              song.playing 
                ? 'bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 shadow-md' 
                : 'bg-white hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <div className="flex items-center space-x-4">
            
              
              <div>
                <h3 className="font-semibold text-gray-800">{song.title}</h3>
                <p className="text-sm text-gray-600">{song.artist}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => toggleLike(song.id)}
                className="text-lg"
              >
                {song.liked ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-400 hover:text-red-500" />
                )}
              </button>
                <button 
                onClick={() => togglePlay(song.id)}
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  song.playing ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {song.playing ? <FaPause /> : <FaPlay className="ml-1" />}
              </button>
              
             
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:shadow-lg transition-all">
          Load More
        </button>
      </div>
    </div>
  );
};

export default MoodSongs;