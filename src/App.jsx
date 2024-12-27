import Die from "../public/components/Die"
import { useState, useRef, useEffect } from "react"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App(){

  const [dice, setDice] = useState(() => generateAllNewDice())
  const buttonRef = useRef(null)

  const [rollCount, setRollCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef(null);

  const gameWon = dice.every(die => die.isHeld) && 
    dice.every(die => die.value === dice[0].value)

  useEffect(() => {
    if (!gameWon) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000)
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [gameWon]);

  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus();
    }
  }, [gameWon])

  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }))
  }

  function rollDice() {
    if (!gameWon) {
      setRollCount((prev) => prev + 1);
      setDice(oldDice => oldDice.map(die => 
        die.isHeld ?
          die :
          {...die, value: Math.ceil(Math.random() * 6)}
      ));
    } else {
      setDice(generateAllNewDice());
      setRollCount(0);
      setTimer(0);
    }
  }

  function hold(id){
    setDice(oldDice => oldDice.map(die =>
      die.id === id ?
        {...die, isHeld: !die.isHeld} :
        die
    ));
  }

  const diceElements = dice.map(dieObj => 
    (<Die 
      key={dieObj.id} 
      value={dieObj.value} 
      isHeld={dieObj.isHeld}
      hold={() => hold(dieObj.id)}
      />)
  )

  return (
    <main>
      {gameWon && <Confetti />}
      <div aria-live="polite" className="sr-only">
          {gameWon && 
            <p>Congratulations! You won in {rollCount} rolls and {timer} seconds! 
            Press "New Game" to start again.
            </p>
            }
      </div>

      <div className="stats">
        <p>Rolls: {rollCount}</p>
        <p>Time: {timer}s</p>
      </div>

      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      
      <div className="dice-container">
        {diceElements}
      </div>

      <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  )
}


// 01 Add a timer and a roll counter to see how quickly you can win the game.
// 02 Style the dice to look like real dice with pips instead of numbers 
