import { ChangeEvent, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import BodyWrapper from "../../components/BodyWrapper";
import { IoMdSearch, IoMdCreate, IoIosAdd } from "react-icons/io";
import { Button, Form, Row, Col, InputGroup, Alert } from "react-bootstrap";
import AdminResourcesModal from "../../components/AdminResourcesModal";
import axios from "axios";
import { useSelector } from "react-redux";
import { stateLoggedInUserType } from "../../../types/type-definitions";
import CustomPagination from "../../components/CustomPagination";
import { MdOutlineClear } from "react-icons/md";
import { HiTrash } from "react-icons/hi";
import { BsEye } from "react-icons/bs";
import { deleteUserData } from "../../store/actions/user-info";
import { store } from "../../store/root-reducer";

function AdminResources() {
  const pounds = Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector(
    (state: stateLoggedInUserType) => state.userInfo.loggedInUserData
  );

  //Modal COntrol
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [modalType, setModalType] = useState<string | null>(null);
  const [modalDataId, setModalDataId] = useState<number | null>(
    null
  ); /* modal dataId */

  const modalDataHandler = useCallback(
    (_dataId: number, _modalType: string) => {
      handleShow();
      setModalDataId(_dataId);
      setModalType(_modalType);
      console.log(`${_dataId} ${_modalType}`);
    },
    [setModalType, setModalDataId]
  );

  // Pagination control
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  // Search
  const [search, setSearch] = useState<string>("");

  // resources
  const [selectedResources, setSelectedResources] = useState<any>(null);

  const getResourcesHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/all-resources`, {
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
        return setSelectedResources(resData);
      } else {
        setSelectedResources(resData);
        setTotalPages(resData.pageInfo.totalPages);
      }
    } catch (e: any) {
      console.log(e);
      if (e.code === "ECONNABORTED") {
        const errorData = e.response.data;
        if (errorData.message === "Unauthenticated.") {
          store.dispatch(deleteUserData());
        }
        return setSelectedResources({
          success: false,
          message: "Request timed out.",
        });
      } else if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        if (errorData.message === "Unauthenticated.") {
          store.dispatch(deleteUserData());
        }
        return setSelectedResources({
          success: false,
          message: "Error. Something went wrong.",
        });
      } else {
        return setSelectedResources({
          success: false,
          message: "Error. Something went wrong.",
        });
      }
    }
  };

  useEffect(() => {
    if (selectedResources !== null) {
      getResourcesHandler();
    }
  }, [userInfoData, page, itemsPerPage]);

  useEffect(() => {
    getResourcesHandler();
  }, [userInfoData]);

  useEffect(() => {
    if (selectedResources !== null) {
      if (search === "") {
        getResourcesHandler();
      }
    }
  }, [search]);

  return (
    <BodyWrapper
      title={"Resources"}
      rightHandSide={
        selectedResources?.data && (
          <button
            className="btn btn-custom btn-sm"
            onClick={() => {
              setModalType("add-resources");
              handleShow();
            }}
          >
            Create New <IoIosAdd className="btn-icon" />
          </button>
        )
      }
    >
      {selectedResources?.success === false && !selectedResources?.data && (
        <Alert className="form-feedback-message" variant={"danger"} dismissible>
          <div>{selectedResources?.message}</div>
        </Alert>
      )}

      {selectedResources?.data && (
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
                        getResourcesHandler();
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
          {selectedResources.data.length !== 0 && (
            <div className="table-responsive">
              <table className="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Resource Name</th>
                    <th>Content</th>
                    <th>Amount</th>
                    <th>Duration (Days)</th>
                    <th>Status</th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedResources.data.map((item: any, index: any) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.sn}</td>
                        <td>{item.name}</td>
                        <td>{item.resourcesContent}</td>
                        <td>{pounds.format(item.amount)}</td>
                        <td>{item.duration == null ? "-" : item.duration}</td>
                        <td>{item.status}</td>
                        <td>
                          <Link
                            to={`/resources/resources-document-upload/${item.id}`}
                            state={{ data: item }}
                          >
                            <BsEye />
                          </Link>
                        </td>
                        <td>
                          <IoMdCreate
                            onClick={() => {
                              modalDataHandler(item.id, "edit-resources");
                            }}
                          />
                        </td>
                        <td>
                          <HiTrash
                            onClick={() => {
                              modalDataHandler(item.id, "delete-resources");
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {selectedResources.data.length === 0 && (
            <Alert
              className="form-feedback-message"
              variant={"info"}
              dismissible
            >
              <div>{selectedResources?.message}</div>
            </Alert>
          )}
          {selectedResources.data.length !== 0 && (
            <CustomPagination
              page={page}
              setPage={setPage}
              setItemsPerPage={setItemsPerPage}
              totalPages={totalPages}
            />
          )}
          {modalType && (
            <AdminResourcesModal
              show={show}
              handleClose={handleClose}
              handleShow={handleShow}
              modalType={modalType}
              modalDataId={modalDataId}
              loadResourcesDocs={getResourcesHandler}
            />
          )}
        </>
      )}
    </BodyWrapper>
  );
}
export default AdminResources;
