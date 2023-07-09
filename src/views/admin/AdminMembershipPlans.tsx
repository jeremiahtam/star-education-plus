import React from 'react'
import BodyWrapper from '../../components/BodyWrapper'
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Table, Button, Pagination, Form, Row, Col, InputGroup } from 'react-bootstrap';

function AdminMembershipPlans() {
  return (
    <BodyWrapper title='Membership Plans'>
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
              <td><IoMdTrash/></td>
              <td><IoMdCreate/></td>
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
    </BodyWrapper>
  )
}

export default AdminMembershipPlans
