import React from 'react'
import BodyWrapper from '../../components/BodyWrapper'
import { Badge, Button, Card, Col, Row } from 'react-bootstrap'
import { FaOpencart } from 'react-icons/fa'
import { BiPackage } from 'react-icons/bi'
import { Link } from 'react-router-dom'

function SchoolMetrics() {
  return (
    <BodyWrapper title='Dashboard'>
      <Row className='card-items-row'>
        <Col lg={7} md={6} className='mb-3'>
          <Card className='dashboard-broadcasts-card'>
            <Card.Header>Broadcasts</Card.Header>
            <Card.Body>
              <div className='broadcast-item'>
                <Card.Title>Primary Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Card.Text>
              </div>
              <div className='broadcast-item unread'>
                <Card.Title>Primary Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Card.Text>
              </div>
            </Card.Body>
            <Card.Footer>
              <Link to={'/broadcasts'}>
                See all broadcasts
              </Link>
            </Card.Footer>
          </Card>

        </Col>
      </Row>
    </BodyWrapper>
  )
}

export default SchoolMetrics