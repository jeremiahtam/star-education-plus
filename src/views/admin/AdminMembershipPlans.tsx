import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import BodyWrapper from '../../components/BodyWrapper'
import { IoMdSearch, IoMdCreate, IoIosAdd } from "react-icons/io";
import { Button, Form, Row, Col, InputGroup, Alert, Breadcrumb } from 'react-bootstrap';
import CustomModal from '../../components/MembershipPlanModal';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import CustomPagination from '../../components/CustomPagination';
import { MdOutlineClear } from 'react-icons/md';
import { HiTrash } from 'react-icons/hi';
import { deleteUserData } from '../../store/actions/user-info';
import { store } from '../../store/root-reducer';
import { useNavigate } from 'react-router';

function AdminMembershipPlans(props: any) {
  const pounds = Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });
  const navigate = useNavigate()
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  //Modal COntrol
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [modalType, setModalType] = useState<string | null>(null);
  const [modalDataId, setModalDataId] = useState<number | null>(null) /* modal dataId */

  const modalDataHandler = useCallback((_dataId: number, _modalType: string) => {
    handleShow()
    setModalDataId(_dataId)
    setModalType(_modalType)
    console.log(`${_dataId} ${_modalType}`)
  }, [setModalType, setModalDataId])

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
      rightHandSide={membershipPlans?.data && <button className='btn btn-custom btn-sm'
        onClick={() => {
          setModalType('add-membership-plan')
          handleShow()
        }}>Create New <IoIosAdd className='btn-icon' /></button>}>

      {/* <Breadcrumb>
        <Breadcrumb.Item onClick={() => { 
          // navigate('/membership-plans') 
          }}>
          Membership Plans
        </Breadcrumb.Item>
      </Breadcrumb> */}

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
          <div className="table-responsive">
            <table className='table table-hover table-sm'>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Content</th>
                  <th>Amount</th>
                  <th>Discount Amount</th>
                  <th>Discount Frequency</th>
                  <th>Duration (Days)</th>
                  <th>Status</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {membershipPlans.data.map((item: any, index: number) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.sn}</td>
                      <td>{item.name}</td>
                      <td><div>{item.membershipPlanContent}</div></td>
                      <td>{pounds.format(item.amount)}</td>
                      <td>{pounds.format(item.discountAmount)}</td>
                      <td>{item.discountFrequency}</td>
                      <td>{item.duration == null ? '-' : item.duration}</td>
                      <td>{item.status}</td>
                      <td ><IoMdCreate onClick={() => {
                        modalDataHandler(item.id, 'edit-membership-plan')
                      }} /></td>
                      <td><HiTrash onClick={() => {
                        modalDataHandler(item.id, 'delete-membership-plan')
                      }} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>}

        {membershipPlans.data.length == 0 &&
          <Alert className='form-feedback-message' variant={"info"} dismissible>
            <div>{membershipPlans?.message}</div>
          </Alert>}

        {membershipPlans.data.length !== 0 &&
          <CustomPagination page={page} setPage={setPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />}
        {modalType && <CustomModal show={show} handleClose={handleClose} handleShow={handleShow}
          modalType={modalType} modalDataId={modalDataId} loadMembershipPlan={getMembershipPlansHandler} />}
      </>}
    </BodyWrapper>
  )
}

export default AdminMembershipPlans
