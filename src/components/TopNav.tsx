import React, { useCallback } from 'react';
import { IoIosMenu } from "react-icons/io";
import { useDispatch } from 'react-redux'
import { toggleNav } from '../store/actions/nav'

const TopNav = (props: any) => {
  const dispatch = useDispatch();
  const toggleNavBar = useCallback(() => {
    dispatch(toggleNav())
  }, [dispatch])
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <button type="button" id="sidebarCollapse" className="btn btn-light"
          onClick={toggleNavBar}
        >
          <IoIosMenu />
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default TopNav;