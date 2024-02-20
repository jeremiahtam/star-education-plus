import { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux'
import { Alert, Badge, Card } from 'react-bootstrap'
import { store } from '../../store/root-reducer';
import { stateCart, stateLoggedInUserType } from '../../../types/type-definitions';
import { deleteUserData } from '../../store/actions/user-info';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaOpencart } from 'react-icons/fa';
import { addResource } from '../../store/actions/shopping-cart';
import ToastComponent from '../../components/ToastComponent';

export default function SchoolDashboardResourcesCard() {
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate()

  //Resources available in cart
  const cartResources = useSelector((state: stateCart) => state.cart.resources)

  //Toast information
  const [showToast, setShowToast] = useState(false);

  const [selectedResources, setSelectedResources] = useState<any>(null)

  useEffect(() => {
    getResourcesHandler()
  }, [userInfoData])

  const getResourcesHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/all-school-resources`,
        {
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
      console.log(resData);
      if (resData.success == false) {
        return setSelectedResources(resData)
      } else {
        setSelectedResources(resData)
        // setTotalPages(resData.pageInfo.totalPages)
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
    <>
      {selectedResources?.success === false && !selectedResources?.data &&
        <Alert className='form-feedback-message' variant={"danger"} dismissible>
          <div>{selectedResources?.message}</div>
        </Alert>}

      {selectedResources?.data && <>
        <Card className='school-dashboard-card mb-3'
          style={{
            borderColor: '#ad134c'
          }}>
          <Card.Header style={{ borderColor: '#ad134c' }}>
            <Card.Title>Services Purchased</Card.Title>
            <span className='view-all' style={{ cursor: 'pointer' }}
              onClick={() => navigate('/resources')}>
              View all
            </span>
          </Card.Header>
          <Card.Body>
            {selectedResources.data?.length !== 0 &&
              <div className="table-responsive">
                <table className='table table-hover table-sm'>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Details</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedResources.data.map((item: any, index: number) => {
                      return (
                        <tr key={index}>
                          <td>{item.sn}</td>
                          <td>
                            <b>{item.name}</b>
                            <br />
                            {item.excerpt}
                          </td>
                          <td>
                            {item.paidResources.length > 0 ?
                              <Badge bg='success' onClick={() => {
                                navigate(`/resources/${item.id}`, {
                                  state: {
                                    data: item
                                  }
                                })
                              }}>
                                <FaArrowRight /> View Purchase
                              </Badge>
                              :
                              <Badge bg='primary' onClick={() => {
                                const isFound = cartResources.some((element: any) => {
                                  if (element.id === item.id) {
                                    return true;
                                  }
                                  return false;
                                });
                                console.log(isFound)
                                if (isFound == true) {
                                  setShowToast(true)
                                } else {
                                  store.dispatch(addResource(item))
                                }
                              }}>
                                <FaOpencart /> Purchase
                              </Badge>
                            }
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
      <ToastComponent
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide={true}
        title='Oops!'
        body='You already added that item.'
      />
    </>
  )
}
