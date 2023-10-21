import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import BodyWrapper from '../../components/BodyWrapper'
import { IoMdSearch } from "react-icons/io";
import { Button, Form, Row, Col, InputGroup, Alert, Card } from 'react-bootstrap';
import AdminPackagesAndServicesModal from '../../components/AdminPackagesAndServicesModal';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateCart, stateLoggedInUserType } from '../../../types/type-definitions';
import CustomPagination from '../../components/CustomPagination';
import { MdOutlineClear } from 'react-icons/md';
import { deleteUserData } from '../../store/actions/user-info';
import { store } from '../../store/root-reducer';
import { BiPackage } from 'react-icons/bi';
import { FaOpencart } from 'react-icons/fa';
import ToastComponent from '../../components/ToastComponent';
import { addPackagesAndServices } from '../../store/actions/shopping-cart';
import { Link, useNavigate } from 'react-router-dom';

function SchoolPackagesAndServices() {
  const pounds = Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const navigate = useNavigate()
  //PackagesAndServices available in cart
  const cartPackagesAndServices = useSelector((state: stateCart) => state.cart.packagesAndServices)

  //Modal COntrol
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [modalType, setModalType] = useState<string | null>(null);
  const [modalDataContent, setModalDataContent] = useState<number | null>(null) /* modal Content */

  const modalDataHandler = useCallback((_dataContent: number, _modalType: string) => {
    handleShow()
    setModalDataContent(_dataContent)
    setModalType(_modalType)
    console.log(`${_dataContent} ${_modalType}`)
  }, [setModalType, setModalDataContent])

  //Toast information
  const [showToast, setShowToast] = useState(false);

  // Pagination control
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(2)
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
    <BodyWrapper title='Packages and Services'>
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
            <Row className='card-items-row'>
              {selectedPackagesAndServices.data.map((item: any, index: any) => {
                return (
                  <Col lg={3} md={4} className='mb-3' key={index}>
                    <Card className='price-card'>
                      <Card.Body>
                        <Card.Subtitle className="mb-2 price-card-sub-title">
                          <BiPackage /> {item.name}
                        </Card.Subtitle>
                        <Card.Title className='price-card-title'>{pounds.format(item.amount)}</Card.Title>
                        {/* <Card.Text className='text-warning'>Text</Card.Text> */}
                        <div className='price-card-border mb-3 mt-3'></div>
                        <Card.Text className='price-card-text'>
                          {item.excerpt}
                          <Card.Link onClick={() => {
                            modalDataHandler(item, 'view-packages-and-services')
                          }}> view more.</Card.Link>
                        </Card.Text>
                        <div className='price-card-border mb-3 mt-3'></div>
                        <Button className='btn-block mb-1 form-control btn-custom'
                          onClick={() => {
                            const isFound = cartPackagesAndServices.some((element: any) => {
                              if (element.id === item.id) {
                                return true;
                              }
                              return false;
                            });
                            console.log(isFound)
                            if (isFound == true) {
                              setShowToast(true)
                            } else {
                              store.dispatch(addPackagesAndServices(item))
                            }
                          }}
                        >
                          <FaOpencart /> Purchase
                        </Button>
                        <div className='view-link'>
                          <Link to={`/packages-and-services/${item.id}`}>
                            View Item
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          }

          {selectedPackagesAndServices.data.length == 0 &&
            <Alert className='form-feedback-message' variant={"info"} dismissible>
              <div>{selectedPackagesAndServices?.message}</div>
            </Alert>}
          {selectedPackagesAndServices.data.length !== 0 &&
            <CustomPagination page={page} setPage={setPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />}
          {modalType && <AdminPackagesAndServicesModal show={show} handleClose={handleClose} handleShow={handleShow}
            modalType={modalType} modalDataContent={modalDataContent} />}

          <ToastComponent
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={3000}
            autohide={true}
            title='Oops!'
            body='You already added that item.'
          />
        </>
      }
    </BodyWrapper >
  )
}

export default SchoolPackagesAndServices