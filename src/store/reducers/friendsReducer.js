import * as actions from '../actions/actionTypes'

const initialState = {
  loading: false,
  error: null,
  // searchResults: [],
  selected: {},
  friends: [],
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.FRIENDS_LOADING:
      return { ...state, loading: true }
    case actions.FRIENDS_ENDLOADING:
      return { ...state, loading: false }
    case actions.FRIENDS_ERROR:
      return { ...state, error: payload, loading: false }
    case actions.FRIENDS_LIST:
      return {
        ...state,
        friends: [...payload],
        error: null,
        loading: false,
      }
    case actions.FRIENDS_ADD:
      return {
        ...state,
        friends: [...state.friends, payload],
        // searchResults: state.searchResults.filter(
        //   result => result.email !== payload.email
        // ),
        error: null,
      }
    case actions.FRIENDS_REMOVE:
      return {
        ...state,
        friends: state.friends.filter(friend=>friend.email!==payload)
      }
    // case actions.FRIENDS_SEARCH:
    //   return {
    //     ...state,
    //     searchResults: payload,
    //     error: null,
    //   }
    case actions.FRIENDS_SELECT:
      return { ...state, selected: payload, error: null }
    default:
      return state
  }
}
