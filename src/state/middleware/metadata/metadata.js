// Specify generic metadata that may be used by external event listeners (for example, location is used by
// the analytics event handler).

const metadataMiddleware = store => next => action => {
  // Ignore thunks
  if (typeof action === 'object') {
    const state = store.getState();
    const history = !Array.isArray(state.history)
      ? []
      : state.history.map(({ pathname, search }) => `${pathname}${search}`);

    action.meta = {
      ...action.meta,
      timestamp: Date.now(),
      location: window.location,
      history,
    };
  }
  next(action);
};

export default metadataMiddleware;
