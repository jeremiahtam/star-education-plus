import { useEffect, useState } from 'react'
import BodyWrapper from '../../components/BodyWrapper'
import { Alert, Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import { deleteUserData } from '../../store/actions/user-info';
import { store } from '../../store/root-reducer';
import CustomPagination from '../../components/CustomPagination';
import { useNavigate } from 'react-router';

function SchoolMembershipPlansHistory(props: any) {
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate()

  const [membershipPlansHistory, setMembershipPlansHistory] = useState<any>()

  // Pagination control
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10)
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
      const res = await axios.get(`${baseUrl}/api/school-membership-plans-history`, {
        params: {
          search,
          itemsPerPage: itemsPerPage,
          page: page,
          schoolId: userInfoData.userId,
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
        return setMembershipPlansHistory(resData)
      } else {
        setMembershipPlansHistory(resData)
        setTotalPages(resData.pageInfo.totalPages)
      }
    } catch (e: any) {
      console.log(e)
      if (e.code == "ECONNABORTED") {
        return setMembershipPlansHistory({
          "success": false,
          "message": "Request timed out.",
        })
      } else
        if (e?.response?.data !== undefined) {
          const errorData = e.response.data;
          if (errorData.message == "Unauthenticated.") {
            store.dispatch(deleteUserData());
          }
          return setMembershipPlansHistory({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        } else {
          const errorData = e.response.data;
          if (errorData.message == "Unauthenticated.") {
            store.dispatch(deleteUserData());
          }
          return setMembershipPlansHistory({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        }
    }
  }

  return (
    <BodyWrapper title='Membership Plan History'>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => {
          navigate('/membership-plans')
        }}>
          Membership Plans
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => {
        }}>
          Membership Plan History
        </Breadcrumb.Item>
      </Breadcrumb>
      {membershipPlansHistory?.success === false && !membershipPlansHistory?.data &&
        <Alert className='form-feedback-message' variant={"danger"} dismissible>
          <div>{membershipPlansHistory?.message}</div>
        </Alert>}

      {membershipPlansHistory?.data && <>
        {/* <div className='search-area mb-3'>
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
        </div> */}

        {membershipPlansHistory.data.length !== 0 &&
          <div className="table-responsive">
            <table className='table table-hover table-sm'>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Plan Name</th>
                  <th>Start Date</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {membershipPlansHistory.data.map((item: any, index: number) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.sn}</td>
                      <td>{item.membershipPlanName}</td>
                      <td>{item.startDate}</td>
                      <td>{item.expiryDate}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>}

        {membershipPlansHistory.data.length == 0 &&
          <Alert className='form-feedback-message' variant={"info"} dismissible>
            <div>{membershipPlansHistory?.message}</div>
          </Alert>}

        {membershipPlansHistory.data.length !== 0 &&
          <CustomPagination page={page} setPage={setPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />}

      </>}
    </BodyWrapper>
  )
}

export default SchoolMembershipPlansHistory
