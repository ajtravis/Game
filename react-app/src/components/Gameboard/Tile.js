import React, { memo, useMemo, useCallback } from 'react';

// Memoized Tile component to prevent unnecessary re-renders
const Tile = memo(({ 
  tile, 
  tower, 
  enemies, 
  onTileClick 
}) => {
  // Memoize className to avoid recalculation
  const tileClassName = useMemo(() => {
    const classes = ['tile'];
    
    if (tile.is_path) classes.push('path');
    else classes.push('empty');
    
    if (tile.is_spawn) classes.push('spawn');
    if (tile.is_base) classes.push('base');
    if (tower) classes.push('has-tower');
    
    return classes.join(' ');
  }, [tile.is_path, tile.is_spawn, tile.is_base, tower]);

  // Memoize click handler
  const handleClick = useCallback(() => {
    if (!tile.is_path && !tile.is_spawn && !tile.is_base && !tower) {
      onTileClick(tile.id);
    }
  }, [tile.is_path, tile.is_spawn, tile.is_base, tower, tile.id, onTileClick]);

  // Memoize cursor style
  const cursorStyle = useMemo(() => ({
    cursor: (!tile.is_path && !tile.is_spawn && !tile.is_base && !tower) ? 'pointer' : 'default'
  }), [tile.is_path, tile.is_spawn, tile.is_base, tower]);

  return (
    <div 
      className={tileClassName}
      onClick={handleClick}
      style={cursorStyle}
    >
      {/* Show tower if placed */}
      {tower && (
        <div className={`tower tower-${tower.type}`}>
          T
        </div>
      )}
      
      {/* Show enemies - only render if enemies exist */}
      {enemies.length > 0 && enemies.map(enemy => (
        <div key={enemy.id} className={`enemy enemy-${enemy.type}`} />
      ))}
    </div>
  );
});

Tile.displayName = 'Tile';

export default Tile;
