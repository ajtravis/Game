
import React, { useState } from 'react';

const GameBoard = () => {
  // 49 tiles, all start as "empty" (value: 0)
  const [tiles, setTiles] = useState(() => {
    const initialTiles = {};
    for (let i = 1; i <= 49; i++) {
      initialTiles[i] = 0;
    }
    return initialTiles;
  });

  // Style map for different tile types (you can expand this later)
  const getTileStyle = (value) => {
    switch (value) {
      case 0: // empty/grass
        return {
          backgroundColor: '#6aa84f',
          boxShadow: 'inset 0 0 4px #3e8231',
        };
      case 1: // path or selected
        return {
          backgroundColor: '#d9ad7c',
          boxShadow: 'inset 0 0 4px #a07652',
        };
      default:
        return {
          backgroundColor: '#555'
        };
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 50px)', gap: '0' }}>
        {Object.entries(tiles).map(([key, value]) => (
          <div
            key={key}
            style={{
              width: '50px',
              height: '50px',
              ...getTileStyle(value),
              transition: 'background-color 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onClick={() =>
              setTiles(prev => ({
                ...prev,
                [key]: prev[key] === 0 ? 1 : 0 // toggle grass <-> path
              }))
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'inset 0 0 6px #fff5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = getTileStyle(value).boxShadow;
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
