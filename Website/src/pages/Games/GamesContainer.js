import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { receiveGamesInfo } from 'actions/gamesApiActions';
import Games from './Games';

function GamesContainer({ ...rest }) {
  const gamesInfo = useSelector(store => store.games.gamesInfo);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!gamesInfo.length) {
      dispatch(receiveGamesInfo());
    }
  }, [gamesInfo.length, dispatch]);

  return <Games gamesInfo={gamesInfo} {...rest} />;
}

export default GamesContainer;