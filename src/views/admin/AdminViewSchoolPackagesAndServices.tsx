import React, { ChangeEvent, useEffect, useState, useCallback } from 'react'
import { Link } from "react-router-dom";
import BodyWrapper from '../../components/BodyWrapper'
import { IoMdSearch, IoMdTrash, IoMdCreate, IoIosAdd } from "react-icons/io";
import { Table, Button, Pagination, Form, Row, Col, InputGroup, Alert } from 'react-bootstrap';
// import AdminSchoolPackagesAndServicesModal from '../../components/AdminSchoolPackagesAndServicesModal';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import CustomPagination from '../../components/CustomPagination';
import { MdOutlineClear } from 'react-icons/md';
import { HiTrash } from 'react-icons/hi';
import { useNavigate, useParams } from "react-router-dom";
import { BsCloudUpload, BsEye } from 'react-icons/bs';

export default function AdminViewSchoolPackagesAndServices() {

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

  const [schoolPackagesAndServices, setSchoolPackagesAndServices] = useState<any>()

  // Pagination control
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(2)
  const [totalPages, setTotalPages] = useState<number | null>(null)
  // Search 
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    if (selectedSchool !== null) {
      if (search === '') {
        getSchoolPackagesAndServicesHandler()
      }
    }
  }, [search])

  useEffect(() => {
    if (selectedSchool !== null) {
      getSchoolPackagesAndServicesHandler()
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
      // console.log(resData);
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
        setSelectedSchool(null)
      }
    }
  };

  const getSchoolPackagesAndServicesHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/get-school-packages-and-services`, {
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
        return setSchoolPackagesAndServices(resData)
      } else {
        setSchoolPackagesAndServices(resData)
        setTotalPages(resData.pageInfo.totalPages)
      }
    } catch (e: any) {
      console.log(e)
      if (e.code == "ECONNABORTED") {
        return setSchoolPackagesAndServices({
          "success": false,
          "message": "Request timed out.",
        })
      } else
        if (e?.response?.data !== undefined) {
          const errorData = e.response.data;
          return setSchoolPackagesAndServices({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        } else {
          return setSchoolPackagesAndServices({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        }
    }
  }

  return (
    <BodyWrapper title={'Packages and Services'}
      subTitle={selectedSchool !== null ? selectedSchool.school_name : ''}>

      {schoolPackagesAndServices?.success === false && !schoolPackagesAndServices?.data &&
        <Alert className='form-feedback-message' variant={"danger"} dismissible>
          <div>{schoolPackagesAndServices?.message}</div>
        </Alert>}

      {/*  Only display if selected school is not null*/}
      {selectedSchool !== null && schoolPackagesAndServices?.data &&
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
                      getSchoolPackagesAndServicesHandler()
                    }} hidden>Search</Button>
                  </InputGroup>
                </Col>
              </Row>
            </Form>
          </div>
          {schoolPackagesAndServices.data.length !== 0 &&
            <div className="table-responsive">
              <table className='table table-hover table-sm'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Package/Service Name</th>
                    <th>Status</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {schoolPackagesAndServices.data.map((item: any, index: number) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.sn}</td>
                        <td>{item.name}</td>
                        <td>{item.status}</td>
                        <td ><BsEye onClick={() => {
                          modalDataHandler(item.id, 'view-school-packages-and-services-docs')
                        }} /></td>
                        <td><BsCloudUpload onClick={() => {
                          // modalDataHandler(item.id, 'upload-school-packages-and-services-docs')
                        }} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>}

          {schoolPackagesAndServices.data.length == 0 &&
            <Alert className='form-feedback-message' variant={"info"} dismissible>
              <div>{schoolPackagesAndServices?.message}</div>
            </Alert>}

          {schoolPackagesAndServices.data.length !== 0 &&
            <CustomPagination page={page} setPage={setPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />}
          {/* {modalType && <AdminSchoolPackagesAndServicesModal show={show} handleClose={handleClose} handleShow={handleShow}
            modalType={modalType} modalDataId={modalDataId} schoolId={schoolId} loadSchoolPackagesAndServices={getSchoolPackagesAndServicesHandler} />} */}
        </>
      }
    </BodyWrapper>
  )
}
