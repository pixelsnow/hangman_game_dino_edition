import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  setWordToGuess,
  setGameStatus,
  setNextRound,
  setScore,
} from "../../../features/GameSlice";

import {
  Word,
  Keyboard,
  Message,
  Object,
  LeaderBoard,
  Controls,
  Form,
} from "../../../assets/export_component/resource";

import classes from "./main.module.css";
import Category from "../../../components/Category/Category";
import { Categories } from "../../../types/API.model";

const Main = () => {
  const dispatch = useAppDispatch();
  const {
    wordToGuess,
    guessedLetters,
    gameStatus,
    category,
    score,
    hints,
    round,
  } = useAppSelector((state) => state.game);
  const [isLoading, setIsLoading] = useState(true);
  // After the page loads, set a word to be guessed
  useEffect(() => {
    dispatch(setWordToGuess());
    setIsLoading(false);
  }, [dispatch]);
  // Every time a new letter is guessed, check if the game is won or lost
  useEffect(() => {
    if (
      wordToGuess &&
      wordToGuess.split("").every((letter) => guessedLetters.includes(letter))
    ) {
      if (category === Categories.ALL) {
        dispatch(setScore(+2));
      } else if (hints.length >= 1) {
        dispatch(setScore(score - hints.length));
      }
      dispatch(setGameStatus("won"));
      dispatch(setNextRound());
    } else if (
      guessedLetters.filter((letter) => !wordToGuess.includes(letter)).length >
      8
    ) {
      dispatch(setGameStatus("lost"));
    }
  }, [dispatch, guessedLetters, wordToGuess]);

  console.log(wordToGuess);
  console.log(hints);
  console.log(score);
  console.log(round);

  if (isLoading) return <Spinner />;
  return (
    <div className={classes.main_container}>
      <div className={classes.mainLeaderboard_container}>
        <LeaderBoard />
        <Form />
      </div>
      <div className={classes.mainObject_container}>
        <Object
          wrongGuesses={
            guessedLetters.filter((letter) => !wordToGuess.includes(letter))
              .length
          }
        />
        <Word />
        <Keyboard />
      </div>
      <div>
        {gameStatus === "lost" && <Message />}
        <Category /> {gameStatus !== "playing" && <Controls />}
      </div>
    </div>
  );
};

export default Main;
