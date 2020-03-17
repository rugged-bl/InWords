import { GRANT_ACCESS } from 'src/actions/accessActions';

const initialState = {
  token: null,
  userId: null
};

const access = (state = initialState, action) => {
  if (action.type === GRANT_ACCESS) {
    return {
      token: action.payload.token,
      userId: action.payload.userId || action.payload.userid
    };
  }

  return state;
};

export default access;
