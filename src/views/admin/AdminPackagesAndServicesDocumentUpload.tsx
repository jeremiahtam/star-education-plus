import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import { Button, Form, Row, Col, InputGroup, Alert, Breadcrumb } from 'react-bootstrap';
import AdminSchoolDocsModal from '../../components/AdminSchoolDocsModal';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import CustomPagination from '../../components/CustomPagination';
import { MdOutlineClear } from 'react-icons/md';
import { HiTrash } from 'react-icons/hi';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import BodyWrapper from '../../components/BodyWrapper'
import { IoIosAdd, IoMdCreate, IoMdDownload, IoMdSearch } from 'react-icons/io';
import fileDownload from 'js-file-download'
import { deleteUserData } from '../../store/actions/user-info';
import { store } from '../../store/root-reducer';

function AdminPackagesAndServicesDocumentUpload() {
  const location = useLocation()
  if (location.state.category) {
    // console.log(location.state.category)
    // console.log(location.state.data.name)
  }
  const { schoolId, orderedItemsId } = useParams()
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

  const [schoolOrderedDocs, setSchoolOrderedDocs] = useState<any>()

  // Pagination control
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10)
  const [totalPages, setTotalPages] = useState<number | null>(null)
  // Search 
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    if (selectedSchool !== null) {
      if (search === '') {
        getSchoolDocsHandler()
      }
    }
  }, [search])

  useEffect(() => {
    if (selectedSchool !== null) {
      getSchoolDocsHandler()
    }
  }, [userInfoData, page, itemsPerPage, selectedSchool])

  useEffect(() => {
    getSchoolHandler()
  }, [userInfoData])

  const downloadFileHandler = async (fileName: string, saveFileName: string) => {
    try {
      const res = await axios.get(`${baseUrl}/api/download-file/${fileName}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
          validateStatus: (s) => s <= 500,
        });
      const resData = res.data;
      console.log(resData)
      const extension = fileName.split('.').pop();
      fileDownload(resData, `${saveFileName}.${extension}`)
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
        if (errorData.message == "Unauthenticated.") {
          store.dispatch(deleteUserData());
        }
        setSelectedSchool(null)
      }
    }
  };

  const getSchoolDocsHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/get-ordered-item-documents`, {
        params: {
          search,
          itemsPerPage,
          page,
          orderedItemsId
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
        return setSchoolOrderedDocs(resData)
      } else {
        setSchoolOrderedDocs(resData)
        setTotalPages(resData.pageInfo.totalPages)
      }
    } catch (e: any) {
      console.log(e)
      if (e.code == "ECONNABORTED") {
        return setSchoolOrderedDocs({
          "success": false,
          "message": "Request timed out.",
        })
      } else if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        if (errorData.message == "Unauthenticated.") {
          store.dispatch(deleteUserData());
        }
        return setSchoolOrderedDocs({
          "success": false,
          "message": "Error. Something went wrong.",
        })
      } else {
        const errorData = e.response.data;
        if (errorData.message == "Unauthenticated.") {
          store.dispatch(deleteUserData());
        }
        return setSchoolOrderedDocs({
          "success": false,
          "message": "Error. Something went wrong.",
        })
      }
    }
  }
  return (
    <BodyWrapper title={'Documents'}
      subTitle={selectedSchool !== null ? selectedSchool.school_name : ''}
      rightHandSide={selectedSchool !== null && schoolOrderedDocs?.data &&
        <button className='btn btn-custom btn-sm'
          onClick={() => {
            setModalType('add-school-packages-and-services-docs')
            handleShow()
          }}>Create New <IoIosAdd className='btn-icon' /></button>}>

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
        <Breadcrumb.Item onClick={() => {
          navigate(`/schools/${schoolId}/packages-and-services`)
        }}>
          {location?.state !== null ? location.state.data.name : 'Packages and Services'}
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => {
        }}>
          Document Upload
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* This block of code is useful for reference, do not delete */}
      {/* {location?.state !== null &&
        <div className=''>{location.state.category} | {location.state.data.name}</div>} */}

      {schoolOrderedDocs?.success === false && !schoolOrderedDocs?.data &&
        <Alert className='form-feedback-message' variant={"danger"} dismissible>
          <div>{schoolOrderedDocs?.message}</div>
        </Alert>}

      {/*  Only display if selected school is not null*/}
      {selectedSchool !== null && schoolOrderedDocs?.data &&
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
                      getSchoolDocsHandler()
                    }} hidden>Search</Button>
                  </InputGroup>
                </Col>
              </Row>
            </Form>
          </div>
          {schoolOrderedDocs.data.length !== 0 &&
            <div className="table-responsive">
              <table className='table table-hover table-sm'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Document Name</th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {schoolOrderedDocs.data.map((item: any, index: number) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.sn}</td>
                        <td>{item.documentName}</td>
                        <td>
                          <IoMdDownload
                            onClick={() => downloadFileHandler(item.nameInStorage, item.documentName)}
                          />
                        </td>
                        <td ><IoMdCreate onClick={() => {
                          modalDataHandler(item.id, 'edit-school-packages-and-services-docs')
                        }} /></td>
                        <td><HiTrash onClick={() => {
                          modalDataHandler(item.id, 'delete-school-packages-and-services-docs')
                        }} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>}

          {schoolOrderedDocs.data.length == 0 &&
            <Alert className='form-feedback-message' variant={"info"} dismissible>
              <div>{schoolOrderedDocs?.message}</div>
            </Alert>}

          {schoolOrderedDocs.data.length !== 0 &&
            <CustomPagination page={page} setPage={setPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />}
          {modalType && <AdminSchoolDocsModal show={show} handleClose={handleClose} handleShow={handleShow}
            modalType={modalType} modalDataId={modalDataId} orderedItemsId={orderedItemsId}
            loadSchoolDocs={getSchoolDocsHandler} />}
        </>
      }
    </BodyWrapper>
  )
}

export default AdminPackagesAndServicesDocumentUpload
