import { useEffect, useState } from "react";
import "./App.css";
import Die from "./Die";
import Confetti from "react-confetti";

/* 
// More features as a challenge for myself:
1- Done == Modify the roll button style from an outline when focus to
an inner shadow.
2- Done == CSS: put real dots on the dice.
3- Done == Track number of rolls.
4- Done == Track the time it took to win.
5- Done == Save your best time in localStorage.
*/

export function confetti() {
  const { width, height } = useWindowSize();
  return <Confetti width={width} height={height} />;
}

function App() {
  const [newDice, setNewDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  // 1. initializing rollsNumber and leastRolls
  const [rollsNumber, setRollsNumber] = useState(0);
  const [leastRolls, setLeastRolls] = useState(() => {
    // 2. return the least rolls from the localStorage if it's not empty
    const storedRolls = localStorage.getItem("leastRolls");
    return storedRolls ? parseInt(storedRolls) : "N/A";
  });

  const [startTime, setStartTime] = useState(null);
  const [takenTime, setTakenTime] = useState(0);
  const [leastTime, setLeastTime] = useState(() => {
    const storedTime = localStorage.getItem("leastTime");
    return storedTime ? parseInt(storedTime) : "N/A";
  });

  useEffect(
    function () {
      const allAreHeld = newDice.every((dice) => dice.isheld);
      const firstHeld = newDice[0].value;
      const allAreSame = newDice.every((dice) => dice.value === firstHeld);

      if (allAreHeld && allAreSame) {
        console.log("You won!");
        setTenzies(true);
        // 3. Updating the least rolls score if the new rolls number is least
        if (leastRolls == "N/A" || rollsNumber < leastRolls) {
          localStorage.setItem("leastRolls", rollsNumber.toString());
          setLeastRolls(rollsNumber);
        }
        const currentTime = Date.now() - startTime;
        if (leastTime == "N/A" || currentTime < leastTime) {
          localStorage.setItem("leastTime", currentTime.toString());
          setLeastTime(currentTime);
        }
        setStartTime(null); // Stop the timer
      }
    },
    [newDice, rollsNumber, leastRolls, startTime, takenTime, leastTime]
  );

  // set a timer for showing it to the user
  useEffect(() => {
    let timer;
    if (startTime) {
      timer = setInterval(() => {
        setTakenTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime]);

  function generateNewDie(i) {
    let oldDice = [".", "..", "...", "....", ".....", "......"];
    return {
      id: i,
      value: oldDice[Math.floor(Math.random() * oldDice.length)],
      isheld: false,
    };
  }

  function allNewDice() {
    let newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie(i));
    }
    return newDice;
  }

  function roll() {
    if (!tenzies) {
      setNewDice((prevDice) =>
        prevDice.map((dice) => {
          if (dice.isheld) {
            return dice;
          } else {
            return generateNewDie(dice.id);
          }
        })
      );
      setRollsNumber((prevNumber) => prevNumber + 1);

      if (rollsNumber === 0) {
        setStartTime(Date.now());
      }
    } else {
      setTenzies(false);
      setNewDice(allNewDice());
    }
  }

  function holdDice(id) {
    setNewDice((prevNewDice) =>
      prevNewDice.map((dice) => {
        if (dice.id === id) {
          return { ...dice, isheld: !dice.isheld };
        }
        return dice;
      })
    );
  }

  let DiceElement = newDice.map((dice) => (
    <Die
      key={dice.id}
      value={dice.value}
      style={{
        backgroundColor: dice.isheld ? "#59E391" : "#ffffff",
      }}
      holdDice={() => holdDice(dice.id)}
    />
  ));

  return (
    <>
      <main>
        <div className="container">
          {tenzies && <Confetti />}
          <div className="title">Tenzies</div>
          <div className="description">
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls.
          </div>
          <div className="numbers">{DiceElement}</div>
          <button onClick={roll}>{tenzies ? "New Game" : "Roll"}</button>
        </div>
        <div className="best-results">
          <div className="least-rolls">
            Least rolls <span>{leastRolls}</span>
          </div>
          <div className="taken-time">
            Taken time <span>{Math.floor(takenTime / 1000) + " seconds"}</span>
          </div>
          <div className="least-time">
            Least time{" "}
            <span>
              {leastTime == "N/A"
                ? leastTime
                : Math.floor(leastTime / 1000) + " seconds"}
            </span>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
