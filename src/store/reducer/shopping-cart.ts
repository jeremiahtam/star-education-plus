import {
  ADD_MEMBERSHIP_PLAN, REMOVE_MEMBERSHIP_PLAN,
  ADD_RESOURCES, REMOVE_RESOURCES, ADD_PACKAGES_AND_SERVICES, REMOVE_PACKAGES_AND_SERVICES
} from "../actions/shopping-cart";

const initialState = {
  membershipPlan: [],
  resources: [],
  packagesAndServices: [],
}

const shoppingCart = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_MEMBERSHIP_PLAN:
      return {
        // ...state,
        // membershipPlan: action.loggedInUserInfo
      };
    case REMOVE_MEMBERSHIP_PLAN:
      return {
        // ...state,
        // membershipPlan: action.loggedInUserInfo
      };

    case ADD_RESOURCES:
      return {
        ...state,
        resources: [
          ...state.resources,
          action.resourceData
        ]
      };

    case REMOVE_RESOURCES:
      let newResourceArr = state.resources.filter((item: any) => item.id !== action.resourceData.id)
      return {
        ...state,
        resources: newResourceArr
      };

    case ADD_PACKAGES_AND_SERVICES:
      return {
        ...state,
        packagesAndServices: [
          ...state.packagesAndServices,
          action.packagesAndServicesData
        ]
      };

    case REMOVE_PACKAGES_AND_SERVICES:
      let newArr = state.packagesAndServices.filter((item: any) => {
        return item.id !== action.packagesAndServicesData.id
      })

      return {
        ...state,
        packagesAndServices: newArr
      };

    default:
  }
  return state
}

export default shoppingCart;