import reducer from './store/reducer';

function createStore(reducer) {
  let state;
  const listeners = [];

  function subscribe(listener) {
    listeners.push(listener);
  }

  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach(action => action());
  }

  function getState() {
    return state;
  }

  return {
    subscribe,
    dispatch,
    getState
  };
}

export default createStore(reducer);
