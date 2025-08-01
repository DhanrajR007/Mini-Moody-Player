import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceMoodDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [expressions, setExpressions] = useState([]);
  const [dominantEmotion, setDominantEmotion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load Models
  const loadModels = async () => {
    const MODEL_URL = '/models';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
  };

  // Start Camera
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
        };
      }
    } catch (err) {
      setError("Camera access denied or not working.");
      setIsLoading(false);
      console.error(err);
    }
  };

  // Run once: load models and start video
  useEffect(() => {
    const setup = async () => {
      try {
        await loadModels();
        await startVideo();
      } catch (err) {
        setError("Setup failed.");
        console.error(err);
      }
    };
    setup();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Button Click: Detect emotions
  const detectEmotions = async () => {
    if (!videoRef.current || isLoading) return;

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detection) {
        const sortedExpressions = Object.entries(detection.expressions)
          .map(([emotion, value]) => ({
            emotion,
            value: parseFloat((value * 100).toFixed(1))
          }))
          .sort((a, b) => b.value - a.value);

        setExpressions(sortedExpressions);
        setDominantEmotion(sortedExpressions[0]);
        console.log("Detected Emotion:", sortedExpressions[0]?.emotion); // ✅ Console print

        const displaySize = {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);
      } else {
        setExpressions([]);
        setDominantEmotion(null);
        console.log("No face detected.");
      }
    } catch (err) {
      console.error("Detection error:", err);
    }
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      happy: 'from-yellow-400 to-yellow-500',
      sad: 'from-blue-400 to-blue-600',
      angry: 'from-red-500 to-red-600',
      fearful: 'from-purple-400 to-purple-600',
      disgusted: 'from-green-500 to-green-600',
      surprised: 'from-pink-400 to-pink-500',
      neutral: 'from-gray-400 to-gray-500'
    };
    return colors[emotion?.toLowerCase()] || 'from-gray-400 to-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Face Emotion Detector
          </h1>
          <p className="text-gray-600">
            Click the button to detect your emotion
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Panel */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover rounded-t-2xl"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Loading camera and models...</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                  <div className="text-white text-center p-4">
                    <p className="text-red-400 mb-2">Error: {error}</p>
                    <p className="text-sm">Please refresh and allow camera access</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4">
              <button
                onClick={detectEmotions}
                disabled={isLoading || error}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                  isLoading || error
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                }`}
              >
                {isLoading ? 'Initializing...' : 'Detect Emotion'}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Emotion Analysis
              </h2>

              {dominantEmotion ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Dominant Emotion
                    </h3>
                    <div className={`bg-gradient-to-r ${getEmotionColor(dominantEmotion.emotion)} text-white py-3 px-6 rounded-lg shadow-md`}>
                      <div className="flex justify-between items-center">
                        <span className="capitalize font-bold text-lg">
                          {dominantEmotion.emotion}
                        </span>
                        <span className="text-xl font-bold">
                          {dominantEmotion.value}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      All Emotions
                    </h3>
                    <div className="space-y-3">
                      {expressions.map(({ emotion, value }) => (
                        <div key={emotion} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize font-medium text-gray-700">
                              {emotion}
                            </span>
                            <span className="font-medium text-gray-900">
                              {value}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full bg-gradient-to-r ${getEmotionColor(emotion)}`}
                              style={{ width: `${value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    No Face Detected
                  </h3>
                  <p className="text-gray-500">
                    Click "Detect Emotion" to analyze your face
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceMoodDetector;
