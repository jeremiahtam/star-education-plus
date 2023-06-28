import { TOGGLE_NAV } from "../actions/nav";

const initialState = {
  navbarClass:'',
  sidebarHide:false
}

const navReducer =(state = initialState, action: any) =>{
  switch (action.type){
    case TOGGLE_NAV:
      switch(state.sidebarHide){
        case true:
          return {
            ...state,
            navbarClass:'',
            sidebarHide:false
            }

        case false:
          return {
            ...state,
            navbarClass:'active',
            sidebarHide:true
          }
        default:
      }  
    break;
    default:
      return state;
  }
 
  return state
}

export default navReducer;