import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Document, Page, pdfjs } from "react-pdf";
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { deleteUserData } from '../store/actions/user-info';
import { store } from '../store/root-reducer';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface ViewResourcesDocsModalPropType {
  modalDataContent: {
    id: number,
    documentName: string,
    nameInStorage: string,
  },
  handleClose: any,
}

function ViewResourcesDocsModal(props: ViewResourcesDocsModalPropType) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const [pdf, setPdf] = useState<any>(null)

  useEffect(() => {
    downloadFileHandler(props.modalDataContent.nameInStorage, props.modalDataContent.documentName)
  }, [])

  const downloadFileHandler = async (fileName: string, saveFileName: string) => {
    try {
      const res = await axios.get(`${baseUrl}/api/download-resources-file/${fileName}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
          validateStatus: (s) => s <= 500,
        });
      const resData = res.data;
      console.log(resData)
      setPdf(resData)
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        if (errorData.message == "Unauthenticated.") {
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
        <div className='pdf-view-box'>
          {pdf !== null && <Document
            file={pdf}
            onContextMenu={(e) => e.preventDefault()}
            className="pdf-container"
          >
            <Page pageNumber={1} />
          </Document>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-custom-outline" onClick={props.handleClose}>Close</Button>
      </Modal.Footer>
    </>
  )
}

export default ViewResourcesDocsModal
