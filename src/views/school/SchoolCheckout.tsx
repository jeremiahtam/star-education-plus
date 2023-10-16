import React, { ChangeEvent, useEffect, useState, useCallback } from 'react'
import BodyWrapper from '../../components/BodyWrapper'
import { Table, Button, Pagination, Form, Row, Col, InputGroup, Alert, Badge, Card } from 'react-bootstrap';
import CustomModal from '../../components/MembershipPlanModal';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateCart, stateLoggedInUserType } from '../../../types/type-definitions';
import { store } from '../../store/root-reducer';
import { removePackagesAndServices, removeResource } from '../../store/actions/shopping-cart';


function SchoolCheckout() {
  //cart items
  const cartResources = useSelector((state: stateCart) => state.cart.resources)
  const cartPackagesAndServices = useSelector((state: stateCart) => state.cart.packagesAndServices)
  const cartMembershipPlans = useSelector((state: stateCart) => state.cart.membershipPlan)

  return (
    <BodyWrapper title='Checkout'>

      <Row>
        <Col md={'8'}>
          <Card className='checkout-items-card'>
            <Card.Body>
              <Card.Title className='checkout-items-card-title'>Cart</Card.Title>
              <div className='checkout-items-card-border mb-3 mt-3'></div>

              {cartMembershipPlans.map((item: any, index: any) => {
                return (
                  <Card.Text className='checkout-items-card-list' key={index}>
                    <div>
                      <Card.Subtitle className="mb-2 checkout-items-card-text">{item.name}</Card.Subtitle>
                      <Card.Subtitle className="mb-2 checkout-items-card-sub-title">${item.amount}</Card.Subtitle>
                    </div>
                    <Button className='mb-3' variant='light'>Remove</Button>
                  </Card.Text>
                )
              })}

              {cartResources.map((item: any, index: any) => {
                return (
                  <Card.Text className='checkout-items-card-list' key={index}>
                    <div>
                      <Card.Subtitle className="mb-2 checkout-items-card-text">{item.name}</Card.Subtitle>
                      <Card.Subtitle className="mb-2 checkout-items-card-sub-title">${item.amount}</Card.Subtitle>
                    </div>
                    <Button className='mb-3' variant='light'
                      onClick={() => {
                        store.dispatch(removeResource(item))
                      }}
                    >Remove</Button>
                  </Card.Text>
                )
              })}

              {cartPackagesAndServices.map((item: any, index: any) => {
                return (
                  <Card.Text className='checkout-items-card-list' key={index}>
                    <div>
                      <Card.Subtitle className="mb-2 checkout-items-card-text">{item.name}</Card.Subtitle>
                      <Card.Subtitle className="mb-2 checkout-items-card-sub-title">${item.amount}</Card.Subtitle>
                    </div>
                    <Button className='mb-3' variant='light'
                      onClick={() => {
                        store.dispatch(removePackagesAndServices(item))
                      }}>Remove</Button>
                  </Card.Text>
                )
              })}

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