import { ChangeEvent, useEffect, useState, useCallback } from "react";
import BodyWrapper from "../../components/BodyWrapper";
import { IoMdSearch, IoMdCreate } from "react-icons/io";
import {
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Alert,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { stateLoggedInUserType } from "../../../types/type-definitions";
import CustomPagination from "../../components/CustomPagination";
import { MdOutlineClear } from "react-icons/md";
import { HiEye } from "react-icons/hi";
import InvoiceModal from "../../components/InvoiceModal";
import { deleteUserData } from "../../store/actions/user-info";
import { store } from "../../store/root-reducer";

function AdminInvoices() {
  const userInfoData = useSelector(
    (state: stateLoggedInUserType) => state.userInfo.loggedInUserData
  );
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  //Modal COntrol
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [modalType, setModalType] = useState<string | null>(null);
  const [modalDataContent, setModalDataContent] =
    useState<any>(null); /* modal dataId */

  const modalDataHandler = useCallback(
    (_dataContent: any, _modalType: string) => {
      handleShow();
      setModalDataContent(_dataContent);
      setModalType(_modalType);
      // console.log(`${_dataContent} ${_modalType}`)
    },
    [setModalType, setModalDataContent]
  );

  const [invoices, setInvoices] = useState<any>();

  // Pagination control
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  // Search
  const [search, setSearch] = useState<string>("");

  const getInvoicesHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/all-invoices`, {
        params: {
          search,
          itemsPerPage: itemsPerPage,
          page: page,
        },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${userInfoData.token}`,
        },
        timeout: 30000,
      });
      const resData = res.data;
      console.log(resData);
      if (resData.success === false) {
        return setInvoices(resData);
      } else {
        setInvoices(resData);
        setTotalPages(resData.pageInfo.totalPages);
      }
    } catch (e: any) {
      console.log(e);
      if (e.code === "ECONNABORTED") {
        return setInvoices({
          success: false,
          message: "Request timed out.",
        });
      } else if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        if (errorData.message === "Unauthenticated.") {
          store.dispatch(deleteUserData());
        }
        return setInvoices({
          success: false,
          message: "Error. Something went wrong.",
        });
      } else {
        const errorData = e.response.data;
        if (errorData.message === "Unauthenticated.") {
          store.dispatch(deleteUserData());
        }
        return setInvoices({
          success: false,
          message: "Error. Something went wrong.",
        });
      }
    }
  };

  useEffect(() => {
    if (search === "") {
      getInvoicesHandler();
    }
  }, [search]);

  useEffect(() => {
    getInvoicesHandler();
  }, [userInfoData, page, itemsPerPage]);

  return (
    <BodyWrapper title="Invoices">
      {/* <Breadcrumb>
        <Breadcrumb.Item onClick={() => {
          // navigate('/invoices')
        }}>
          Invoices
        </Breadcrumb.Item>
      </Breadcrumb> */}

      {invoices?.success === false && !invoices?.data && (
        <Alert className="form-feedback-message" variant={"danger"} dismissible>
          <div>{invoices?.message}</div>
        </Alert>
      )}

      {invoices?.data && (
        <>
          <div className="search-area mb-3">
            <Form>
              <Row className="justify-content-end">
                <Col md={4} sm={10} className="my-1 search-bar">
                  <Form.Label htmlFor="search" visuallyHidden>
                    Search
                  </Form.Label>
                  <InputGroup className="">
                    <InputGroup.Text>
                      <IoMdSearch size={24} />
                    </InputGroup.Text>
                    <Form.Control
                      id="search"
                      placeholder="Search"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setSearch(e.target.value);
                      }}
                      value={search}
                    />
                    {search !== "" && (
                      <InputGroup.Text
                        onClick={(e: any) => {
                          e.preventDefault();
                          setPage(1);
                          setSearch("");
                        }}
                        className="cancel-button"
                      >
                        <MdOutlineClear size={24} />
                      </InputGroup.Text>
                    )}
                    <Button
                      type="submit"
                      onClick={(e: any) => {
                        e.preventDefault();
                        setPage(1);
                        getInvoicesHandler();
                      }}
                      hidden
                    >
                      Search
                    </Button>
                  </InputGroup>
                </Col>
              </Row>
            </Form>
          </div>

          {invoices.data.length !== 0 && (
            <div className="table-responsive">
              <table className="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Invoice Number</th>
                    <th>School Name</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Payment Date</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.data.map((item: any, index: number) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.sn}</td>
                        <td>{item.invoiceNumber}</td>
                        <td>{item.schoolName}</td>
                        <td>
                          <div>{item.billingAddress}</div>
                        </td>
                        <td>
                          <Badge
                            bg={
                              item.status === "paid"
                                ? "success"
                                : item.status === "pending"
                                ? "info"
                                : "danger"
                            }
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td>
                          {item.deadlineDate} {item.deadlineTime}
                        </td>
                        <td>
                          {item.paymentDate} {item.paymentTime}
                        </td>
                        <td>
                          <HiEye
                            onClick={() =>
                              modalDataHandler(item, "view-invoice")
                            }
                          />
                        </td>
                        <td>
                          <IoMdCreate
                            onClick={() =>
                              modalDataHandler(item.id, "edit-invoice")
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {invoices.data.length === 0 && (
            <Alert
              className="form-feedback-message"
              variant={"info"}
              dismissible
            >
              <div>{invoices?.message}</div>
            </Alert>
          )}

          {invoices.data.length !== 0 && (
            <CustomPagination
              page={page}
              setPage={setPage}
              setItemsPerPage={setItemsPerPage}
              totalPages={totalPages}
            />
          )}
          {modalType && (
            <InvoiceModal
              show={show}
              handleClose={handleClose}
              handleShow={handleShow}
              modalType={modalType}
              modalDataContent={modalDataContent}
              getInvoicesHandler={() => getInvoicesHandler()}
            />
          )}
        </>
      )}
    </BodyWrapper>
  );
}

export default AdminInvoices;
