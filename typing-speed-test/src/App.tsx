import React, { useState, useEffect } from 'react';
import './App.css';

const sentence = "The quick brown fox jumps over the lazy dog."; // Sentence to type

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [timer, setTimer] = useState<number>(0); // Timer to calculate WPM
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(0); // Words per minute
  const [accuracy, setAccuracy] = useState<number>(100); // Typing accuracy
  
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isStarted && !isFinished) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000); // Increment every second
    }

    return () => clearInterval(interval); // Clear interval when component unmounts or when timer stops
  }, [isStarted, isFinished]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput(value);

    // Calculate accuracy
    const correctChars = value.split('').filter((char, idx) => char === sentence[idx]).length;
    const currentAccuracy = (correctChars / value.length) * 100;
    setAccuracy(currentAccuracy);

    // If the input matches the sentence, stop the timer and calculate WPM
    if (value === sentence) {
      setIsFinished(true);
      setIsStarted(false);
      const wordsTyped = sentence.split(' ').length;
      const timeInMinutes = timer / 60;
      const calculatedWpm = Math.round(wordsTyped / timeInMinutes);
      setWpm(calculatedWpm);
    }
  };

  const startTest = () => {
    setIsStarted(true);
    setIsFinished(false);
    setInput('');
    setTimer(0);
    setWpm(0);
    setAccuracy(100);
  };

  return (
    <div className="app">
      <h1>Typing Speed Test</h1>

      {!isStarted && !isFinished && (
        <button className="start-button" onClick={startTest}>
          Start Test
        </button>
      )}

      {isStarted && !isFinished && (
        <div>
          <p>Time: {timer}s</p>
          <p>Typing Sentence: <span className="sentence">{sentence}</span></p>
          <input
            type="text"
            value={input}
            onChange={handleChange}
            className="input-field"
            autoFocus
          />
        </div>
      )}

      {isFinished && (
        <div>
          <h2>Test Finished!</h2>
          <p>Words per Minute: {wpm}</p>
          <p>Accuracy: {accuracy.toFixed(2)}%</p>
          <button className="start-button" onClick={startTest}>
            Restart Test
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
