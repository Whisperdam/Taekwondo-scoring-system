import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

const TaekwondoScoring = () => {
  // Match setup state
  const [redPlayer, setRedPlayer] = useState('');
  const [bluePlayer, setBluePlayer] = useState('');
  const [weightCategory, setWeightCategory] = useState('');
  const [matchDuration, setMatchDuration] = useState(180); // 3 minutes default
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(matchDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  
  // Scoring state
  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);
  const [redPenalties, setRedPenalties] = useState(0);
  const [bluePenalties, setBluePenalties] = useState(0);
  
  // Match state
  const [matchStarted, setMatchStarted] = useState(false);
  
  const intervalRef = useRef(null);

  // Weight categories
  const weightCategories = [
    '(Under 54kg)',
    '(Under 58kg)',
    '(Under 63kg)',
    '(Under 68kg)',
    '(Under 74kg)',
    '(Under 80kg)',
    '(Over 80kg)'
  ];

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer controls
  const startStopTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(matchDuration);
  };

  // Match controls
  const startMatch = () => {
    if (redPlayer && bluePlayer) {
      setMatchStarted(true);
      setTimeLeft(matchDuration);
    }
  };

  const resetMatch = () => {
    setMatchStarted(false);
    setIsRunning(false);
    setTimeLeft(matchDuration);
    setCurrentRound(1);
    setRedScore(0);
    setBlueScore(0);
    setRedPenalties(0);
    setBluePenalties(0);
  };

  // Scoring functions
  const addScore = (player, points) => {
    if (player === 'red') {
      setRedScore(prev => prev + points);
    } else {
      setBlueScore(prev => prev + points);
    }
  };

  const subtractScore = (player, points) => {
    if (player === 'red') {
      setRedScore(prev => Math.max(0, prev - points));
    } else {
      setBlueScore(prev => Math.max(0, prev - points));
    }
  };

  const addPenalty = (player) => {
    if (player === 'red') {
      setRedPenalties(prev => prev + 1);
      setBlueScore(prev => prev+1);
    } else {
      setBluePenalties(prev => prev + 1);
        setRedScore(prev => prev+1);
    }
  };

  if (!matchStarted) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Taekwondo Scoring System
          </h1>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Red Player Name
                </label>
                <input
                  type="text"
                  value={redPlayer}
                  onChange={(e) => setRedPlayer(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter red player name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blue Player Name
                </label>
                <input
                  type="text"
                  value={bluePlayer}
                  onChange={(e) => setBluePlayer(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter blue player name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight Category
              </label>
              <select
                value={weightCategory}
                onChange={(e) => setWeightCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select weight category</option>
                {weightCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Match Duration (seconds)
              </label>
              <input
                type="number"
                value={matchDuration}
                onChange={(e) => setMatchDuration(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="60"
                max="600"
              />
              <p className="text-sm text-gray-500 mt-1">
                Current: {formatTime(matchDuration)}
              </p>
            </div>

            <button
              onClick={startMatch}
              disabled={!redPlayer || !bluePlayer}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Start Match
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto h-full">
        {/* Portrait Layout */}
        <div className="portrait:block landscape:hidden">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-3 mb-3">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">
                Taekwondo Scoring
              </h1>
              <button
                onClick={resetMatch}
                className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                New Match
              </button>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {weightCategory} | Round: {currentRound}
            </div>
          </div>

          {/* Timer */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-3">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-800 mb-3">
                {formatTime(timeLeft)}
              </div>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={startStopTimer}
                  className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                    isRunning 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                  {isRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={resetTimer}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Scoring */}
          <div className="grid grid-cols-2 gap-2">
            {/* Red Player */}
            <div className="bg-red-600 text-white rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-bold mb-2 text-center">{redPlayer}</h2>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold">{redScore}</div>
                <div className="text-xs mt-1">Penalties: {redPenalties}</div>
              </div>
              
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => addScore('red', 1)}
                    className="bg-red-700 hover:bg-red-800 px-2 py-2 rounded text-xs transition-colors"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => addScore('red', 2)}
                    className="bg-red-700 hover:bg-red-800 px-2 py-2 rounded text-xs transition-colors"
                  >
                    +2
                  </button>
                  <button
                    onClick={() => addScore('red', 3)}
                    className="bg-red-700 hover:bg-red-800 px-2 py-2 rounded text-xs transition-colors"
                  >
                    +3
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => subtractScore('red', 1)}
                    className="bg-red-800 hover:bg-red-900 px-2 py-2 rounded transition-colors flex items-center justify-center text-xs"
                  >
                    <Minus className="w-3 h-3 mr-1" />
                    -1
                  </button>
                  <button
                    onClick={() => addPenalty('red')}
                    className="bg-yellow-600 hover:bg-yellow-700 px-2 py-2 rounded transition-colors text-xs"
                  >
                    Penalty
                  </button>
                </div>
              </div>
            </div>

            {/* Blue Player */}
            <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-bold mb-2 text-center">{bluePlayer}</h2>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold">{blueScore}</div>
                <div className="text-xs mt-1">Penalties: {bluePenalties}</div>
              </div>
              
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => addScore('blue', 1)}
                    className="bg-blue-700 hover:bg-blue-800 px-2 py-2 rounded text-xs transition-colors"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => addScore('blue', 2)}
                    className="bg-blue-700 hover:bg-blue-800 px-2 py-2 rounded text-xs transition-colors"
                  >
                    +2
                  </button>
                  <button
                    onClick={() => addScore('blue', 3)}
                    className="bg-blue-700 hover:bg-blue-800 px-2 py-2 rounded text-xs transition-colors"
                  >
                    +3
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => subtractScore('blue', 1)}
                    className="bg-blue-800 hover:bg-blue-900 px-2 py-2 rounded transition-colors flex items-center justify-center text-xs"
                  >
                    <Minus className="w-3 h-3 mr-1" />
                    -1
                  </button>
                  <button
                    onClick={() => addPenalty('blue')}
                    className="bg-yellow-600 hover:bg-yellow-700 px-2 py-2 rounded transition-colors text-xs"
                  >
                    Penalty
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Landscape Layout */}
        <div className="portrait:hidden landscape:flex landscape:h-screen landscape:flex-col">
          {/* Header - Compact */}
          <div className="bg-white rounded-lg shadow-lg p-2 mb-2 flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="text-sm font-bold text-gray-800">
                {weightCategory} | Round: {currentRound}
              </div>
              <div className="text-4xl font-bold text-gray-800">
                {formatTime(timeLeft)}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={startStopTimer}
                  className={`flex items-center px-3 py-2 rounded-lg font-semibold transition-colors text-sm ${
                    isRunning 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={resetTimer}
                  className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={resetMatch}
                  className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  New
                </button>
              </div>
            </div>
          </div>

          {/* Scoring - Side by Side */}
          <div className="flex-1 grid grid-cols-2 gap-2">
            {/* Red Player - Left Side */}
            <div className="bg-red-600 text-white rounded-lg shadow-lg p-4 flex flex-col">
              <h2 className="text-2xl font-bold mb-2 text-center">{redPlayer}</h2>
              <div className="text-center mb-4 flex-1 flex flex-col justify-center">
                <div className="text-8xl font-bold">{redScore}</div>
                <div className="text-sm mt-2">Penalties: {redPenalties}</div>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => addScore('red', 1)}
                    className="bg-red-700 hover:bg-red-800 px-4 py-4 rounded-lg text-lg font-bold transition-colors"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => addScore('red', 2)}
                    className="bg-red-700 hover:bg-red-800 px-4 py-4 rounded-lg text-lg font-bold transition-colors"
                  >
                    +2
                  </button>
                  <button
                    onClick={() => addScore('red', 3)}
                    className="bg-red-700 hover:bg-red-800 px-4 py-4 rounded-lg text-lg font-bold transition-colors"
                  >
                    +3
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => subtractScore('red', 1)}
                    className="bg-red-800 hover:bg-red-900 px-4 py-3 rounded-lg transition-colors flex items-center justify-center font-bold"
                  >
                    <Minus className="w-5 h-5 mr-2" />
                    -1
                  </button>
                  <button
                    onClick={() => addPenalty('red')}
                    className="bg-yellow-600 hover:bg-yellow-700 px-4 py-3 rounded-lg transition-colors font-bold"
                  >
                    Penalty
                  </button>
                </div>
              </div>
            </div>

            {/* Blue Player - Right Side */}
            <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 flex flex-col">
              <h2 className="text-2xl font-bold mb-2 text-center">{bluePlayer}</h2>
              <div className="text-center mb-4 flex-1 flex flex-col justify-center">
                <div className="text-8xl font-bold">{blueScore}</div>
                <div className="text-sm mt-2">Penalties: {bluePenalties}</div>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => addScore('blue', 1)}
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-4 rounded-lg text-lg font-bold transition-colors"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => addScore('blue', 2)}
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-4 rounded-lg text-lg font-bold transition-colors"
                  >
                    +2
                  </button>
                  <button
                    onClick={() => addScore('blue', 3)}
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-4 rounded-lg text-lg font-bold transition-colors"
                  >
                    +3
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => subtractScore('blue', 1)}
                    className="bg-blue-800 hover:bg-blue-900 px-4 py-3 rounded-lg transition-colors flex items-center justify-center font-bold"
                  >
                    <Minus className="w-5 h-5 mr-2" />
                    -1
                  </button>
                  <button
                    onClick={() => addPenalty('blue')}
                    className="bg-yellow-600 hover:bg-yellow-700 px-4 py-3 rounded-lg transition-colors font-bold"
                  >
                    Penalty
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaekwondoScoring;