import React, { useState, useRef } from 'react'
import { Link } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Button, Modal, Form, Alert, Row, Col, Table } from 'react-bootstrap';
import CustomModal from './BroadcastModal';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { AiOutlinePrinter } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';
import SEPLogo from '../images/SEP-Logo-White-Final.png'
import ReactToPrint from 'react-to-print';

function ViewInvoiceModal(props: any) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  // const invoiceDataHandler = async (
  //   values: any,
  //   setSubmitting: any,
  //   setErrors: any
  // ) => {
  //   // try {
  //   //   const res = await axios.post(
  //   //     `${baseUrl}/api/create-broadcast`,
  //   //     values,
  //   //     {
  //   //       headers: {
  //   //         Accept: "application/json",
  //   //         Authorization: `Bearer ${userInfoData.token}`,
  //   //       },
  //   //       timeout: 30000,
  //   //     }
  //   //   );

  //   //   const resData = res.data;
  //   //   console.log(resData);
  //   //   if (resData.success == false) {
  //   //     if (resData.errors !== undefined) {
  //   //       setErrors(resData.errors);
  //   //     } else {

  //   //     }
  //   //   } else {
  //   //     props.handleClose()
  //   //     props.loadBroadcast()
  //   //   }
  //   // } catch (e: any) {
  //   //   console.log(e);
  //   //   if (e.code == "ECONNABORTED") {

  //   //   }
  //   //   if (e?.response?.data !== undefined) {
  //   //     const errorData = e.response.data;
  //   //     setErrors(errorData.errors);
  //   //   }
  //   // }
  //   setSubmitting(false);
  // };

  const componentRef = useRef(null);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="invoice-body" ref={componentRef}>
          <div className="invoice-heading">
            <div className="left-heading">Inovoice</div>
            <div className="right-heading">
              <img src={SEPLogo} />
            </div>
          </div>
          <Row className='invoice-row-two'>
            <Col md={'3'} sm={'3'} className='item'>
              <div className='title'>Bill No</div>
              <div className='content'>#123456</div>
            </Col>
            <Col md={'3'} sm={'3'} className='item'>
              <div className='title'>Date Issued</div>
              <div className='content'>Title</div>
            </Col>
            <Col md={'3'} sm={'3'} className='item'>
              <div className='title'>Due On</div>
              <div className='content'>Title</div>
            </Col>
          </Row>
          <Row className='invoice-row-three'>
            <Col md={'6'} sm={'6'} className='item'>
              <div className='title'>Bill From</div>
              <div className='content'>
                Stareducationplus
                7 Peckan bolverd, West ham,
                United Kingdom 55590
              </div>
            </Col>
            <Col md={'6'} sm={'6'} className='item'>
              <div className='title'>Bill To</div>
              <div className='content'>
                London High girls college
                5, packam estate, west London
                United Kingdom 77900
              </div>
            </Col>
          </Row>
          <Row className='invoice-row-four'>
            <Col md={'12'} sm={'12'} className='item'>
              <div className='title'>Bill From</div>
              <div className='content'>
                <Table size='sm' bordered hover variant="">
                  <thead>
                    <tr>
                      <th>Bill Name</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Packages/Services</td>
                      <td>Plumbing</td>
                      <td>2344</td>
                    </tr>
                    <tr>
                      <td>Packages/Services</td>
                      <td>Plumbing</td>
                      <td>2344</td>
                    </tr>
                    <tr>
                      <td colSpan={2}>Total</td>
                      <td>34000</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
          <Row className='invoice-row-five'>
            <Col md={'12'} sm={'12'} className='item'>
              <div className='title'>Note</div>
              <div className='content'>
                Make payments to Wema Bank with account number 1198708179 and send your proof of payment to billing@website.com
              </div>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-custom-outline" onClick={props.handleClose}>Close</Button>
        <ReactToPrint
          documentTitle={'Receipt'}
          trigger={() => <Button className="btn-custom">
            <AiOutlinePrinter />  Print
          </Button>}
          content={() => componentRef.current}
        />

      </Modal.Footer>
    </>
  )
}

export default ViewInvoiceModal
