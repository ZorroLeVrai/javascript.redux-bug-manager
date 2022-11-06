const logger = param => store => next => action => {
  console.log({param, store, next, action});
  return next(action);
}

export default logger;