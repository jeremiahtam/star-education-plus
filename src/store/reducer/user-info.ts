import { LOAD_USER_DATA, ADD_USER_DATA, DELETE_USER_DATA } from "../actions/user-info";

const initialState = {
  loggedInUserData: undefined,//contains {'userType':'','token':'','email':'','userId':''}
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
    // case REMOVE_USER_DATA:
    //   //remove from the state
    //   const eduList = state.educationData.data.filter(userEduList=>
    //     userEduList.id !== action.eduId
    //   )
    //   const newData = {...state.educationData,'data':eduList};
    //   return({
    //     ...state,
    //     educationData: newData
    //   })

    default:
  }
  return state
}

export default userInfoReducer;