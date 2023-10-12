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
        ...state,
        membershipPlan: action.loggedInUserInfo
      };
    case REMOVE_MEMBERSHIP_PLAN:
      return {
        ...state,
        membershipPlan: action.loggedInUserInfo
      };
    case ADD_RESOURCES:
      return {
        ...state,
        resources: action.loggedInUserInfo
      };
    case REMOVE_RESOURCES:
      return {
        ...state,
        resources: action.loggedInUserInfo
      };
    case ADD_PACKAGES_AND_SERVICES:
      return {
        ...state,
        packagesAndServices: action.loggedInUserInfo
      };
    case REMOVE_PACKAGES_AND_SERVICES:
      return {
        ...state,
        packagesAndServices: action.loggedInUserInfo
      };
    default:
  }
  return state
}

export default shoppingCart;