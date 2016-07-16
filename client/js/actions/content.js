import wrapper    from "../constants/wrapper";
import Network    from '../constants/network';

// Local actions
const actions = [
  "RESET",
];

// Actions that make an api request
const requests = [
  'LOAD_CONTENT'
];

export const Constants = wrapper(actions, requests);

export const resetValue = (key) => ({
  type: Constants.RESET,
  key
});

export const loadContent = (name) => ({
  type: Constants.LOAD_CONTENT,
  epubMethod: Network.GET,
  name
});