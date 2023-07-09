import React, { ReactNode } from 'react'
import { Table, Button, Pagination, Form, Row, Col, InputGroup } from 'react-bootstrap';

interface CustomPaginationPropType {
  page: number,
  totalPages: ReactNode,
  setPage: Function,
}

function CustomPagination(props: CustomPaginationPropType) {

  const arr = [...Array(props.totalPages)]

  return (
    <Pagination className='float-end'>
      <Pagination.Prev disabled={props.page == 1 ? true : false} onClick={() => props.setPage(props.page - 1)} />
      {arr.map((item, index) => {
        if ((index + 1) < props.page && (index + 1) < 4) {
          return <Pagination.Item key={index + 1} onClick={() => props.setPage(index + 1)}>{index + 1}</Pagination.Item>
        }
      })}
      <Pagination.Item active>{props.page}</Pagination.Item>
      {arr.map((item, index) => {
        if ((index + 1) > props.page && (index + 1) < 4) {
          return <Pagination.Item key={index + 1} onClick={() => props.setPage(index + 1)}>{index + 1}</Pagination.Item>
        }
      })}
      <Pagination.Next disabled={props.page == props.totalPages ? true : false} onClick={() => props.setPage(props.page + 1)} />
    </Pagination>
  )
}
export default CustomPagination
