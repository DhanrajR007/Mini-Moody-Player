import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceMoodDetector = () => {
  const videoRef = useRef(null);
  const [expressions, setExpressions] = useState(null);
  const [mostExpression, setMostExpression] = useState({ label: "", value: "" });

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    const startCamera = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error('Camera error:', err));
    };

    loadModels().then(startCamera);

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 🟢 Only run when button is clicked
  const handleDetectMood = async () => {
    if (!videoRef.current) return;

    const result = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (result && result.expressions) {
      const exp = result.expressions;
      setExpressions(exp);

      const highest = Object.entries(exp).reduce((max, current) =>
        current[1] > max[1] ? current : max
      );

      const label = highest[0];
      const value = (highest[1] * 100).toFixed(2);
      const expressionResult = { label, value };

      setMostExpression(expressionResult);
      console.log("Most probable expression (LIVE):", expressionResult);
    } else {
      setExpressions(null);
      setMostExpression({ label: "No Face", value: "0" });
      console.log("No face detected!");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">🎭 Face Mood Detector</h1>

      <video
        ref={videoRef}
        autoPlay
        muted
        width="480"
        height="360"
        className="border-4 border-blue-500 rounded-md shadow-lg"
      />

      <button
        onClick={handleDetectMood}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Detect Mood
      </button>

      {expressions && (
        <div className="mt-6 w-full max-w-md bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-center">Mood Breakdown</h2>
          <ul className="space-y-1">
            {Object.entries(expressions)
              .map(([emotion, value]) => ({
                emotion,
                percent: (value * 100).toFixed(2),
              }))
              .sort((a, b) => b.percent - a.percent)
              .map(({ emotion, percent }) => (
                <li key={emotion} className="flex justify-between text-lg">
                  <span className="capitalize">{emotion}</span>
                  <span>{percent}%</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {mostExpression.label && (
        <div className="mt-4 text-xl font-bold text-blue-600">
          Most Likely Mood: {mostExpression.label.toUpperCase()} = {mostExpression.value}%
        </div>
      )}
    </div>
  );
};

export default FaceMoodDetector;
