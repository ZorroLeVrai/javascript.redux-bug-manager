import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { apiCallBegan } from './api';
import moment from 'moment';

const slice = createSlice({
  name: "bugs",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null
  },
  reducers: {
    //actions => action handlers
    bugsRequestFailed: (bugs, action) => {
      bugs.loading = false;
    },

    bugsRequested: (bugs, action) => {
      bugs.loading = true;
    },  
     
    //bugs/bugsReceived
    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },

    bugAdded: (bugs, action) => {
      bugs.list.push(action.payload);
    },

    bugResolvedError: (bug, action) => {
      console.log(`error resolving bug with ${action.payload.id}`);
    },

    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex(bug => bug.id === action.payload.id);
      bugs.list[index].resolved = true;
    },
    bugRemoved: (bugs, action) => {
      bugs = bugs.list.filter(bug => bug.id !== action.payload.id);
    }
  }
});

const { bugAdded, bugResolved, bugRemoved, bugsReceived, bugsRequested, bugsRequestFailed, bugResolvedError } = slice.actions;
export default slice.reducer;

//Action creators
const url = "/bugs";

export const resolveBug = (bugId) => 
  apiCallBegan({
    url: `${url}/${bugId}`,
    method: 'patch',
    data:  { resolved: true },
    onStart: null,
    onSuccess: bugResolved.type,
    onError: bugResolvedError.type
  });

export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs;

  //returns the difference in minutes
  if (lastFetch){
    const diffInMinutes = moment().diff(moment(lastfetch), 'minutes');
    if (diffInMinutes < 10)
      return;
  }

  return dispatch(apiCallBegan({
    url,
    method: 'get',
    onStart: bugsRequested.type,
    onSuccess: bugsReceived.type,
    onError: bugsRequestFailed.type
  }));
};

export const addBug = bug => apiCallBegan({
  url,
  method: 'post',
  data: bug,
  onSuccess: bugAdded.type,
});

//Action selectors

export const getUnresolvedBugs = createSelector(
  state => state.entities.bugs,
  state => state.entities.projects,
  (bugs, projects) => bugs.list.filter(bug => !bugs.list.resolved)
);
