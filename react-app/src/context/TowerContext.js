import { createContext, useState,  } from "react";
import towersObj from '../assets/towers';

export const TowerContext = createContext();
export const TowerProvider = props => {
  const [towerType, setTowerType] = useState('basic');
  const tower = towersObj[towerType];

  return (
    <TowerContext.Provider value={{ towerType, setTowerType }}>
      {props.children}
    </TowerContext.Provider>
  );
};

export default TowerProvider;