import React, { useState, useEffect } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const operations = ['+', '-', '*'];
const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const generateQuestion = () => {
  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let answer, options;

  switch (operation) {
    case '+':
      answer = dice1 + dice2;
      break;
    case '-':
      answer = dice1 - dice2;
      break;
    case '*':
      answer = dice1 * dice2;
      break;
  }

  options = [
    answer,
    answer + Math.floor(Math.random() * 5) + 1,
    answer - Math.floor(Math.random() * 5) + 1,
    Math.floor(Math.random() * 20) + 1
  ].sort(() => Math.random() - 0.5);

  return { dice1, dice2, operation, answer, options };
};

const MathDiceGame = () => {
  const [gameState, setGameState] = useState('start');
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [timeLeft, setTimeLeft] = useState(60);
  const [question, setQuestion] = useState(generateQuestion());
  const [passes, setPasses] = useState({ player1: 2, player2: 2 });
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      if (currentPlayer === 1) {
        setGameState('player2ready');
        setCurrentPlayer(2);
      } else {
        setGameState('gameover');
      }
      setTimeLeft(60);
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft, currentPlayer]);

  const startGame = (player) => {
    setGameState('playing');
    setCurrentPlayer(player);
    setQuestion(generateQuestion());
    setLastAnswerCorrect(null);
  };

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === question.answer) {
      setScores(prev => ({
        ...prev,
        [`player${currentPlayer}`]: prev[`player${currentPlayer}`] + 1
      }));
      setLastAnswerCorrect(true);
    } else {
      setScores(prev => ({
        ...prev,
        [`player${currentPlayer}`]: Math.max(0, prev[`player${currentPlayer}`] - 1)
      }));
      setLastAnswerCorrect(false);
    }
    setQuestion(generateQuestion());
  };

  const handlePass = () => {
    if (passes[`player${currentPlayer}`] > 0) {
      setPasses(prev => ({
        ...prev,
        [`player${currentPlayer}`]: prev[`player${currentPlayer}`] - 1
      }));
      setQuestion(generateQuestion());
      setLastAnswerCorrect(null);
    }
  };

  const DiceIcon = diceIcons[question.dice1 - 1];
  const DiceIcon2 = diceIcons[question.dice2 - 1];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Math Dice Game</h1>
      {gameState === 'start' && (
        <Button onClick={() => startGame(1)}>Start Game (Player 1)</Button>
      )}
      {gameState === 'player2ready' && (
        <div className="text-center">
          <div className="text-xl mb-4">Player 1's turn is over. Player 2, are you ready?</div>
          <Button onClick={() => startGame(2)}>Start Player 2's Turn</Button>
        </div>
      )}
      {gameState === 'playing' && (
        <div className="text-center">
          <div className="text-xl mb-2">Player {currentPlayer}'s Turn</div>
          <div className="text-2xl mb-4">Time Left: {timeLeft}s</div>
          <div className="flex justify-center items-center space-x-4 mb-4">
            <DiceIcon size={48} />
            <span className="text-2xl">{question.operation}</span>
            <DiceIcon2 size={48} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {question.options.map((option, index) => (
              <Button key={index} onClick={() => handleAnswer(option)}>
                {option}
              </Button>
            ))}
          </div>
          <Button 
            onClick={handlePass} 
            disabled={passes[`player${currentPlayer}`] === 0}
          >
            Pass ({passes[`player${currentPlayer}`]} left)
          </Button>
          {lastAnswerCorrect !== null && (
            <div className={`mt-2 ${lastAnswerCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {lastAnswerCorrect ? 'Correct! +1 point' : 'Incorrect. -1 point'}
            </div>
          )}
          <div className="mt-4">
            <div>Player 1 Score: {scores.player1}</div>
            <div>Player 2 Score: {scores.player2}</div>
          </div>
        </div>
      )}
      {gameState === 'gameover' && (
        <Alert>
          <AlertTitle>Game Over!</AlertTitle>
          <AlertDescription>
            Player 1 Score: {scores.player1}
            <br />
            Player 2 Score: {scores.player2}
            <br />
            {scores.player1 > scores.player2 ? 'Player 1 Wins!' : 
             scores.player2 > scores.player1 ? 'Player 2 Wins!' : 'It\'s a Tie!'}
          </AlertDescription>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Play Again
          </Button>
        </Alert>
      )}
    </div>
  );
};

export default MathDiceGame;
