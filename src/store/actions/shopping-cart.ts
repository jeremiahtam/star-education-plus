import { Dispatch } from 'redux'

export const ADD_MEMBERSHIP_PLAN = 'ADD_MEMBERSHIP_PLAN'
export const REMOVE_MEMBERSHIP_PLAN = 'REMOVE_MEMBERSHIP_PLAN'
export const ADD_RESOURCES = 'ADD_RESOURCES'
export const REMOVE_RESOURCES = 'REMOVE_RESOURCES'
export const ADD_PACKAGES_AND_SERVICES = 'ADD_PACKAGES_AND_SERVICES'
export const REMOVE_PACKAGES_AND_SERVICES = 'REMOVE_PACKAGES_AND_SERVICES'
export const EMPTY_CART = 'EMPTY_CART'

export const addMembershipPlan = (membershipPlanInfo: any) => {
  return async (dispatch: Dispatch, getState: any) => {
    console.log(membershipPlanInfo)
    dispatch({
      type: ADD_MEMBERSHIP_PLAN,
      membershipPlanData: membershipPlanInfo
    })
  }
}

export const removeMembershipPlan = (membershipPlanInfo: any) => {
  return async (dispatch: Dispatch, getState: any) => {
    dispatch({
      type: REMOVE_MEMBERSHIP_PLAN,
      membershipPlanData: membershipPlanInfo
    })
  }
}

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
export const emptyCart = () => {
  return async (dispatch: Dispatch, getState: any) => {
    dispatch({
      type: EMPTY_CART,
    })
  }
}