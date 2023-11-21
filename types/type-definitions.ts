//get nav Toggle Class State Type
export interface navToggleClassStateType {
  navToggle: {
    navbarClass: '',
    sidebarHide: boolean
  }
}

// logged in user data type
export interface stateLoggedInUserType {
  userInfo: {
    loggedInUserData: {
      token: string,
      phoneNumber: string,
      email: string,
      userId: number,
      userType: string,
      userFullname: string,
      userProfilePic: string,
      userAddress: string,
      schoolName: string,
      schoolStatus: string,
      schoolImprovementPartner: string,
      consultantAppointed: string,
      consultantContact: string,
      webinarsAttended: number,
      workshopsAttended: number,
      masterclassesAttended: number,
      planExpired: boolean,
      planExpiryDate: string,
      planExpiryTime: string,
    };
  };
}

// cart type definition
export interface stateCart {
  cart: {
    resources: Array<object>,
    membershipPlans: Array<object>,
    packagesAndServices: Array<object>,
  };
}
