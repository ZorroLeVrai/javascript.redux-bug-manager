import configure from './store/configureStore';
import { loadBugs, addBug, resolveBug } from './store/bugs';
import { projectAdded } from './store/projects';
import { bugAdded, bugResolved, bugRemoved, getUnresolvedBugs } from './store/bugs';
import { userAdded, userRemoved, bugsAssignedToUSer, getBugsAssigned, assignBugToUser, addUser } from './store/users';

const store = configure();

//UI layer
const interval = 2000;
store.dispatch(loadBugs());
const actions = new Promise((resolve) => setTimeout(() => {store.dispatch(resolveBug(2)); resolve();}, interval));
actions
  .then(() => new Promise((resolve) => setTimeout(() => {store.dispatch(addUser("Adam")); resolve();}, interval)))
  .then(() => new Promise((resolve) => setTimeout(() => {store.dispatch(assignBugToUser(1, [2,3])); resolve();}, interval)))
  .catch(error => console.log('error', error.message));

//store.dispatch(addBug({description: "a"}));


// store.dispatch((dispatch, getState) => {
//   //Call an API
//   //When the promise is resolved => dispatch()
//   dispatch({ type: 'bugsReceived', bugs: [1,2,3]});
//   console.log(getState());
// });

// store.dispatch(projectAdded({ name: "Janvier"}));
// store.dispatch(projectAdded({ name: "Fevrier"}));
// store.dispatch(projectAdded({ name: "Mars"}));

// store.dispatch(bugAdded({ description: "Bug 1"}));
// store.dispatch(bugAdded({ description: "Bug 2"}));
// store.dispatch(bugAdded({ description: "Bug 3"}));
// store.dispatch(bugResolved({id: 1}));

// store.dispatch(userAdded({ name: "Adam" }));
// store.dispatch(userAdded({ name: "Lise" }));
// store.dispatch(bugsAssigned({ userId:1, bugs:[1]}));
// store.dispatch(bugsAssigned({ userId:1, bugs:[2,3]}));