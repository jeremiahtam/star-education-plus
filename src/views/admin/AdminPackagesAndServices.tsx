import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import BodyWrapper from '../../components/BodyWrapper'
import { IoMdSearch, IoMdCreate, IoIosAdd } from "react-icons/io";
import { Button, Form, Row, Col, InputGroup, Alert, Breadcrumb } from 'react-bootstrap';
import AdminPackagesAndServicesModal from '../../components/AdminPackagesAndServicesModal';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import CustomPagination from '../../components/CustomPagination';
import { MdOutlineClear } from 'react-icons/md';
import { HiTrash } from 'react-icons/hi';
import { deleteUserData } from '../../store/actions/user-info';
import { store } from '../../store/root-reducer';

function AdminPackagesAndServices() {
  const pounds = Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });
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

  // Pagination control
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10)
  const [totalPages, setTotalPages] = useState<number | null>(null)

  // Search 
  const [search, setSearch] = useState<string>('')

  // Packages and services 
  const [selectedPackagesAndServices, setSelectedPackagesAndServices] = useState<any>(null)

  useEffect(() => {
    if (selectedPackagesAndServices !== null) {
      if (search === '') {
        getPackagesAndServicesHandler()
      }
    }
  }, [search])

  useEffect(() => {
    if (selectedPackagesAndServices !== null) {
      getPackagesAndServicesHandler()
    }
  }, [userInfoData, page, itemsPerPage])

  useEffect(() => {
    getPackagesAndServicesHandler()
  }, [userInfoData])

  const getPackagesAndServicesHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/all-packages-and-services`,
        {
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
      console.log(resData);
      if (resData.success == false) {
        return setSelectedPackagesAndServices(resData)
      } else {
        setSelectedPackagesAndServices(resData)
        setTotalPages(resData.pageInfo.totalPages)
      }
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {
        return setSelectedPackagesAndServices({
          "success": false,
          "message": "Request timed out.",
        })
      } else
        if (e?.response?.data !== undefined) {
          const errorData = e.response.data;
          if (errorData.message == "Unauthenticated.") {
            store.dispatch(deleteUserData());
          }
          return setSelectedPackagesAndServices({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        } else {
          const errorData = e.response.data;
          if (errorData.message == "Unauthenticated.") {
            store.dispatch(deleteUserData());
          } return setSelectedPackagesAndServices({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        }
    }
  };

  return (
    <BodyWrapper title={'Packages and Services'}
      rightHandSide={selectedPackagesAndServices?.data && <button className='btn btn-custom btn-sm'
        onClick={() => {
          setModalType('add-packages-and-services')
          handleShow()
        }}>Create New <IoIosAdd className='btn-icon' /></button>}>
      {/* <Breadcrumb>
        <Breadcrumb.Item onClick={() => {
        }}>
          Packages and Services
        </Breadcrumb.Item>
      </Breadcrumb> */}

      {selectedPackagesAndServices?.success === false && !selectedPackagesAndServices?.data &&
        <Alert className='form-feedback-message' variant={"danger"} dismissible>
          <div>{selectedPackagesAndServices?.message}</div>
        </Alert>}

      {selectedPackagesAndServices?.data &&
        <>
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
                      getPackagesAndServicesHandler()
                    }} hidden>Search</Button>
                  </InputGroup>
                </Col>
              </Row>
            </Form>
          </div>
          {selectedPackagesAndServices.data.length !== 0 &&
            <div className="table-responsive">
              <table className='table table-hover table-sm'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Service Name</th>
                    <th>Content</th>
                    <th>Amount</th>
                    <th>Duration (Days)</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPackagesAndServices.data.map((item: any, index: any) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.sn}</td>
                        <td>{item.name}</td>
                        <td>{item.packagesAndServicesContent}</td>
                        <td>{pounds.format(item.amount)}</td>
                        <td>{item.duration == null ? '-' : item.duration}</td>
                        <td>{item.category}</td>
                        <td>{item.status}</td>
                        <td ><IoMdCreate onClick={() => {
                          modalDataHandler(item.id, 'edit-packages-and-services')
                        }} /></td>
                        <td><HiTrash onClick={() => {
                          modalDataHandler(item.id, 'delete-packages-and-services')
                        }} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>}
          {selectedPackagesAndServices.data.length == 0 &&
            <Alert className='form-feedback-message' variant={"info"} dismissible>
              <div>{selectedPackagesAndServices?.message}</div>
            </Alert>}
          {selectedPackagesAndServices.data.length !== 0 &&
            <CustomPagination page={page} setPage={setPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />}
          {modalType && <AdminPackagesAndServicesModal show={show} handleClose={handleClose} handleShow={handleShow}
            modalType={modalType} modalDataId={modalDataId} loadPackagesAndServices={getPackagesAndServicesHandler} />}
        </>
      }
    </BodyWrapper>
  )
}
export default AdminPackagesAndServices