// Error handling Redux store
const ADD_ERROR = 'errors/ADD_ERROR';
const DISMISS_ERROR = 'errors/DISMISS_ERROR';
const CLEAR_ALL_ERRORS = 'errors/CLEAR_ALL_ERRORS';

// Action creators
export const addError = (error) => ({
  type: ADD_ERROR,
  payload: {
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
    ...error
  }
});

export const dismissError = (errorId) => ({
  type: DISMISS_ERROR,
  payload: errorId
});

export const clearAllErrors = () => ({
  type: CLEAR_ALL_ERRORS
});

// Helper function to create different types of errors
export const createError = (title, message, type = 'error') => ({
  title,
  message,
  type
});

export const createWarning = (title, message) => createError(title, message, 'warning');
export const createInfo = (title, message) => createError(title, message, 'info');

// Thunk for API error handling
export const handleApiError = (error, context = 'API') => (dispatch) => {
  console.error(`${context} Error:`, error);
  
  let errorMessage = 'An unexpected error occurred';
  let errorTitle = `${context} Error`;
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;
    
    if (status === 404) {
      errorTitle = 'Not Found';
      errorMessage = 'The requested resource was not found';
    } else if (status === 401) {
      errorTitle = 'Unauthorized';
      errorMessage = 'Please log in to continue';
    } else if (status === 403) {
      errorTitle = 'Forbidden';
      errorMessage = 'You do not have permission to perform this action';
    } else if (status === 500) {
      errorTitle = 'Server Error';
      errorMessage = 'Internal server error. Please try again later';
    } else if (data && data.message) {
      errorMessage = data.message;
    } else if (data && data.errors) {
      errorMessage = Array.isArray(data.errors) ? data.errors.join(', ') : data.errors;
    }
  } else if (error.request) {
    // Network error
    errorTitle = 'Network Error';
    errorMessage = 'Unable to connect to server. Check your internet connection';
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  dispatch(addError({
    title: errorTitle,
    message: errorMessage,
    type: 'error'
  }));
};

// Thunk for game-specific errors
export const handleGameError = (error, action = 'game action') => (dispatch) => {
  console.error(`Game Error during ${action}:`, error);
  
  dispatch(addError({
    title: 'Game Error',
    message: `Failed to ${action}. ${error.message || 'Please try again.'}`,
    type: 'error'
  }));
};

// Initial state
const initialState = {
  notifications: []
};

// Reducer
export default function errorsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ERROR:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
      
    case DISMISS_ERROR:
      return {
        ...state,
        notifications: state.notifications.filter(error => error.id !== action.payload)
      };
      
    case CLEAR_ALL_ERRORS:
      return {
        ...state,
        notifications: []
      };
      
    default:
      return state;
  }
}
