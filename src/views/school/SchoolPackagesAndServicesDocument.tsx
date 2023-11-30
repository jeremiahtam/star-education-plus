import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import { Button, Pagination, Form, Row, Col, InputGroup, Alert, Breadcrumb } from 'react-bootstrap';
import AdminSchoolDocsModal from '../../components/AdminSchoolDocsModal';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import CustomPagination from '../../components/CustomPagination';
import { MdOutlineClear } from 'react-icons/md';
import { HiTrash } from 'react-icons/hi';
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { BsCloudUpload, BsEye } from 'react-icons/bs'; import BodyWrapper from '../../components/BodyWrapper'
import { IoIosAdd, IoMdCreate, IoMdDownload, IoMdSearch } from 'react-icons/io';
import fileDownload from 'js-file-download'
import { deleteUserData } from '../../store/actions/user-info';
import { store } from '../../store/root-reducer';
import ToastComponent from '../../components/ToastComponent';

function SchoolPackagesAndServicesDocument() {
  const location = useLocation()

  if (location.state.category) {
    // console.log(location.state.category)
    // console.log(location.state.data.name)
  }
  const { orderedItemsId } = useParams()
  const navigate = useNavigate()
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  // const [selectedSchool, setSelectedSchool] = useState<any>(null)

  //Toast information
  const [showToast, setShowToast] = useState(false);

  const [schoolOrderedDocs, setSchoolOrderedDocs] = useState<any>()

  // Pagination control
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(2)
  const [totalPages, setTotalPages] = useState<number | null>(null)
  // Search 
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    if (search === '') {
      getSchoolDocsHandler()
    }
  }, [search])

  useEffect(() => {
    getSchoolDocsHandler()
  }, [userInfoData, page, itemsPerPage])

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
    // subTitle={selectedSchool !== null ? selectedSchool.school_name : ''}
    >
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => {
          navigate('/packages-and-services')
        }}>
          Packages and Services
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => {
          navigate(`/packages-and-services/${location.state.packagesAndServicesId}`, {
            state: { packagesAndServicesName: location.state.packagesAndServicesName }
          })
        }}>
          {location?.state?.packagesAndServicesName !== null ?
            location.state.packagesAndServicesName : 'Item'}
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          Document Download
        </Breadcrumb.Item>

      </Breadcrumb>

      {(location?.state?.category !== null && location?.state?.name !== null) &&
        <div className=''>{location.state.category} | {location.state.data.name}</div>}

      {schoolOrderedDocs?.success === false && !schoolOrderedDocs?.data &&
        <Alert className='form-feedback-message' variant={"danger"} dismissible>
          <div>{schoolOrderedDocs?.message}</div>
        </Alert>}

      {/*  Only display if selected school is not null*/}
      {schoolOrderedDocs?.data &&
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
                    {/* <th></th>
                    <th></th> */}
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
                            onClick={() => {
                              if (userInfoData.planExpired === true) {
                                setShowToast(true)
                              } else {
                                downloadFileHandler(item.nameInStorage, item.documentName)
                              }
                            }}
                          />
                        </td>
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
          {/* {modalType && <AdminSchoolDocsModal show={show} handleClose={handleClose} handleShow={handleShow}
            modalType={modalType} modalDataId={modalDataId} orderedItemsId={orderedItemsId}
            loadSchoolDocs={getSchoolDocsHandler} />} */}
          <ToastComponent
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={3000}
            autohide={true}
            title='Oops! Membership Plan Expired'
            body='Your membership plan has expired Please renew.'
          />

        </>
      }
    </BodyWrapper>
  )
}

export default SchoolPackagesAndServicesDocument