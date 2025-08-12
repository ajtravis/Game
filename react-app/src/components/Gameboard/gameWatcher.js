import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setGameOver } from '../../store/base';
import GameOverModal from '../GameOverModule';
import OpenModalButton from '../OpenModalButton';

const GameWatcher = () => {
  const health = useSelector(state => state.base?.health);
  const dispatch = useDispatch();

  useEffect(() => {
    if (health <= 0) {
      dispatch(setGameOver(true));
      <OpenModalButton
              modalComponent={<GameOverModal />}
            />
      // You could also trigger a modal, animation, etc. here
    }
  }, [health, dispatch]);

  return null; // No UI, just watching
};

export default GameWatcher;