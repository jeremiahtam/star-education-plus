import { useState, useCallback, useEffect, ChangeEvent } from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import BodyWrapper from '../../components/BodyWrapper'
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import CustomPagination from '../../components/CustomPagination';
import SchoolModal from '../../components/SchoolModal';

function AdminSchools(props: any) {
  const navigate = useNavigate();

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
  }, [userInfoData, page])

  const getSchoolsHandler = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/all-schools`, {
        params: {
          search,
          items_per_page: itemsPerPage,
          page: page
        },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${userInfoData.token}`,
        },
        timeout: 10000,
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
      rightHandSide={<button className='btn btn-primary btn-sm'
        onClick={() => {
          setModalType('add-school')
          handleShow()
        }}>CREATE NEW</button>}>
      <div className='search-area mb-3'>
        <Form>
          <Row className="justify-content-end">
            <Col sm={12} className="my-1">
              <Form.Label htmlFor="search" visuallyHidden>
                Search
              </Form.Label>
              <InputGroup>
                <InputGroup.Text><IoMdSearch size={24} /></InputGroup.Text>
                <Form.Control
                  id="search"
                  placeholder="Search"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setSearch(e.target.value)
                  }}
                  value={search}
                />
                <Button type="button" variant='light' onClick={(e: any) => {
                  e.preventDefault()
                  setPage(1)
                  setSearch('')
                }}>X</Button>
                <Button type="submit" onClick={(e: any) => {
                  e.preventDefault()
                  setPage(1)
                  getSchoolsHandler()
                }}>Search</Button>
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
                    <td>{item.fullname}</td>
                    <td>{item.schoolName}</td>
                    <td>{item.email}</td>
                    <td>{item.address}</td>
                    <td>{item.status}</td>
                    <td ><IoMdCreate onClick={() => {
                      navigate(`/schools/${item.id}`)
                      // <Link to={`/schools/${item.id}`} />
                    }} /></td>
                    <td><IoMdTrash onClick={() => {
                      modalDataHandler(item.id, 'delete-school')
                    }} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>}
      {schools.length !== 0 && <CustomPagination page={page} setPage={setPage} totalPages={totalPages} />}
      {modalType && <SchoolModal show={show} handleClose={handleClose} handleShow={handleShow}
        modalType={modalType} modalDataId={modalDataId} loadSchool={getSchoolsHandler} />}
    </BodyWrapper>
  )
}

export default AdminSchools
