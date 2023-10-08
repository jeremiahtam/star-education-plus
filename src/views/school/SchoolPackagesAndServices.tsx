import React from 'react'
import BodyWrapper from '../../components/BodyWrapper'
import { Badge, Button, Card, Col, Row } from 'react-bootstrap'
import { FaOpencart } from 'react-icons/fa'
import { BiPackage } from 'react-icons/bi'

function SchoolPackagesAndServices() {
  return (
    <BodyWrapper title='Packages and Services'>
      <Row className='card-items-row'>
        <Col lg={3} md={4} className='mb-3'>
          <Card style={{
            // width: '18rem'
          }} className='price-card'>
            <Card.Body>
              <Card.Subtitle className="mb-2 price-card-sub-title">
                <BiPackage /> School Audit
              </Card.Subtitle>
              <Card.Title className='price-card-title'>$34</Card.Title>
              {/* <Card.Text className='text-warning'>Text</Card.Text> */}
              <div className='price-card-border mb-3 mt-3'></div>
              <Card.Text className='price-card-text'>
                This is a plan that is capable of giving you access to...
                <Card.Link> view more.</Card.Link>
              </Card.Text>
              <div className='price-card-border mb-3 mt-3'></div>
              <Button className='btn-block mb-3 form-control btn-custom'>
                <FaOpencart /> Purchase
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={4} className='mb-3'>
          <Card style={{
            // width: '18rem'
          }} className='price-card'>
            <Card.Body>
              <Card.Subtitle className="mb-2 price-card-sub-title">
                <BiPackage /> School Audit
              </Card.Subtitle>
              <Card.Title className='price-card-title'>$34</Card.Title>
              {/* <Card.Text className='text-warning'>Text</Card.Text> */}
              <div className='price-card-border mb-3 mt-3'></div>
              <Card.Text className='price-card-text'>
                This is a plan that is capable of giving you access to...
                <Card.Link> view more.</Card.Link>
              </Card.Text>
              <div className='price-card-border mb-3 mt-3'></div>
              <Button className='btn-block mb-3 form-control btn-custom'>
                <FaOpencart /> Purchase
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={4} className='mb-3'>
          <Card style={{
            // width: '18rem'
          }} className='price-card'>
            <Card.Body>
              <Card.Subtitle className="mb-2 price-card-sub-title">
                <BiPackage /> School Audit
              </Card.Subtitle>
              <Card.Title className='price-card-title'>$34</Card.Title>
              {/* <Card.Text className='text-warning'>Text</Card.Text> */}
              <div className='price-card-border mb-3 mt-3'></div>
              <Card.Text className='price-card-text'>
                This is a plan that is capable of giving you access to...
                <Card.Link> view more.</Card.Link>
              </Card.Text>
              <div className='price-card-border mb-3 mt-3'></div>
              <Button className='btn-block mb-3 form-control btn-custom'>
                <FaOpencart /> Purchase
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={4} className='mb-3'>
          <Card style={{
            // width: '18rem'
          }} className='price-card'>
            <Card.Body>
              <Card.Subtitle className="mb-2 price-card-sub-title">
                <BiPackage /> School Audit
              </Card.Subtitle>
              <Card.Title className='price-card-title'>$34</Card.Title>
              {/* <Card.Text className='text-warning'>Text</Card.Text> */}
              <div className='price-card-border mb-3 mt-3'></div>
              <Card.Text className='price-card-text'>
                This is a plan that is capable of giving you access to...
                <Card.Link> view more.</Card.Link>
              </Card.Text>
              <div className='price-card-border mb-3 mt-3'></div>
              <Button className='btn-block mb-3 form-control btn-custom'>
                <FaOpencart /> Purchase
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </BodyWrapper>
  )
}

export default SchoolPackagesAndServices