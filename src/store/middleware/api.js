import axios from 'axios';
import * as actions from '../api';

const api = store => next => async action => {
  if (action.type !== actions.apiCallBegan.type) {
    next(action);
    return;
  }

  const { dispatch, getState } = store;
  const { url, method, data, onStart, onSuccess, onError } = action.payload;
  
  if (onStart)
    dispatch({ type: onStart });

  //to display the action in the Redux Toolkit
  next(action);

  try {
    const response = await axios.request({
      baseURL: 'http://localhost:9001/api',
      url,
      method,
      data
    });

    console.log({ response });

    //General success action
    dispatch(actions.apiCallSuccess(response.data));

    //Specific success action
    if (onSuccess)
      dispatch({type: onSuccess, payload: response.data});
  }
  catch (error) {
    //General error action
    dispatch(actions.apiCallFailed(error.message))

    //Specific error action
    if (onError)
      dispatch({type: onError, payload: error.message});
  }
}

export default api;