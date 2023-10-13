import React, { useCallback } from 'react';
import { IoIosMenu } from "react-icons/io";
import { useDispatch } from 'react-redux'
import { toggleNav } from '../store/actions/nav'
import { NavDropdown, Image, Col, Row, Badge } from 'react-bootstrap';
import SEPlogo129 from '../images/logo192.png'
import { stateCart, stateLoggedInUserType } from '../../types/type-definitions';
import personIcon from '../images/person-icon.png'
import { useSelector } from 'react-redux'
import { PiShoppingCartThin } from 'react-icons/pi';
import { Link } from 'react-router-dom';

const TopNav = (props: any) => {
  const backEndImageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  //cart items
  const cartResources = useSelector((state: stateCart) => state.cart.resources)
  const cartPackagesAndServices = useSelector((state: stateCart) => state.cart.packagesAndServices)
  const cartMembershipPlans = useSelector((state: stateCart) => state.cart.membershipPlan)


  const dispatch = useDispatch();
  const toggleNavBar = useCallback(() => {
    dispatch(toggleNav())
  }, [dispatch])
  return (
    <nav className="navbar navbar-expand-lg" id='top-nav'>
      <div className="container-fluid">
        <button type="button" id="sidebarCollapse" className="btn btn-light"
          onClick={toggleNavBar}
        >
          <IoIosMenu />
          <span></span>
        </button>
        <div className='right-top-nav'>
          {userInfoData.userType == 'school' &&
            <div className='cart-box'>
              <Link to={'/checkout'}>
                <PiShoppingCartThin className='cart-icon' size={30} />
                {cartResources.length + cartMembershipPlans.length + cartPackagesAndServices.length > 0 &&
                  <Badge bg="danger" className='cart-badge' pill>
                    {cartResources.length + cartMembershipPlans.length + cartPackagesAndServices.length}
                  </Badge>}
              </Link>
            </div>}
          <NavDropdown
            title={
              <div id="top-nav-dropdown">
                <div className='image-box'>
                  <Image
                    src={userInfoData.userProfilePic == null || "" ?
                      personIcon : `${backEndImageBaseUrl}/${userInfoData.userProfilePic}`}
                  />
                </div>
              </div>
            }
          >
            <NavDropdown.Item href="/profile"> Profile</NavDropdown.Item>
            <NavDropdown.Item href="/resources"> Resources</NavDropdown.Item>
          </NavDropdown>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;