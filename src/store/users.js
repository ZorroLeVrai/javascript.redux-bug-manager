import { createSlice, createAction } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';

let lastId = 0;

const slice = createSlice({
  name: "users",
  initialState: {},
  reducers: {
    //actions => action handlers
    userAdded: (users, action) => {
      const id = ++lastId;
      users[id] = {
          id,
          name: action.payload.name,
          bugs: []
        };
    },
    userRemoved: (users, action) => {
      delete users[String(action.payload.id)];
    },
    bugsAssignedToUser: (users, action) => {
      const user = users[String(action.payload.userId)];
      if (user)
        user.bugs = [...user.bugs, action.payload.id];
    }
  }
});

//Action creators
const url = "/users";

export const addUser = (name) => (dispatch, getState) => {
  const action = createAction("users/userAdded");
  dispatch(action({name}));
};

export const assignBugToUser = (userId, bugIdList) => (dispatch, getState) => {
  for (const bugId of bugIdList)
  {
    dispatch(apiCallBegan({
      url: `bugs/${bugId}`,
      method: 'patch',
      data:  { userId },
      onSuccess: slice.actions.bugsAssignedToUser.type
    }));
  }
}

export function getBugsAssigned(state, userId) {
  const member = state.entities.users[String(userId)];
  if (member)
    return state.entities.bugs.list.filter(bug => member.bugs.list.includes(bug.id));

  throw new Error(`User id ${userId} does not exist`);
}

export const { userAdded, userRemoved, bugsAssignedToUser: bugsAssigned } = slice.actions;
export default slice.reducer;