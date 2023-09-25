import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import { Table, Button, Pagination, Form, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import BodyWrapper from '../../components/BodyWrapper'
import { ImStack } from 'react-icons/im'
import AdminMetricBox from '../../components/AdminMetricBox';
import axios from 'axios';
import { store } from '../../store/root-reducer';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import { deleteUserData } from '../../store/actions/user-info';

const AdminMetrics = () => {

  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const [invoiceStatistics, setInvoiceStatistics] = useState<any>()
  const [schoolsStatistics, setSchoolsStatistics] = useState<any>()

  useEffect(() => {
    getInvoiceStatisticsHandler()
    getSchoolsStatisticsHandler()
  }, [userInfoData])

  const getInvoiceStatisticsHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/admin-invoice-statistics`, {
        params: {},
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${userInfoData.token}`,
        },
        timeout: 30000,
      });
      const resData = res.data;
      console.log(resData)
      if (resData.success == false) {
        return setInvoiceStatistics(resData)
      } else {
        setInvoiceStatistics(resData)
      }
    } catch (e: any) {
      console.log(e)
      if (e.code == "ECONNABORTED") {
        return setInvoiceStatistics({
          "success": false,
          "message": "Request timed out.",
        })
      } else
        if (e?.response?.data !== undefined) {
          const errorData = e.response.data;
          if (errorData.message == "Unauthenticated.") {
            store.dispatch(deleteUserData());
          }
          return setInvoiceStatistics({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        } else {
          const errorData = e.response.data;
          if (errorData.message == "Unauthenticated.") {
            store.dispatch(deleteUserData());
          }
          return setInvoiceStatistics({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        }

    }
  }

  const getSchoolsStatisticsHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/admin-schools-statistics`, {
        params: {},
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${userInfoData.token}`,
        },
        timeout: 30000,
      });
      const resData = res.data;
      console.log(resData)
      if (resData.success == false) {
        return setSchoolsStatistics(resData)
      } else {
        setSchoolsStatistics(resData)
      }
    } catch (e: any) {
      console.log(e)
      if (e.code == "ECONNABORTED") {
        return setSchoolsStatistics({
          "success": false,
          "message": "Request timed out.",
        })
      } else
        if (e?.response?.data !== undefined) {
          const errorData = e.response.data;
          return setSchoolsStatistics({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        } else {
          return setSchoolsStatistics({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        }
    }
  }

  return (
    <BodyWrapper title='Dashboard'>

      <Row className='admin-metric-row-1'>
        <Col md={'6'}>
          {invoiceStatistics?.success === false && !invoiceStatistics?.data
            &&
            <Alert className='form-feedback-message' variant={"danger"} dismissible>
              <div>{invoiceStatistics?.message}</div>
            </Alert>}
        </Col>

        <Col md={'6'}>
          {schoolsStatistics?.success === false && !schoolsStatistics?.data
            &&
            <Alert className='form-feedback-message' variant={"danger"} dismissible>
              <div>{schoolsStatistics?.message}</div>
            </Alert>}
        </Col>

        {invoiceStatistics?.data && <>
          <Col md={'3'}>
            <AdminMetricBox icon={<ImStack />} bgColor={'#F9DBBD'} title={'Pending Invoices'}
              value={invoiceStatistics.data.pendingInvoices} />
          </Col>
          <Col md={'3'}>
            <AdminMetricBox icon={<ImStack />} bgColor={'#FFA5AB'} title={'Paid Invoices'}
              value={invoiceStatistics.data.paidInvoices} />
          </Col></>}

        {schoolsStatistics?.data && <>
          <Col md={'3'}>
            <AdminMetricBox icon={<ImStack />} bgColor={'#BCB8B1'} title={'Active Schools'}
              value={schoolsStatistics.data.activeSchools} />
          </Col>
          <Col md={'3'}>
            <AdminMetricBox icon={<ImStack />} bgColor={'#495867'} title={'Suspended Schools'}
              value={schoolsStatistics.data.suspendedSchools} />
          </Col>
        </>}
      </Row>
    </BodyWrapper>
  )
}

AdminMetrics.propTypes = {}

export default AdminMetrics