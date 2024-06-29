import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { stateLoggedInUserType } from "../../types/type-definitions";
import { useEffect, useState } from "react";

interface DeleteResourcesModalPropType {
  modalDataId: number;
  handleClose: any;
  loadResources: any;
}

function DeleteResourcesModal(props: DeleteResourcesModalPropType) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector(
    (state: stateLoggedInUserType) => state.userInfo.loggedInUserData
  );

  const [deletePossibility, setDeletePossibility] = useState<boolean | string>(
    ""
  );

  const checkDeletePossibilityHandler = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/get-ordered-resource-rows-by-id`,
        {
          params: {
            resourceItemId: props.modalDataId,
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
        }
      );

      const resData = res.data;
      console.log(resData);
      if (resData.success === false) {
      } else {
        if (resData.data === 0) {
          setDeletePossibility(true);
        }
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

  useEffect(() => {
    checkDeletePossibilityHandler();
  });

  const deleteResourcesHandler = async () => {
    try {
      const res = await axios.put(
        `${baseUrl}/api/delete-resources/${props.modalDataId}`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
        }
      );
      const resData = res.data;
      console.log(resData);
      if (resData.success === true) {
        props.handleClose();
        props.loadResources();
      } else {
      }
    } catch (e: any) {
      console.log(e);
      // setShowLoadMoreSpinner(false)
      // setPageLoaded(true)
      if (e.code === "ECONNABORTED") {
        // showToast("default", "Timeout. Try again.");
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        if (errorData.message === "Unauthenticated") {
        }
      }
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Delete Resource</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>Do you want to delete this resource?</div>
        {deletePossibility === false && (
          <div className="text-danger">
            This resource is currently used in other sections. Deleting this
            record means any customer who has purchased it before will no longer
            see it in his records such as Resources Documents, Invoices, etc.
            Proceed if you are okay with these conditions.
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-custom-outline" onClick={props.handleClose}>
          Close
        </Button>
        <Button
          className="btn-custom"
          // disabled={!deletePossibility}
          onClick={() => {
            // if (deletePossibility) {
            deleteResourcesHandler();
            // }
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
}

export default DeleteResourcesModal;
