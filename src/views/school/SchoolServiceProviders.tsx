import { ChangeEvent, useEffect, useState } from 'react'
import BodyWrapper from '../../components/BodyWrapper'
import { IoMdSearch } from "react-icons/io";
import { Button, Form, Row, Col, InputGroup, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import CustomPagination from '../../components/CustomPagination';
import { MdOutlineClear } from 'react-icons/md';
import serviceProvidersList from '../../data/serviceProvidersList';
import { RiCustomerService2Line } from 'react-icons/ri';

function SchoolServiceProviders() {
  const pounds = Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });

  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const [serviceProviders, setServiceProviders] = useState<any>()

  // Pagination control
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(2)
  const [totalPages, setTotalPages] = useState<number | null>(null)
  // Search 
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    if (search === '') {
      getServiceProvidersHandler()
    }
  }, [search])

  useEffect(() => {
    getServiceProvidersHandler()
  }, [userInfoData, page, itemsPerPage])

  const getServiceProvidersHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/get-school-service-providers`, {
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
    <BodyWrapper title={'Service Providers'}>
      {serviceProviders?.success === false && !serviceProviders?.data &&
        <Alert className='form-feedback-message' variant={"danger"} dismissible>
          <div>{serviceProviders?.message}</div>
        </Alert>}

      {/*  Only display if selected school is not null*/}
      {serviceProviders?.data &&
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
            <Row>
              {serviceProviders.data.map((item: any, index: number) => {

                const result = serviceProvidersList.find((service: any) => {
                  if (item.serviceName == service.name) {
                    return service
                  }
                });
                const Icon = result?.icon ? result.icon : RiCustomerService2Line
                const iconColor = result?.iconColor ? result.iconColor : "#301aaf"
                return (
                  <Col lg={3} md={3} className='mb-3' key={index}>
                    <Card className='school-service-providers-box'>
                      <Card.Body>
                        <div className='icon-block'>
                          <Icon size={40} className='icon' color={iconColor} />
                        </div>
                        <div className='text-block'>
                          <div>{item.serviceName}</div>
                          {item.companyName && <div>{item.companyName}</div>}
                          {item.price && <div>{pounds.format(item.price)}</div>}
                          {item.quantity && <div>Quantity: {item.quantity}</div>}
                          {item.renewDate && <div>Renew Date: {item.renewDate}</div>}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>)
              })
              }
            </Row>
          }
          {serviceProviders.data.length == 0 &&
            <Alert className='form-feedback-message' variant={"info"} dismissible>
              <div>{serviceProviders?.message}</div>
            </Alert>}

          {serviceProviders.data.length !== 0 &&
            <CustomPagination page={page} setPage={setPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />}
        </>
      }
    </BodyWrapper>
  )
}


export default SchoolServiceProviders
