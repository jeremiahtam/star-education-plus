import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux'
import { Alert, Badge, Card, Col, Row, Image, Button } from 'react-bootstrap'
import { store } from '../../store/root-reducer';
import { stateLoggedInUserType } from '../../../types/type-definitions';
import { deleteUserData } from '../../store/actions/user-info';
import { Link, useNavigate } from 'react-router-dom';
import serviceProvidersList from '../../data/serviceProvidersList';
import { RiCustomerService2Line } from 'react-icons/ri';

export default function SchoolDashboardServiceProvidersCard() {
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate()

  const [serviceProviders, setServiceProviders] = useState<any>()

  useEffect(() => {
    getServiceProvidersHandler()
  }, [userInfoData])

  const getServiceProvidersHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/get-school-service-providers`, {
        params: {
          search: '',
          itemsPerPage: 10,
          page: 1,
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
        // setTotalPages(resData.pageInfo.totalPages)
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
    <>
      {serviceProviders?.success === false && !serviceProviders?.data &&
        <Alert className='form-feedback-message' variant={"danger"} dismissible>
          <div>{serviceProviders?.message}</div>
        </Alert>}


      {serviceProviders?.data && <>
        <Card className='school-dashboard-card mb-3'>
          <Card.Header>
            <Card.Title>Service Providers</Card.Title>
            <span className='view-all' style={{ cursor: 'pointer' }}
              onClick={() => navigate('/service-providers')}>
              View all
            </span>
          </Card.Header>
          <Card.Body>
            {serviceProviders.data?.length !== 0 &&
              <div className="table-responsive">
                <table className='table table-hover table-sm'>
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Provider</th>
                      <th>Renew Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceProviders.data.map((item: any, index: number) => {
                      const result = serviceProvidersList.find((service: any) => {
                        if (item.serviceName == service.name) {
                          return service
                        }
                      });
                      const Icon = result?.icon ? result.icon : RiCustomerService2Line
                      const iconColor = result?.iconColor ? result.iconColor : "#301aaf"

                      return (
                        <tr key={index}>
                          <td>
                            <Icon size={30} className='icon' color={iconColor} />
                            {item.serviceName !== '' ? item.serviceName : '-'}
                          </td>
                          <td>{item.companyName !== '' ? item.companyName : '-'}</td>
                          <td>
                            {item.renewDate !== '' ? item.renewDate : '-'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>}
          </Card.Body>
        </Card>
      </>}
    </>
  )
}
