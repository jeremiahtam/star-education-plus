import React, { ChangeEvent, useEffect, useState, useCallback } from 'react'
import { Table, Button, Pagination, Form, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import AdminResourcesDocsModal from '../../components/AdminResourcesDocsModal';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import CustomPagination from '../../components/CustomPagination';
import { MdOutlineClear } from 'react-icons/md';
import { HiTrash } from 'react-icons/hi';
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { BsCloudUpload, BsEye } from 'react-icons/bs'; import BodyWrapper from '../../components/BodyWrapper'
import { IoIosAdd, IoMdCreate, IoMdDownload, IoMdSearch } from 'react-icons/io';
import fileDownload from 'js-file-download'

function AdminResourcesAttendance() {
  const location = useLocation()

  const { resourcesId } = useParams()
  const navigate = useNavigate()
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  //Modal COntrol
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [modalType, setModalType] = useState<string | null>(null);
  const [modalDataId, setModalDataId] = useState<number | null>(null) /* modal dataId */

  const modalDataHandler = useCallback((_dataId: number, _modalType: string) => {
    handleShow()
    setModalDataId(_dataId)
    setModalType(_modalType)
    console.log(`${_dataId} ${_modalType}`)
  }, [setModalType, setModalDataId])

  const [resourcesDocs, setResourcesDocs] = useState<any>()

  // Pagination control
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(2)
  const [totalPages, setTotalPages] = useState<number | null>(null)
  // Search 
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    if (search === '') {
      getResourcesDocsHandler()
    }
  }, [search])

  useEffect(() => {
    getResourcesDocsHandler()
  }, [userInfoData, page, itemsPerPage])

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
      const extension = fileName.split('.').pop();
      fileDownload(resData, `${saveFileName}.${extension}`)
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        // setResourcesDocs(null)
      }
    }
  };


  const getResourcesDocsHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/all-resources-documents`, {
        params: {
          search,
          itemsPerPage,
          page,
          resourcesId
        },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${userInfoData.token}`,
        },
        timeout: 30000,
      });
      const resData = res.data;
      console.log(resData)
      if (resData.success == false) {
        return setResourcesDocs(resData)
      } else {
        setResourcesDocs(resData)
        setTotalPages(resData.pageInfo.totalPages)
      }
    } catch (e: any) {
      console.log(e)
      if (e.code == "ECONNABORTED") {
        return setResourcesDocs({
          "success": false,
          "message": "Request timed out.",
        })
      } else
        if (e?.response?.data !== undefined) {
          const errorData = e.response.data;
          return setResourcesDocs({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        } else {
          return setResourcesDocs({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        }
    }
  }
  return (
    <></>
    // <BodyWrapper title={'Resources Documents'} rightHandSide={resourcesDocs?.data &&
    //   <button className='btn btn-custom btn-sm'
    //     onClick={() => {
    //       setModalType('add-resources-docs')
    //       handleShow()
    //     }}>Create New <IoIosAdd className='btn-icon' /></button>}>

    //   {location?.state !== null &&
    //     <div className=''>{location.state.category} | {location.state.data.name}</div>}

    //   {resourcesDocs?.success === false && !resourcesDocs?.data &&
    //     <Alert className='form-feedback-message' variant={"danger"} dismissible>
    //       <div>{resourcesDocs?.message}</div>
    //     </Alert>}

    //   {resourcesDocs?.data &&
    //     <>
    //       <div className='search-area mb-3'>
    //         <Form>
    //           <Row className="justify-content-end">
    //             <Col md={4} sm={10} className="my-1 search-bar">
    //               <Form.Label htmlFor="search" visuallyHidden>
    //                 Search
    //               </Form.Label>
    //               <InputGroup className=''>
    //                 <InputGroup.Text><IoMdSearch size={24} /></InputGroup.Text>
    //                 <Form.Control id="search" placeholder="Search"
    //                   onChange={(e: ChangeEvent<HTMLInputElement>) => {
    //                     setSearch(e.target.value)
    //                   }} value={search} />
    //                 {search !== '' &&
    //                   <InputGroup.Text onClick={(e: any) => {
    //                     e.preventDefault()
    //                     setPage(1)
    //                     setSearch('')
    //                   }} className='cancel-button' >
    //                     <MdOutlineClear size={24} />
    //                   </InputGroup.Text>}
    //                 <Button type="submit" onClick={(e: any) => {
    //                   e.preventDefault()
    //                   setPage(1)
    //                   getResourcesDocsHandler()
    //                 }} hidden>Search</Button>
    //               </InputGroup>
    //             </Col>
    //           </Row>
    //         </Form>
    //       </div>
    //       {resourcesDocs.data.length !== 0 &&
    //         <div className="table-responsive">
    //           <table className='table table-hover table-sm'>
    //             <thead>
    //               <tr>
    //                 <th>No.</th>
    //                 <th>Document Name</th>
    //                 <th></th>
    //                 <th></th>
    //                 <th></th>
    //               </tr>
    //             </thead>
    //             <tbody>
    //               {resourcesDocs.data.map((item: any, index: number) => {
    //                 return (
    //                   <tr key={item.id}>
    //                     <td>{item.sn}</td>
    //                     <td>{item.documentName}</td>
    //                     <td>
    //                       <IoMdDownload
    //                         onClick={() => downloadFileHandler(item.nameInStorage, item.documentName)}
    //                       />
    //                     </td>
    //                     <td ><IoMdCreate onClick={() => {
    //                       modalDataHandler(item.id, 'edit-resources-docs')
    //                     }} /></td>
    //                     <td><HiTrash onClick={() => {
    //                       modalDataHandler(item.id, 'delete-resources-docs')
    //                     }} /></td>
    //                   </tr>
    //                 )
    //               })}
    //             </tbody>
    //           </table>
    //         </div>}

    //       {resourcesDocs.data.length == 0 &&
    //         <Alert className='form-feedback-message' variant={"info"} dismissible>
    //           <div>{resourcesDocs?.message}</div>
    //         </Alert>}

    //       {resourcesDocs.data.length !== 0 &&
    //         <CustomPagination page={page} setPage={setPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />}
    //       {modalType && <AdminResourcesDocsModal show={show} handleClose={handleClose} handleShow={handleShow}
    //         modalType={modalType} modalDataId={modalDataId} resourcesId={resourcesId}
    //         loadResourcesDocs={getResourcesDocsHandler} />}
    //     </>
    //   }
    // </BodyWrapper>
  )
}

AdminResourcesAttendance.propTypes = {}

export default AdminResourcesAttendance
