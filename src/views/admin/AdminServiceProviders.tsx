import React, { ChangeEvent, useEffect, useState, useCallback } from 'react'
import { Link } from "react-router-dom";
import BodyWrapper from '../../components/BodyWrapper'
import { IoMdSearch, IoMdTrash, IoMdCreate, IoIosAdd } from "react-icons/io";
import { Table, Button, Pagination, Form, Row, Col, InputGroup, Alert, Breadcrumb } from 'react-bootstrap';
import AdminServiceProvidersModal from '../../components/AdminServiceProvidersModal';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import CustomPagination from '../../components/CustomPagination';
import { MdOutlineClear } from 'react-icons/md';
import { HiTrash } from 'react-icons/hi';
import { useNavigate, useParams } from "react-router-dom";
import { deleteUserData } from '../../store/actions/user-info';
import { store } from '../../store/root-reducer';

function AdminServiceProviders() {
  const pounds = Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });
  const { schoolId } = useParams()
  const navigate = useNavigate()
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const [selectedSchool, setSelectedSchool] = useState<any>(null)

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

  const [serviceProviders, setServiceProviders] = useState<any>()

  // Pagination control
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(2)
  const [totalPages, setTotalPages] = useState<number | null>(null)
  // Search 
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    if (selectedSchool !== null) {
      if (search === '') {
        getServiceProvidersHandler()
      }
    }
  }, [search])

  useEffect(() => {
    if (selectedSchool !== null) {
      getServiceProvidersHandler()
    }
  }, [userInfoData, page, itemsPerPage, selectedSchool])

  useEffect(() => {
    getSchoolHandler()
  }, [userInfoData])

  const getSchoolHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/get-school-by-id`,
        {
          params: {
            id: schoolId
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
        navigate('/error-page')
      } else {
        setSelectedSchool(resData.data)
      }
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        if (errorData.message == "Unauthenticated.") {
          store.dispatch(deleteUserData());
        }
        setSelectedSchool(null)
      }
    }
  };

  const getServiceProvidersHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/get-school-service-providers`, {
        params: {
          search,
          itemsPerPage: itemsPerPage,
          page: page,
          schoolId: schoolId
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
        return setServiceProviders(resData)
      } else {
        setServiceProviders(resData)
        setTotalPages(resData.pageInfo.totalPages)
      }
    } catch (e: any) {
      console.log(e)
      if (e.code == "ECONNABORTED") {
        return setServiceProviders({
          "success": false,
          "message": "Request timed out.",
        })
      } else
        if (e?.response?.data !== undefined) {
          const errorData = e.response.data;
          return setServiceProviders({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        } else {
          return setServiceProviders({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        }
    }
  }

  return (
    <BodyWrapper title={'Service Providers'}
      subTitle={selectedSchool !== null ? selectedSchool.school_name : ''}
      rightHandSide={selectedSchool !== null && serviceProviders?.data &&
        <button className='btn btn-custom btn-sm'
          onClick={() => {
            setModalType('add-service-providers')
            handleShow()
          }}>Create New <IoIosAdd className='btn-icon' />
        </button>}>

      <Breadcrumb>
        <Breadcrumb.Item onClick={() => {
          navigate('/schools')
        }}>
          Schools
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => {
          navigate(`/schools/${schoolId}`)
        }}>
          {selectedSchool !== null ? selectedSchool.school_name : 'School Profile'}
         
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          Service Providers
        </Breadcrumb.Item>
      </Breadcrumb>

      {serviceProviders?.success === false && !serviceProviders?.data &&
        <Alert className='form-feedback-message' variant={"danger"} dismissible>
          <div>{serviceProviders?.message}</div>
        </Alert>}

      {/*  Only display if selected school is not null*/}
      {selectedSchool !== null && serviceProviders?.data &&
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
                      getServiceProvidersHandler()
                    }} hidden>Search</Button>
                  </InputGroup>
                </Col>
              </Row>
            </Form>
          </div>
          {serviceProviders.data.length !== 0 &&
            <div className="table-responsive">
              <table className='table table-hover table-sm'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Service Name</th>
                    <th>Company Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Renewal Date</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {serviceProviders.data.map((item: any, index: number) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.sn}</td>
                        <td>{item.serviceName}</td>
                        <td>{item.companyName ? item.companyName : '-'}</td>
                        <td>{item.price ? pounds.format(item.price) : '-'}</td>
                        <td>{item.quantity ? item.quantity : '-'}</td>
                        <td>{item.renewDate} {item.renewTime}</td>
                        <td ><IoMdCreate onClick={() => {
                          modalDataHandler(item.id, 'edit-service-providers')
                        }} /></td>
                        <td><HiTrash onClick={() => {
                          modalDataHandler(item.id, 'delete-service-providers')
                        }} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>}

          {serviceProviders.data.length == 0 &&
            <Alert className='form-feedback-message' variant={"info"} dismissible>
              <div>{serviceProviders?.message}</div>
            </Alert>}

          {serviceProviders.data.length !== 0 &&
            <CustomPagination page={page} setPage={setPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />}
          {modalType && <AdminServiceProvidersModal show={show} handleClose={handleClose} handleShow={handleShow}
            modalType={modalType} modalDataId={modalDataId} schoolId={schoolId} loadServiceProviders={getServiceProvidersHandler} />}
        </>
      }
    </BodyWrapper>
  )
}


export default AdminServiceProviders
