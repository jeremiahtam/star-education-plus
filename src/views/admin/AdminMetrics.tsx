import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Pagination, Form, Row, Col, InputGroup } from 'react-bootstrap';
import BodyWrapper from '../../components/BodyWrapper'
import { ImStack } from 'react-icons/im'
import AdminMetricBox from '../../components/AdminMetricBox';

const AdminMetrics = () => {
  return (
    <BodyWrapper title='Dashboard'>
      <Row className='admin-metric-row-1'>
        <Col md={'3'}>
          <AdminMetricBox icon={<ImStack />} bgColor={'#F9DBBD'} title={'Another Title'} value={'400'} />
        </Col>
        <Col md={'3'}>
          <AdminMetricBox icon={<ImStack />} bgColor={'#FFA5AB'} title={'Another Title'} value={'400'} />
        </Col>
        <Col md={'3'}>
          <AdminMetricBox icon={<ImStack />} bgColor={'#BCB8B1'} title={'Another Title'} value={'400'} />
        </Col>
        <Col md={'3'}>
          <AdminMetricBox icon={<ImStack />} bgColor={'#495867'} title={'Another Title'} value={'400'} />
        </Col>
      </Row>
    </BodyWrapper>
  )
}

AdminMetrics.propTypes = {}

export default AdminMetrics