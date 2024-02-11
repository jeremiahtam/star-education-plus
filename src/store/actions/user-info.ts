import axios from 'axios'
import { Dispatch } from 'redux'

export const LOAD_USER_DATA = 'LOAD_USER_DATA'
export const ADD_USER_DATA = 'ADD_USER_DATA'
export const DELETE_USER_DATA = 'DELETE_USER_DATA'
export const UPDATE_PROFILE_PIC = 'UPDATE_PROFILE_PIC'

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const loadUserData = () => {
  return async (dispatch: Dispatch, getState: any) => {
    try {
      const storedUserData = localStorage.getItem('__t')
      // const info = storedUserData != null ? JSON.parse(storedUserData) : null;
      const token = storedUserData != null ? storedUserData : null;

      const res = await axios.get(`${baseUrl}/api/user-info`,
        {
          params: {
            token: token
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        });
      // console.log(res);
      const resData = res.data
      dispatch({
        type: LOAD_USER_DATA,
        loggedInUserInfo: resData
      })

    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        if (errorData.message === "Unauthenticated.") {
          dispatch({
            type: LOAD_USER_DATA,
            loggedInUserInfo: null
          })
        }
        dispatch({
          type: LOAD_USER_DATA,
          loggedInUserInfo: null
        })

      }
    }
  }
}

export const insertUserData = (data: any) => {
  return async (dispatch: Dispatch, getState: any) => {
    try {
      const jsonValue = data// JSON.stringify(data)
      localStorage.setItem('__t', jsonValue)
      dispatch({
        type: LOAD_USER_DATA,
        loggedInUserInfo: JSON.parse(jsonValue)
      })
    } catch (e: any) {
      console.log(e.response)
    }
  }
}
export const deleteUserData = () => {

  return async (dispatch: Dispatch, getState: any) => {
    try {
      localStorage.removeItem('__t')
      dispatch({
        type: DELETE_USER_DATA,
        loggedInUserInfo: null
      })
    } catch (e: any) {
      console.log(e.response)
      return e;
    }
  }
}

export const updateProfilePic = (data: any) => {
  return async (dispatch: Dispatch, getState: any) => {
    try {
      dispatch({
        type: UPDATE_PROFILE_PIC,
        profilePicInfo: data
      })
    } catch (e: any) {
      console.log(e.response)
    }
  }
}