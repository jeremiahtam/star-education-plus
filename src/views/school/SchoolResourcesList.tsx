import React from 'react'
import BodyWrapper from '../../components/BodyWrapper'
import { Badge, Button, Card, Col, Row } from 'react-bootstrap'
import { AiOutlineFilePdf } from 'react-icons/ai'
import { BiPackage } from 'react-icons/bi'

function SchoolResourcesList() {
  return (
    <BodyWrapper title='Resources'>
      <Row className='card-items-row'>
        <Col lg={3} md={4} className='mb-3'>
          <AiOutlineFilePdf size={40}/>
        </Col>
        <Col lg={3} md={4} className='mb-3'>
        </Col>

      </Row>
    </BodyWrapper>
  )
}

export default SchoolResourcesList