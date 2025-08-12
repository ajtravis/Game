import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

function GameOverModal() {
  const dispatch = useDispatch();
 
  const { closeModal } = useModal();

  return (
    <>
      <h1>Game Over</h1>
      <button onClick={() => closeModal()}>Exit</button>
    </>
  );
}

export default GameOverModal;
