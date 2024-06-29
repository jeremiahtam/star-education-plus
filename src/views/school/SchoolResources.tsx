import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import BodyWrapper from '../../components/BodyWrapper'
import { IoMdSearch } from "react-icons/io";
import { Button, Form, Card, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import AdminResourcesModal from '../../components/AdminResourcesModal';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateCart, stateLoggedInUserType } from '../../../types/type-definitions';
import CustomPagination from '../../components/CustomPagination';
import { MdOutlineClear } from 'react-icons/md';
import { FaArrowRight, FaOpencart } from 'react-icons/fa'
import { BiPackage } from 'react-icons/bi'
import { Link, useNavigate } from "react-router-dom";
import { deleteUserData } from '../../store/actions/user-info';
import { store } from '../../store/root-reducer';
import { addResource } from '../../store/actions/shopping-cart';
import ToastComponent from '../../components/ToastComponent';

function SchoolResources() {
  const pounds = Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });
  const navigate = useNavigate()
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  //Resources available in cart
  const cartResources = useSelector((state: stateCart) => state.cart.resources)

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

  //Toast information
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState<string | null>(null);
  const [toastBody, setToastBody] = useState<string | null>(null);

  // Pagination control
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10)
  const [totalPages, setTotalPages] = useState<number | null>(null)

  // Search
  const [search, setSearch] = useState<string>('')

  // resources
  const [selectedResources, setSelectedResources] = useState<any>(null)

  useEffect(() => {
    if (selectedResources !== null) {
      if (search === '') {
        getResourcesHandler()
      }
    }
  }, [search])

  useEffect(() => {
    if (selectedResources !== null) {
      getResourcesHandler()
    }
  }, [userInfoData, page, itemsPerPage])

  useEffect(() => {
    getResourcesHandler()
  }, [userInfoData])

  const getResourcesHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/all-school-resources`,
        {
          params: {
            search,
            itemsPerPage: itemsPerPage,
            page: page,
            schoolId: userInfoData.userId
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
        return setSelectedResources(resData)
      } else {
        setSelectedResources(resData)
        setTotalPages(resData.pageInfo.totalPages)
      }
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {
        const errorData = e.response.data;
        if (errorData.message == "Unauthenticated.") {
          store.dispatch(deleteUserData());
        }
        return setSelectedResources({
          "success": false,
          "message": "Request timed out.",
        })
      } else if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        if (errorData.message == "Unauthenticated.") {
          store.dispatch(deleteUserData());
        }
        return setSelectedResources({
          "success": false,
          "message": "Error. Something went wrong.",
        })
      } else {
        return setSelectedResources({
          "success": false,
          "message": "Error. Something went wrong.",
        })
      }
    }
  };

  return (
    <BodyWrapper title='Resources'>

      {userInfoData.planExpired === true &&
        <Alert className='form-feedback-message' variant={"danger"} dismissible>
          <div>Your membership plan has expired. Click <Link to={'/membership-plans'}>here</Link> to subscribe to a new membership plan.</div>
        </Alert>}

      {selectedResources?.success === false && !selectedResources?.data &&
        <Alert className='form-feedback-message' variant={"danger"} dismissible>
          <div>{selectedResources?.message}</div>
        </Alert>}
      {selectedResources?.data &&
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
                      getResourcesHandler()
                    }} hidden>Search</Button>
                  </InputGroup>
                </Col>
              </Row>
            </Form>
          </div>

          {selectedResources.data.length !== 0 &&
            <Row className='card-items-row'>

              {selectedResources.data.map((item: any, index: any) => {
                return (
                  <Col lg={3} md={4} className='mb-3' key={index}>
                    <Card className='price-card'
                      style={{ background: item.status == 'active' ? '#fff' : '#e9e9e9' }}>
                      <Card.Body>
                        <Card.Subtitle className="mb-2 price-card-sub-title">
                          <BiPackage /> {item.name}
                        </Card.Subtitle>
                        <Card.Title className='price-card-title'>{pounds.format(item.amount)}</Card.Title>
                        <div className='price-card-border mb-3 mt-3'></div>
                        <Card.Text className='price-card-text'>
                          {item.excerpt}
                          <Card.Link onClick={() => {
                            modalDataHandler(item, 'view-resources-details')
                          }}
                          > view more.</Card.Link>
                        </Card.Text>
                        <div className='price-card-border mb-3 mt-3'></div>
                        {item.paidResources.length > 0 ?
                          <Button className='btn-block mb-3 form-control btn-custom'
                            disabled={item.status === 'active' ? false : true}
                            onClick={() => {
                              navigate(`/resources/${item.id}`, {
                                state: {
                                  data: item
                                }
                              })
                            }}>
                            <FaArrowRight /> {item.status == 'active' ? 'View Purchase' : 'Inactive'}
                          </Button>
                          :
                          <Button className='btn-block mb-3 form-control btn-custom'
                            disabled={item.status == 'active' ? false : true}
                            onClick={() => {
                              const isFound = cartResources.some((element: any) => {
                                if (element.id === item.id) {
                                  return true;
                                }
                                return false;
                              });
                              console.log(isFound)

                              setToastTitle('Oops')
                              setToastBody('You already added that item.')

                              if (isFound == true) {
                                setShowToast(true)
                              } else {
                                store.dispatch(addResource(item))
                              }
                            }}>
                            <FaOpencart /> {item.status == 'active' ? 'Purchase' : 'Inactive'}
                          </Button>
                        }
                      </Card.Body>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          }

          {selectedResources.data.length == 0 &&
            <Alert className='form-feedback-message' variant={"info"} dismissible>
              <div>{selectedResources?.message}</div>
            </Alert>}
          {selectedResources.data.length !== 0 &&
            <CustomPagination page={page} setPage={setPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />}
          {modalType && <AdminResourcesModal show={show} handleClose={handleClose} handleShow={handleShow}
            modalType={modalType} modalDataContent={modalDataContent} />}

          {toastBody && toastTitle &&
            <ToastComponent
              onClose={() => setShowToast(false)}
              show={showToast}
              delay={3000}
              autohide={true}
              title={toastTitle}
              body={toastBody}
            />}
        </>}
    </BodyWrapper>
  )
}

export default SchoolResources