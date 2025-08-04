import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { FaCamera, FaSmile } from "react-icons/fa";

const FaceMoodDetector = ({ setSongs }) => {
  const videoRef = useRef(null);
  const [dominantEmotion, setDominantEmotion] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load Models & Start Camera
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      startVideo();
    };
    loadModels();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsLoading(false);
    } catch (err) {
      console.error("Camera access denied.", err);
      setIsLoading(false);
    }
  };

  const detectEmotions = async () => {
    if (!videoRef.current) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detection) {
      const sorted = Object.entries(detection.expressions).sort(
        (a, b) => b[1] - a[1]
      );
      const topEmotion = sorted[0][0];
      setDominantEmotion(topEmotion);

      try {
        const res = await axios.get(
          `http://localhost:3000/songs?mood=${topEmotion}`
        );
        setSongs(res.data.songs);
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    } else {
      setDominantEmotion("");
    }
  };

  return (
    <div className=" flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-2xl p-6">
        {/* Side by Side Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Camera Preview */}
          <div className="bg-black rounded-xl overflow-hidden relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white">
                Loading camera...
              </div>
            )}
          </div>

          {/* Controls & Result */}
          <div className="flex flex-col justify-center gap-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <FaSmile className="text-yellow-400" /> Mood Detector
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Detect your mood & get song recommendations
              </p>
            </div>

            <button
              onClick={detectEmotions}
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                isLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <FaCamera />
              {isLoading ? "Initializing..." : "Detect Mood"}
            </button>

            {dominantEmotion && (
              <div className="w-full text-center py-4 px-6 rounded-lg bg-blue-50 text-blue-800 font-medium capitalize shadow">
                You seem {dominantEmotion}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FaceMoodDetector;
