import React, { useState } from 'react'
import { Link } from "react-router-dom";
import BodyWrapper from '../../components/BodyWrapper'
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Table, Button, Pagination, Modal } from 'react-bootstrap';

function AdminSchools() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <BodyWrapper title='Schools' rightHandSide={<button className='btn btn-primary btn-sm'
      onClick={() => handleShow()}>ADD NEW</button>}>
      <div className="table-responsive">
        <table className='table table-hover table-sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Body</th>
              <th></th>
              <th></th>

            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Sample Topic</td>
              <td>Sample Body/Content</td>
              <td><IoMdTrash /></td>
              <td><Link to='/admin-dashboard/schools/:userId'><IoMdCreate /></Link></td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination className='float-end'>
        <Pagination.First />
        <Pagination.Prev />
        <Pagination.Item active>{12}</Pagination.Item>
        <Pagination.Next />
        <Pagination.Last />
      </Pagination>

      <Modal show={show} onHide={handleClose} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

    </BodyWrapper>
  )
}

export default AdminSchools
