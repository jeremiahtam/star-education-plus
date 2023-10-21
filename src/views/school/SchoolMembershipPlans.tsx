import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import BodyWrapper from '../../components/BodyWrapper'
import { IoMdSearch, IoMdCreate, IoIosAdd } from "react-icons/io";
import { Button, Form, Row, Col, InputGroup, Alert, Card } from 'react-bootstrap';
import CustomModal from '../../components/MembershipPlanModal';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateCart, stateLoggedInUserType } from '../../../types/type-definitions';
import CustomPagination from '../../components/CustomPagination';
import { MdOutlineClear } from 'react-icons/md';
import { HiTrash } from 'react-icons/hi';
import { FaOpencart } from 'react-icons/fa'
import { GoHistory } from 'react-icons/go'
import { deleteUserData } from '../../store/actions/user-info';
import { store } from '../../store/root-reducer';
import { Link } from 'react-router-dom';
import { BiPackage } from 'react-icons/bi';
import { addMembershipPlan } from '../../store/actions/shopping-cart';
import ToastComponent from '../../components/ToastComponent';

function SchoolMembershipPlans() {
  const pounds = Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });

  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  //Membership Plans available in cart
  const cartMembershipPlans = useSelector((state: stateCart) => state.cart.membershipPlans)

  //Modal COntrol
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [modalType, setModalType] = useState<string | null>(null);
  const [modalDataContent, setModalDataContent] = useState<number | null>(null) /* modal dataId */

  const modalDataHandler = useCallback((_dataContent: number, _modalType: string) => {
    handleShow()
    setModalDataContent(_dataContent)
    setModalType(_modalType)
    console.log(`${_dataContent} ${_modalType}`)
  }, [setModalType, setModalDataContent])

  //Toast information
  const [showToast, setShowToast] = useState(false);
  const [membershipPlans, setMembershipPlans] = useState<any>()

  // Pagination control
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(2)
  const [totalPages, setTotalPages] = useState<number | null>(null)
  // Search 
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    if (search === '') {
      getMembershipPlansHandler()
    }
  }, [search])

  useEffect(() => {
    getMembershipPlansHandler()
  }, [userInfoData, page, itemsPerPage])

  const getMembershipPlansHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/all-membership-plans`, {
        params: {
          search,
          itemsPerPage: itemsPerPage,
          page: page
        },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${userInfoData.token}`,
        },
        timeout: 30000,
      });
      const resData = res.data;
      console.log(resData)
      if (resData.success == false) {
        return setMembershipPlans(resData)
      } else {
        setMembershipPlans(resData)
        setTotalPages(resData.pageInfo.totalPages)
      }
    } catch (e: any) {
      console.log(e)
      if (e.code == "ECONNABORTED") {
        return setMembershipPlans({
          "success": false,
          "message": "Request timed out.",
        })
      } else
        if (e?.response?.data !== undefined) {
          const errorData = e.response.data;
          if (errorData.message == "Unauthenticated.") {
            store.dispatch(deleteUserData());
          }
          return setMembershipPlans({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        } else {
          const errorData = e.response.data;
          if (errorData.message == "Unauthenticated.") {
            store.dispatch(deleteUserData());
          }
          return setMembershipPlans({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        }
    }
  }

  return (
    <BodyWrapper title='Membership Plans'
      rightHandSide={
        <Link to={'/membership-plans-history'}>
          <GoHistory size={23} />
        </Link>
      }>
      {membershipPlans?.success === false && !membershipPlans?.data &&
        <Alert className='form-feedback-message' variant={"danger"} dismissible>
          <div>{membershipPlans?.message}</div>
        </Alert>}
      {membershipPlans?.data && <>
        <div className='search-area mb-3'>
          <Form>
            <Row className="justify-content-end">
              <Col md={4} sm={10} className="my-1 search-bar">
                <Form.Label htmlFor="search" visuallyHidden>
                  Search
                </Form.Label>
                <InputGroup className=''>
                  <InputGroup.Text><IoMdSearch size={24} /></InputGroup.Text>
                  <Form.Control id="search" placeholder="Search"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setSearch(e.target.value)
                    }} value={search} />
                  {search !== '' &&
                    <InputGroup.Text onClick={(e: any) => {
                      e.preventDefault()
                      setPage(1)
                      setSearch('')
                    }} className='cancel-button' >
                      <MdOutlineClear size={24} />
                    </InputGroup.Text>}
                  <Button type="submit" onClick={(e: any) => {
                    e.preventDefault()
                    setPage(1)
                    getMembershipPlansHandler()
                  }} hidden>Search</Button>
                </InputGroup>
              </Col>
            </Row>
          </Form>
        </div>

        {membershipPlans.data.length !== 0 &&
          <Row className='card-items-row'>

            {membershipPlans.data.map((item: any, index: number) => {
              return (
                <Col lg={3} md={4} className='mb-3' key={index}>
                  <Card className='price-card'>
                    <Card.Body>
                      <Card.Subtitle className="mb-2 price-card-sub-title">
                        <BiPackage /> {item.name}
                      </Card.Subtitle>
                      <Card.Title className='price-card-title'>{pounds.format(item.amount)}</Card.Title>
                      {/* <Card.Text className='text-warning'>Text</Card.Text> */}
                      <div className='price-card-border mb-3 mt-3'></div>
                      <Card.Text className='price-card-text'>
                        {item.excerpt}
                        <Card.Link onClick={() => {
                          modalDataHandler(item, 'view-membership-plan')
                        }}> view more.</Card.Link>
                      </Card.Text>
                      <div className='price-card-border mb-3 mt-3'></div>
                      <Button className='btn-block mb-3 form-control btn-custom'
                        onClick={() => {
                          if (cartMembershipPlans.length > 0) {
                            setShowToast(true)
                          } else {
                            store.dispatch(addMembershipPlan(item))
                          }
                        }}
                      >
                        <FaOpencart /> Purchase
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>)
            })}
          </Row>}

        {membershipPlans.data.length == 0 &&
          <Alert className='form-feedback-message' variant={"info"} dismissible>
            <div>{membershipPlans?.message}</div>
          </Alert>}

        {membershipPlans.data.length !== 0 &&
          <CustomPagination page={page} setPage={setPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />}
        {modalType && <CustomModal show={show} handleClose={handleClose} handleShow={handleShow}
          modalType={modalType} modalDataContent={modalDataContent} />}

        <ToastComponent
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide={true}
          title='Oops!'
          body='You already added a membership plan.'
        />
      </>}

    </BodyWrapper>
  )
}

export default SchoolMembershipPlans