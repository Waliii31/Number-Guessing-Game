"use client"; // Enables client-side rendering for this component

// Importing necessary hooks and components from React and custom components
import { useState, useEffect, ChangeEvent } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Defining the NumberGuessingComponent function component
export default function NumberGuessing(): JSX.Element {
  // State variables to manage the game state
  const [gameStarted, setGameStarted] = useState<boolean>(false); // Indicates if the game has started
  const [gameOver, setGameOver] = useState<boolean>(false); // Indicates if the game is over
  const [paused, setPaused] = useState<boolean>(false); // Indicates if the game is paused
  const [targetNumber, setTargetNumber] = useState<number>(0); // The number to be guessed
  const [userGuess, setUserGuess] = useState<number | string>(""); // The user's guess (can be a number or an empty string)
  const [attempts, setAttempts] = useState<number>(0); // Number of attempts made by the user
  const [hint, setHint] = useState<string>(""); // Hint for whether the guess is higher or lower
  const [errorMessage, setErrorMessage] = useState<string>(""); // Error message for invalid input

  // useEffect to generate a new target number when the game starts or resumes
  useEffect(() => {
    if (gameStarted && !paused) {
      const randomNumber: number = Math.floor(Math.random() * 10) + 1; // Generate a random number between 1 and 10
      console.log(randomNumber)
      setTargetNumber(randomNumber); // Set the target number
    }
  }, [gameStarted, paused]); // Dependencies: gameStarted and paused

  // Function to handle the start of the game
  const handleStartGame = (): void => {
    setGameStarted(true); // Start the game
    setGameOver(false); // Reset the game over state
    setAttempts(0); // Reset the attempts counter
    setPaused(false); // Ensure the game is not paused
    setHint(""); // Reset the hint
    setErrorMessage(""); // Reset the error message
  };

  // Function to handle pausing the game
  const handlePauseGame = (): void => {
    setPaused(true); // Pause the game
  };

  // Function to handle resuming the game
  const handleResumeGame = (): void => {
    setPaused(false); // Resume the game
  };

  const triggerConfetti = (): void => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }, // Set the origin for where the confetti will come from
    });
  };

  // Function to handle the user's guess
  const handleGuess = (): void => {
    // Check if the user's guess is within the valid range (1-10)
    if (typeof userGuess === "number" && (userGuess < 1 || userGuess > 10)) {
      setErrorMessage("Please enter a number between 1 and 10.");
      return; // Exit the function if the guess is invalid
    }

    setErrorMessage(""); // Clear any previous error messages

    if (typeof userGuess === "number" && userGuess === targetNumber) {
      setGameOver(true); // If the guess is correct, end the game
      setHint(""); // Clear the hint when the game is over
      triggerConfetti(); // Trigger confetti on correct answer
    } else if (typeof userGuess === "number") {
      // If the guess is wrong, give a hint
      setHint(userGuess < targetNumber ? "Higher!" : "Lower!");
      setAttempts(attempts + 1); // Increment the attempts counter
    }
  };

  // Function to handle restarting the game
  const handleTryAgain = (): void => {
    setGameStarted(false); // Reset the game state
    setGameOver(false); // Reset the game over state
    setUserGuess(""); // Clear the user's guess
    setAttempts(0); // Reset the attempts counter
    setHint(""); // Reset the hint
    setErrorMessage(""); // Clear any error messages
  };

  // Function to handle input change for user's guess
  const handleUserGuessChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    
    // If the input is empty, reset the userGuess to an empty string
    if (value === "") {
      setUserGuess("");
      return;
    }
  
    // Parse the input as a number, but only update if it's a valid number
    const parsedValue = parseInt(value, 10);
  
    if (!isNaN(parsedValue)) {
      setUserGuess(parsedValue);
    } else {
      setUserGuess(""); // Handle invalid values as an empty string
    }
  };
  

  // JSX to render the game UI
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-black">
      {/* Main container for the game */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Title of the game */}
        <h1 className="text-3xl font-bold text-center mb-2 text-black">
          Number Guessing Game
        </h1>
        {/* Description of the game */}
        <p className="text-center text-black mb-4">
          Try to guess the number between 1 and 10!
        </p>
        {/* Conditional rendering: show start button if game hasn't started */}
        {!gameStarted && (
          <div className="flex justify-center mb-4">
            {/* Button to start the game */}
            <Button
              onClick={handleStartGame}
              className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Start Game
            </Button>
          </div>
        )}
        {/* Conditional rendering: show game controls if game started and not over */}
        {gameStarted && !gameOver && (
          <div>
            <div className="flex justify-center mb-4">
              {/* Button to resume the game if paused */}
              {paused ? (
                <Button
                  onClick={handleResumeGame}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Resume
                </Button>
              ) : (
                /* Button to pause the game */
                <Button
                  onClick={handlePauseGame}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Pause
                </Button>
              )}
            </div>

            <div className="flex justify-center mb-4">
              {/* Input field for user's guess */}
              <Input
                type="number"
                value={userGuess}
                onChange={handleUserGuessChange}
                className="bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 w-full max-w-xs text-black"
                placeholder="Enter your guess"
              />
              {/* Button to submit the guess */}
              <Button
                onClick={handleGuess}
                className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded ml-4"
              >
                Guess
              </Button>
            </div>

            {/* Display error message if guess is out of range */}
            {errorMessage && (
              <div className="text-center text-red-500 mb-4">
                <p>{errorMessage}</p>
              </div>
            )}

            <div className="text-center text-black mb-4">
              {/* Display number of attempts */}
              <p>Attempts: {attempts}</p>
              {/* Display the hint */}
              {hint && <p>{hint}</p>}
            </div>
          </div>
        )}
        {/* Conditional rendering: show game over message if game is over */}
        {gameOver && (
          <div>
            <div className="text-center mb-4 text-black">
              {/* Game over message */}
              <h2 className="text-2xl font-bold">Game Over!</h2>
              <p>You guessed the number in {attempts} attempts.</p>
            </div>
            <div className="flex justify-center">
              {/* Button to try the game again */}
              <Button
                onClick={handleTryAgain}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
