import ReduxThunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from "redux";
import userInfoReducer from "./reducer/user-info";
import navReducer from "./reducer/nav";

//setup redux
const appReducer = combineReducers({
    userInfo: userInfoReducer,
    navToggle: navReducer
})

export const rootReducer = (state: any, action: any) => {
    // Clear all data in redux store to initial.
    switch (action.type) {
        // case DELETE_USER_DATA:
        //     // console.log(state)
        //     state = undefined;
        default:
            return appReducer(state, action)
    }
};
export const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
