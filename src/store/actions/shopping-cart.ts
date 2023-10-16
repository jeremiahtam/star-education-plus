import axios from 'axios'
import { Dispatch } from 'redux'

export const ADD_MEMBERSHIP_PLAN = 'ADD_MEMBERSHIP_PLAN'
export const REMOVE_MEMBERSHIP_PLAN = 'REMOVE_MEMBERSHIP_PLAN'
export const ADD_RESOURCES = 'ADD_RESOURCES'
export const REMOVE_RESOURCES = 'REMOVE_RESOURCES'
export const ADD_PACKAGES_AND_SERVICES = 'ADD_PACKAGES_AND_SERVICES'
export const REMOVE_PACKAGES_AND_SERVICES = 'REMOVE_PACKAGES_AND_SERVICES'

export const addResource = (resourceInfo: any) => {
  return async (dispatch: Dispatch, getState: any) => {
    console.log(resourceInfo)
    dispatch({
      type: ADD_RESOURCES,
      resourceData: resourceInfo
    })
  }
}

export const removeResource = (resourceInfo: any) => {
  return async (dispatch: Dispatch, getState: any) => {
    dispatch({
      type: REMOVE_RESOURCES,
      resourceData: resourceInfo
    })
  }
}
export const addPackagesAndServices = (packagesAndServicesInfo: any) => {
  return async (dispatch: Dispatch, getState: any) => {
    console.log(packagesAndServicesInfo)
    dispatch({
      type: ADD_PACKAGES_AND_SERVICES,
      packagesAndServicesData: packagesAndServicesInfo
    })
  }
}

export const removePackagesAndServices = (packagesAndServicesInfo: any) => {
  return async (dispatch: Dispatch, getState: any) => {
    dispatch({
      type: REMOVE_PACKAGES_AND_SERVICES,
      packagesAndServicesData: packagesAndServicesInfo
    })
  }
}