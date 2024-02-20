import { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux'
import { Alert, Badge, Card } from 'react-bootstrap'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import { useNavigate } from 'react-router-dom';

export default function SchoolDashboardInvoicesCard() {
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate()

  const [invoices, setInvoices] = useState<any>()

  useEffect(() => {
    getInvoicesHandler()
  }, [userInfoData])

  const getInvoicesHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/school-invoices`, {
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
        return setInvoices(resData)
      } else {
        setInvoices(resData)
      }
    } catch (e: any) {
      console.log(e)
      if (e.code == "ECONNABORTED") {
        return setInvoices({
          "success": false,
          "message": "Request timed out.",
        })
      } else
        if (e?.response?.data !== undefined) {
          const errorData = e.response.data;
          return setInvoices({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        } else {
          return setInvoices({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        }
    }
  }

  return (
    <>
      {invoices?.success === false && !invoices?.data &&
        <Alert className='form-feedback-message' variant={"danger"} dismissible>
          <div>{invoices?.message}</div>
        </Alert>}

      {invoices?.data && <>
        <Card className='school-dashboard-card mb-3'
          style={{
            borderColor: '#aa8302'
          }}>
          <Card.Header style={{ borderColor: '#aa8302' }}>
            <Card.Title>Invoices</Card.Title>
            <span className='view-all' style={{ cursor: 'pointer' }}
              onClick={() => navigate('/invoices')}>
              View all
            </span>
          </Card.Header>
          <Card.Body>
            {invoices.data.length !== 0 &&
              <div className="table-responsive">
                <table className='table table-hover table-sm'>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Invoice Number</th>
                      <th>Status</th>
                      <th>Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.data.map((item: any, index: number) => {
                      return (
                        <tr key={index}>
                          <td>{item.sn}</td>
                          <td>{item.invoiceNumber}</td>
                          <td>
                            <Badge
                              bg={item.status == 'paid' ?
                                'success' : item.status == 'pending' ?
                                  'info' : 'danger'}>
                              {item.status}
                            </Badge>
                          </td>
                          <td>{item.deadlineDate} {item.deadlineTime}</td>
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
