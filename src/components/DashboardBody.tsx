import TopNav from "./TopNav"
import SideBarNav from "./SideBarNav"

const DashboardBody = (props: any) => {
  // const navToggleClass = useSelector(state: any => state.navToggle.navbarClass)
  const navToggleClass = ''
  return (
    <div className={"wrapper"}>
      <SideBarNav />
      <div id="content" className={navToggleClass}>
        <TopNav />
        {props.children}
      </div>
    </div>
  );
};

export default DashboardBody;