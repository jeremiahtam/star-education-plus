import { LOAD_USER_DATA, ADD_USER_DATA, DELETE_USER_DATA, UPDATE_PROFILE_PIC } from "../actions/user-info";

const initialState = {
  loggedInUserData: { undefined },//contains {'userType':'','token':'','email':'','userId':''}
}

const userInfoReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case LOAD_USER_DATA:
      return {
        ...state,
        loggedInUserData: action.loggedInUserInfo
      };
    case ADD_USER_DATA:
      return {
        ...state,
        loggedInUserData: action.loggedInUserInfo
      };
    case DELETE_USER_DATA:
      return {
        ...state,
        loggedInUserData: action.loggedInUserInfo
      };
    case UPDATE_PROFILE_PIC:
      return {
        ...state,
        loggedInUserData: {
          ...state.loggedInUserData,
          userProfilePic: action.profilePicInfo
        }
      };
    default:
  }
  return state
}

export default userInfoReducer;