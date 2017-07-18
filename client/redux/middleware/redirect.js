import { routerActions } from 'react-router-redux';
import {
  isRejectedAction,
  isResolvedAction,
  isThenAction,
} from 'redux-optimist-promise';
const { push, goBack, replace } = routerActions;
import origin from './originUtil';

function redirect(redirection, action, getState, dispatch, pushAction) {
  if (typeof redirection === 'function') {
    const state = getState();
    const payload = redirection(action, state);
    dispatch(origin(pushAction(payload), action));
  } else if (typeof redirection === 'object') {
    if (redirection.back) {
      dispatch(origin(goBack(), action));
    } else if (redirection.relative) {
      const { routing } = getState();
      dispatch(
        origin(
          pushAction(routing.location.pathname + redirection.relative),
          action
        )
      );
    } else if (redirection.clearHistory && redirection.location) {
      // clearHistory is handled in the ui duck
      redirect(redirection.location, action, getState, dispatch, replace);
    } else if (redirection.replace) {
      redirect(redirection.replace, action, getState, dispatch, replace);
    }
  } else {
    dispatch(origin(pushAction(redirection), action));
  }
}

export function getRedirectMeta(action) {
  const { meta, type } = action;
  if (
    !isThenAction(type) &&
    meta &&
    meta.redirectDirectly &&
    !meta.skipOptimist
  ) {
    return meta.redirectDirectly;
  } else if (isRejectedAction(type) && meta && meta.redirectOnError) {
    return meta.redirectOnError;
  } else if (isResolvedAction(type) && meta && meta.redirectOnSuccess) {
    return meta.redirectOnSuccess;
  }
}

export default ({ dispatch, getState }) => next => action => {
  const result = next(action);

  const redirectMeta = getRedirectMeta(action);
  if (redirectMeta) {
    redirect(redirectMeta, action, getState, dispatch, push);
  }

  return result;
};
