import { useState, useRef, useEffect, useCallback } from "react";
import { Button, Modal, Row, Col, Table, Badge } from "react-bootstrap";
import axios from "axios";
import { AiOutlinePrinter } from "react-icons/ai";
import { useSelector } from "react-redux";
import { stateLoggedInUserType } from "../../types/type-definitions";
import SEPLogo from "../images/SEP-Logo-White-Final.png";
import ReactToPrint from "react-to-print";

function ViewInvoiceModal(props: any) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector(
    (state: stateLoggedInUserType) => state.userInfo.loggedInUserData
  );

  const pounds = Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });

  const componentRef = useRef(null);
  const invoiceData = props.modalDataContent;

  useEffect(() => {
    getItemsOnInvoice();
    console.log(invoiceData);
  },[]);

  const [selectedInvoiceItems, setSelectedInvoiceItems] = useState<any[]>([]);
  const [purchaseTotal, setPurchaseTotal] = useState<number>(0);

  const getItemsOnInvoice = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/get-ordered-items-by-invoice-id`,
        {
          params: {
            invoiceId: props.modalDataContent.id,
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
        }
      );

      const resData = res.data;
      console.log(resData.data);
      if (resData.success === false) {
      } else {
        setSelectedInvoiceItems(resData.data.invoiceItems);
        setPurchaseTotal(resData.data.purchaseTotal);
      }
    } catch (e: any) {
      console.log(e);
      if (e.code === "ECONNABORTED") {
      }
      if (e?.response?.data !== undefined) {
        // const errorData = e.response.data;
      }
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="invoice-body" ref={componentRef}>
          <div className="invoice-heading">
            <div className="left-heading">Invoice</div>
            <div className="right-heading">
              <img src={SEPLogo} alt="Star Education Plus Logo" />
            </div>
          </div>
          <Row className="invoice-row-two">
            <Col md={"3"} sm={"3"} className="item">
              <div className="title">Bill No</div>
              <div className="content">#{invoiceData.invoiceNumber}</div>
            </Col>
            <Col md={"3"} sm={"3"} className="item">
              <div className="title">Date Issued</div>
              <div className="content">{invoiceData.date}</div>
            </Col>
            <Col md={"3"} sm={"3"} className="item">
              <div className="title">
                Due On{" "}
                <Badge
                  bg={
                    invoiceData.status === "paid"
                      ? "success"
                      : invoiceData.status === "pending"
                      ? "info"
                      : "danger"
                  }
                >
                  {invoiceData.status}
                </Badge>
              </div>
              <div className="content">
                {invoiceData.deadlineDate} {invoiceData.deadlineTime}
              </div>
            </Col>
            <Col md={"3"} sm={"3"} className="item">
              <div className="title">Paid On:</div>
              <div className="content">
                {invoiceData.paymentDate} {invoiceData.paymentTime}
              </div>
            </Col>
          </Row>
          <Row className="invoice-row-three">
            <Col md={"6"} sm={"6"} className="item">
              <div className="title">Bill From</div>
              <div className="content">Manningham Ln, Bradford BD8 7ER</div>
            </Col>
            <Col md={"6"} sm={"6"} className="item">
              <div className="title">Bill To</div>
              <div className="content">{invoiceData.billingAddress}</div>
            </Col>
          </Row>
          <Row className="invoice-row-four">
            <Col md={"12"} sm={"12"} className="item">
              <div className="title">Bill From</div>
              <div className="content">
                <Table size="sm" bordered hover variant="">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoiceItems.map((item, index) => {
                      let amount = pounds.format(item.itemAmount);
                      return (
                        <tr key={item.id}>
                          <td>{item.itemName}</td>
                          <td>{item.itemCategory}</td>
                          <td>{amount}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan={2}>Total</td>
                      <td>{pounds.format(purchaseTotal)}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
          <Row className="invoice-row-five">
            <Col md={"12"} sm={"12"} className="item">
              <div className="title">Note</div>
              <div className="content">
                Make payments to Star Education Plus Ltd with account number
                87249014 and sort code 60-83-71 . Then send your proof of
                payment to info@stareducationplus.org.uk
              </div>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-custom-outline" onClick={props.handleClose}>
          Close
        </Button>
        <ReactToPrint
          documentTitle={"Receipt"}
          trigger={() => (
            <Button className="btn-custom">
              <AiOutlinePrinter /> Print
            </Button>
          )}
          content={() => componentRef.current}
        />
      </Modal.Footer>
    </>
  );
}

export default ViewInvoiceModal;
