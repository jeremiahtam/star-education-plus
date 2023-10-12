import axios from 'axios'
import { Dispatch } from 'redux'

export const ADD_MEMBERSHIP_PLAN = 'ADD_MEMBERSHIP_PLAN'
export const REMOVE_MEMBERSHIP_PLAN = 'REMOVE_MEMBERSHIP_PLAN'
export const ADD_RESOURCES = 'ADD_RESOURCES'
export const REMOVE_RESOURCES = 'REMOVE_RESOURCES'
export const ADD_PACKAGES_AND_SERVICES = 'ADD_PACKAGES_AND_SERVICES'
export const REMOVE_PACKAGES_AND_SERVICES = 'REMOVE_PACKAGES_AND_SERVICES'

// export const addMembershipPlan = () => {
//   return async (dispatch: Dispatch, getState: any) => {
//       dispatch({
//         type: ADD_MEMBERSHIP_PLAN,
//         loggedInUserInfo: info
//       })
//   }
// }

// export const insertUserData = (data: any) => {
//   return async (dispatch: Dispatch, getState: any) => {
//     try {
//       const jsonValue = JSON.stringify(data)
//       localStorage.setItem('userInfo', jsonValue)
//       dispatch({
//         type: LOAD_USER_DATA,
//         loggedInUserInfo: JSON.parse(jsonValue)
//       })
//     } catch (e: any) {
//       console.log(e.response)
//     }
//   }
// }
// export const deleteUserData = () => {

//   return async (dispatch: Dispatch, getState: any) => {
//     try {
//       localStorage.removeItem('userInfo')
//       dispatch({
//         type: DELETE_USER_DATA,
//         loggedInUserInfo: null
//       })
//     } catch (e: any) {
//       console.log(e.response)
//       return e;
//     }
//   }
// }