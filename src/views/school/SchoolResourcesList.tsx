import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import { Button, Form, Row, Col, InputGroup, Alert, Breadcrumb } from 'react-bootstrap';
import AdminResourcesDocsModal from '../../components/AdminResourcesDocsModal';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import CustomPagination from '../../components/CustomPagination';
import { MdOutlineClear } from 'react-icons/md';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import BodyWrapper from '../../components/BodyWrapper'
import { IoMdSearch } from 'react-icons/io';
import { store } from '../../store/root-reducer';
import { deleteUserData } from '../../store/actions/user-info';
import { FaEye } from 'react-icons/fa';
import ToastComponent from '../../components/ToastComponent';

function SchoolResourcesList() {
  const location = useLocation()
  const { resourcesId } = useParams()
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const navigate = useNavigate();

  //Toast information
  const [showToast, setShowToast] = useState(false);

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

  const [resourcesDocs, setResourcesDocs] = useState<any>()

  // Pagination control
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10)
  const [totalPages, setTotalPages] = useState<number | null>(null)
  // Search 
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    if (search === '') {
      getResourcesDocsHandler()
    }
  }, [search])

  useEffect(() => {
    getResourcesDocsHandler()
  }, [userInfoData, page, itemsPerPage])

  const getResourcesDocsHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/all-resources-documents`, {
        params: {
          search,
          itemsPerPage,
          page,
          resourcesId
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
        return setResourcesDocs(resData)
      } else {
        setResourcesDocs(resData)
        setTotalPages(resData.pageInfo.totalPages)
      }
    } catch (e: any) {
      console.log(e)
      if (e.code == "ECONNABORTED") {
        return setResourcesDocs({
          "success": false,
          "message": "Request timed out.",
        })
      } else
        if (e?.response?.data !== undefined) {
          const errorData = e.response.data;
          if (errorData.message == "Unauthenticated.") {
            store.dispatch(deleteUserData());
          }
          return setResourcesDocs({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        } else {
          const errorData = e.response.data;
          if (errorData.message == "Unauthenticated.") {
            store.dispatch(deleteUserData());
          }
          return setResourcesDocs({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        }
    }
  }

  return (
    <BodyWrapper title='Resources'>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => {
          navigate('/resources')
        }}>
          Resources
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {location?.state !== null ? location.state.data.name : 'Resource Item'}
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* {location?.state !== null &&
        <div className=''>{location.state.data.name}</div>} */}

      {resourcesDocs?.success === false && !resourcesDocs?.data &&
        <Alert className='form-feedback-message' variant={"danger"} dismissible>
          <div>{resourcesDocs?.message}</div>
        </Alert>}

      {resourcesDocs?.data &&
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
                      getResourcesDocsHandler()
                    }} hidden>Search</Button>
                  </InputGroup>
                </Col>
              </Row>
            </Form>
          </div>
          {resourcesDocs.data.length !== 0 &&
            <div className="table-responsive">
              <table className='table table-hover table-sm'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Document Name</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {resourcesDocs.data.map((item: any, index: number) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.sn}</td>
                        <td>{item.documentName}</td>
                        <td>
                          <FaEye
                            onClick={() => {
                              if (userInfoData.planExpired === true) {
                                setShowToast(true)
                              } else {
                                modalDataHandler(item, 'view-resources-docs')
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

          {resourcesDocs.data.length == 0 &&
            <Alert className='form-feedback-message' variant={"info"} dismissible>
              <div>{resourcesDocs?.message}</div>
            </Alert>}

          {resourcesDocs.data.length !== 0 &&
            <CustomPagination page={page} setPage={setPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />}
          {modalType && <AdminResourcesDocsModal show={show} handleClose={handleClose} handleShow={handleShow}
            modalType={modalType} modalDataContent={modalDataContent} resourcesId={resourcesId} />}
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

export default SchoolResourcesList