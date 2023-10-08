// import React, { ChangeEvent, useEffect, useState, useCallback } from 'react'
// import { Link } from "react-router-dom";
import BodyWrapper from '../../components/BodyWrapper'
// import { IoMdSearch, IoMdTrash, IoMdCreate, IoIosAdd } from "react-icons/io";
import { Table, Button, Pagination, Form, Row, Col, InputGroup, Alert, Badge, Card } from 'react-bootstrap';
// import AddMembershipPlanModal from '../../components/AddMembershipPlanModal';
// import CustomModal from '../../components/MembershipPlanModal';
// import axios from 'axios';
// import { useSelector } from 'react-redux'
// import { stateLoggedInUserType } from '../../../types/type-definitions';
// import CustomPagination from '../../components/CustomPagination';
// import { MdOutlineClear } from 'react-icons/md';
// import { HiEye, HiTrash } from 'react-icons/hi';
// import InvoiceModal from '../../components/InvoiceModal';


function SchoolCheckout() {
  return (
    <BodyWrapper title='Checkout'>

      <Row>
        <Col md={'8'}>
          <Card className='checkout-items-card'>
            <Card.Body>
              <Card.Title className='checkout-items-card-title'>Cart</Card.Title>
              <div className='checkout-items-card-border mb-3 mt-3'></div>
              <Card.Text className='checkout-items-card-list'>
                <div>
                  <Card.Subtitle className="mb-2 checkout-items-card-text">Item Name</Card.Subtitle>
                  <Card.Subtitle className="mb-2 checkout-items-card-sub-title">$3400</Card.Subtitle>
                </div>
                <Button className='mb-3' variant='light'>Remove</Button>
              </Card.Text>
              <Card.Text className='checkout-items-card-list'>
                <div>
                  <Card.Subtitle className="mb-2 checkout-items-card-text">Item Name</Card.Subtitle>
                  <Card.Subtitle className="mb-2 checkout-items-card-sub-title">$3400</Card.Subtitle>
                </div>
                <Button className='mb-3' variant='light'>Remove</Button>
              </Card.Text>
              <div className='checkout-items-card-border mb-3 mt-3'></div>
              <Card.Subtitle className="mb-2 checkout-items-card-sub-title">Address</Card.Subtitle>
              <Card.Text className='checkout-items-card-text'>
                23, Solomon Street, England
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={'4'}>
          <Card className='checkout-card'>
            <Card.Body>
              <Card.Subtitle className="mb-2 checkout-card-sub-title">
                {/* <BiPackage /> School Audit */}
              </Card.Subtitle>
              <Card.Subtitle className="mb-2 checkout-card-sub-title">Total</Card.Subtitle>
              <div className='checkout-card-border mb-3 mt-3'></div>
              <Card.Title className='checkout-card-title'>$3400</Card.Title>
              <div className='checkout-card-border mb-3 mt-3'></div>
              <Button className='btn-block mb-3 form-control btn-custom'>
                Generate Invoice
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </BodyWrapper>
  )
}

export default SchoolCheckout