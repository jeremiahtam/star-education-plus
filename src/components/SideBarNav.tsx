import { Link, useLocation, useNavigate } from "react-router-dom";
import { SiGooglechat } from "react-icons/si";
import { BsBroadcastPin } from 'react-icons/bs'
import { ImStack } from 'react-icons/im'
import { FaGlobe, FaFileUpload, FaFileInvoice } from 'react-icons/fa'
import { RiLogoutBoxLine } from 'react-icons/ri'
import { BiSolidDashboard, BiSolidPackage } from 'react-icons/bi'
import { MdSchool, MdCardMembership } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { navToggleClassStateType } from '../../types/type-definitions'
import { Image } from 'react-bootstrap';
import SEPLogo from '../images/SEP-Logo-White-Final.png'
import SEPlogo129 from '../images/logo192.png'
import axios from 'axios'
import { store } from '../store/root-reducer';
import { deleteUserData } from '../store/actions/user-info';
import { stateLoggedInUserType } from '../../types/type-definitions';

const SideBarNav = (props: any) => {
  const navigate = useNavigate()
  const { pathname } = useLocation();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const navToggleClass = useSelector((state: navToggleClassStateType) => state.navToggle.navbarClass)
  const sidebarHide = useSelector((state: navToggleClassStateType) => state.navToggle.sidebarHide)

  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/admin-logout`,
        {},
        {
          headers: {
            "Accept": "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
        }
      );

      const resData = res.data;
      console.log(resData);
      if (resData.success == false) {
        if (resData.errors !== undefined) {
        } else {
        }
      } else {
        store.dispatch(deleteUserData());
        navigate('/admin-login')
      }
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {

      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        // setErrors(errorData.errors);
      }
    }
  }
  const splitLocation = pathname.split("/");

  return (
    <nav id={"sidebar"} className={navToggleClass}>
      <div className="sidebar-header">
        <Image src={sidebarHide == false ? SEPLogo : SEPlogo129} height={35} />
      </div>
      <ul className="list-unstyled components">
        <li className={splitLocation[1] == 'dashboard' ? 'active' : ''}>
          <Link to='/dashboard'>
            <BiSolidDashboard className="icon" />
            <div hidden={sidebarHide}> Dashboard</div>
          </Link>
        </li>
        <li className={splitLocation[1] == 'broadcasts' ? 'active' : ''}>
          <Link to="/broadcasts">
            <BsBroadcastPin className="icon" />
            <div hidden={sidebarHide}> Broadcasts</div>
          </Link>
        </li>
        <li className={splitLocation[1] == 'membership-plans' ? 'active' : ''}>
          <Link to="/membership-plans">
            <MdCardMembership className="icon" />
            <div hidden={sidebarHide}> Membership Plans</div>
          </Link>
        </li>
        <li className={splitLocation[1] == 'schools' ? 'active' : ''}>
          <Link to="/schools">
            <MdSchool className="icon" />
            <div hidden={sidebarHide}> Schools</div>
          </Link>
        </li>
        <li className={splitLocation[1] == 'packages-and-services' ? 'active' : ''}>
          <Link to="/packages-and-services">
            <BiSolidPackage className="icon" />
            <div hidden={sidebarHide}> Packages & Services</div>
          </Link>
        </li>
        <li className={splitLocation[1] == 'resources' ? 'active' : ''}>
          <Link to="/resources" >
            <ImStack className="icon" />
            <div hidden={sidebarHide}> Resources</div>
          </Link>
        </li>
        <li className={splitLocation[1] == 'document-upload' ? 'active' : ''}>
          <Link to="/document-upload">
            <FaFileUpload className="icon" />
            <div hidden={sidebarHide}> Document Upload</div>
          </Link>
        </li>
        <li className={splitLocation[1] == 'invoices' ? 'active' : ''}>
          <Link to="/invoices">
            <FaFileInvoice className="icon" />
            <div hidden={sidebarHide}> Invoices</div></Link>
        </li>
        <li className={splitLocation[1] == 'messages' ? 'active' : ''}>
          <Link to="/messages">
            <SiGooglechat className="icon" />
            <div hidden={sidebarHide}> Messages</div>
          </Link>
        </li>
      </ul>
      <ul className="list-unstyled CTAs">
        <li>
          <Link to="#" className="logout" onClick={() => logoutHandler()}>
            <RiLogoutBoxLine className="icon" />
            <div hidden={sidebarHide}> Logout</div>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
export default SideBarNav