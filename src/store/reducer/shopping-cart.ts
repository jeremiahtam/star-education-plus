import {
  ADD_MEMBERSHIP_PLAN, REMOVE_MEMBERSHIP_PLAN,
  ADD_RESOURCES, REMOVE_RESOURCES, ADD_PACKAGES_AND_SERVICES,
  REMOVE_PACKAGES_AND_SERVICES, EMPTY_CART
} from "../actions/shopping-cart";

const initialState = {
  membershipPlans: [],
  resources: [],
  packagesAndServices: [],
}

const shoppingCart = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_MEMBERSHIP_PLAN:
      return {
        ...state,
        membershipPlans: [
          ...state.membershipPlans,
          action.membershipPlanData
        ]
      };

    case REMOVE_MEMBERSHIP_PLAN:
      let newMembershipPlansArr = state.membershipPlans.filter((item: any) => {
        return item.id !== action.membershipPlanData.id
      })
      return {
        ...state,
        membershipPlans: newMembershipPlansArr
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

    case EMPTY_CART:
      return initialState
    default:
  }
  return state
}

export default shoppingCart;