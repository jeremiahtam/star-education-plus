import { useState, useCallback, useEffect, ChangeEvent } from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import BodyWrapper from '../../components/BodyWrapper'
import { IoMdSearch, IoMdTrash, IoMdCreate, IoIosAdd } from "react-icons/io";
import { Button, Form, InputGroup, Row, Col, Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import CustomPagination from '../../components/CustomPagination';
import SchoolModal from '../../components/SchoolModal';
import { MdOutlineClear } from 'react-icons/md';
import { HiTrash } from 'react-icons/hi';

function AdminSchools(props: any) {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

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

  const [schools, setSchools] = useState<any[]>([])

  // Pagination control
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(2)
  const [totalPages, setTotalPages] = useState<number | null>(null)
  // Search 
  const [search, setSearch] = useState<string>('')
  useEffect(() => {
    if (search === '') {
      getSchoolsHandler()
    }
  }, [search])

  useEffect(() => {
    getSchoolsHandler()
  }, [userInfoData, page, itemsPerPage])

  const getSchoolsHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/all-schools`, {
        params: {
          search,
          items_per_page: itemsPerPage,
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
      if (resData.success == true) {
        setSchools(resData.data)
        setTotalPages(resData.pageInfo.totalPages)
      } else {

      }
    } catch (e: any) {
      console.log(e)
      // setShowLoadMoreSpinner(false)
      // setPageLoaded(true)
      if (e.code == "ECONNABORTED") {
        // showToast("default", "Timeout. Try again.");
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        if (errorData.message === "Unauthenticated") {
        }
      }
    }
  }

  return (
    <BodyWrapper title='Schools'
      rightHandSide={<button className='btn btn-custom btn-sm'
        onClick={() => {
          setModalType('add-school')
          handleShow()
        }}>Create New <IoIosAdd className='btn-icon' /> </button>}>
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
                  getSchoolsHandler()
                }} hidden>Search</Button>
              </InputGroup>
            </Col>
          </Row>
        </Form>
      </div>
      {schools.length !== 0 &&
        <div className="table-responsive">
          <table className='table table-hover table-sm'>
            <thead>
              <tr>
                <th>No.</th>
                <th>Full Name</th>
                <th>School Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Status</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {schools.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td>{item.sn}</td>
                    <td onClick={() => {
                      navigate(`/schools/${item.id}`)
                    }} >
                      {item.fullname}
                    </td>
                    <td>{item.schoolName}</td>
                    <td>{item.email}</td>
                    <td>{item.address}</td>
                    <td><Badge bg={item.status == 'Pending Review' ? "secondary" :
                      item.status == 'Approved' ? 'success' : 'danger'}>
                      {item.status}</Badge></td>
                    <td ><IoMdCreate onClick={() => {
                      navigate(`/schools/${item.id}`)
                    }} /></td>
                    <td><HiTrash onClick={() => {
                      modalDataHandler(item.id, 'delete-school')
                    }} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>}
      {schools.length !== 0 &&
        <CustomPagination page={page} setPage={setPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />}
      {modalType && <SchoolModal show={show} handleClose={handleClose} handleShow={handleShow}
        modalType={modalType} modalDataId={modalDataId} loadSchool={getSchoolsHandler} />}
    </BodyWrapper>
  )
}

export default AdminSchools
