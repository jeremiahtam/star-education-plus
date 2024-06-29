import { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { stateLoggedInUserType } from "../../types/type-definitions";
import { deleteUserData } from "../store/actions/user-info";
import { store } from "../store/root-reducer";

interface ViewResourcesDocsModalPropType {
  modalDataContent: {
    id: number;
    documentName: string;
    documentLink: string;
  };
  handleClose: any;
}

function ViewResourcesDocsModal(props: ViewResourcesDocsModalPropType) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector(
    (state: stateLoggedInUserType) => state.userInfo.loggedInUserData
  );

  useEffect(() => {
    resourcesDoucmentHandler();
  });

  const resourcesDoucmentHandler = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/get-resources-document-by-id`,
        {
          params: {
            id: props.modalDataContent.id,
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
    } catch (e: any) {
      console.log(e);
      if (e.code === "ECONNABORTED") {
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        if (errorData.message === "Unauthenticated.") {
          store.dispatch(deleteUserData());
        }
      }
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{props.modalDataContent.documentName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="pdf-view-box">
          <iframe
            title={props.modalDataContent.documentName}
            style={{ height: "90vh", width: "100%" }}
            src={props.modalDataContent.documentLink}
          ></iframe>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-custom-outline" onClick={props.handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </>
  );
}

export default ViewResourcesDocsModal;
