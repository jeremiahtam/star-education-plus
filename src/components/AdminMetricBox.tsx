import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Pagination, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { ImStack } from 'react-icons/im'


export default function AdminMetricBox(props: any) {
  return (
    <div className='metric-box'>
      <div className='left-side' style={{ backgroundColor: props.bgColor }}>
        {props.icon}
      </div>
      <div className='right-side'>
        <div className='metric-title'>{props.title}</div>
        <div className='metric-value'>{props.value}</div>
      </div>
    </div>
  )
}
