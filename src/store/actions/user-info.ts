import axios from 'axios'
import { Dispatch } from 'redux'

export const LOAD_USER_DATA = 'LOAD_USER_DATA'
export const ADD_USER_DATA = 'ADD_USER_DATA'
export const DELETE_USER_DATA = 'DELETE_USER_DATA'

export const loadUserData = () => {
  return async (dispatch: Dispatch, getState: any) => {
    try {
      const storedUserData = localStorage.getItem('userInfo')
      const info = storedUserData != null ? JSON.parse(storedUserData) : null;
      dispatch({
        type: LOAD_USER_DATA,
        loggedInUserInfo: info
      })
    } catch (e: any) {
      console.log(e.response)
    }
  }
}

export const insertUserData = (data: any) => {
  return async (dispatch: Dispatch, getState: any) => {
    try {
      const jsonValue = JSON.stringify(data)
      localStorage.setItem('userInfo', jsonValue)
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
      localStorage.removeItem('userInfo')
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