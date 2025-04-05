import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  id: null,
  token: null,
  isAuthenticated: false,
  apiUrl:'http://localhost:3005',
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'clear_credentials':
      return { ...state, id: null, token: null, isAuthenticated: false }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
