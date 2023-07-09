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
      userId: number,
      userType: string
    };
  };
}
