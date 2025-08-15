import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './ErrorNotification.css';

const ErrorNotification = () => {
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors?.notifications || []);
  const [visibleErrors, setVisibleErrors] = useState([]);

  useEffect(() => {
    setVisibleErrors(errors);
  }, [errors]);

  const dismissError = (errorId) => {
    setVisibleErrors(prev => prev.filter(error => error.id !== errorId));
    dispatch({ type: 'errors/DISMISS_ERROR', payload: errorId });
  };

  const dismissAll = () => {
    setVisibleErrors([]);
    dispatch({ type: 'errors/CLEAR_ALL_ERRORS' });
  };

  if (visibleErrors.length === 0) return null;

  return (
    <div className="error-notification-container">
      {visibleErrors.map((error) => (
        <div 
          key={error.id} 
          className={`error-notification ${error.type || 'error'}`}
        >
          <div className="error-content">
            <div className="error-icon">
              {error.type === 'warning' ? '⚠️' : 
               error.type === 'info' ? 'ℹ️' : '❌'}
            </div>
            <div className="error-text">
              <div className="error-title">{error.title}</div>
              {error.message && (
                <div className="error-message">{error.message}</div>
              )}
            </div>
          </div>
          <button 
            className="error-dismiss"
            onClick={() => dismissError(error.id)}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      ))}
      
      {visibleErrors.length > 1 && (
        <button 
          className="dismiss-all-button"
          onClick={dismissAll}
        >
          Dismiss All ({visibleErrors.length})
        </button>
      )}
    </div>
  );
};

export default ErrorNotification;
