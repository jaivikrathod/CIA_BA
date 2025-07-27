import React from 'react'
import { FaUpload, FaTimes } from "react-icons/fa";
import MediaUploadModal from '../UploadDoc/MediaUploadModal';
import { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useApi from '../../api/axios';
import { useSelector } from 'react-redux';


export default function uploadInsuranceDoc() {

  const [uploadModal, setUploadModal] = useState({ show: false, id: null });
  const [documents, setdocuments] = useState([]);
  const { id } = useParams();
  const axios = useApi();
  const api = useSelector((state) => state.apiUrl);
  const navigate = useNavigate();
  useEffect(() => {
    fetchInsuranceDocuments();
  }, []);

  const openUploadModal = () => {
    setUploadModal({ show: true, id });
  };

  const closeUploadModal = (response) => {
    setUploadModal({ show: false });
    fetchInsuranceDocuments();
  };

  const fetchInsuranceDocuments = async () => {

    try {
      const response = await axios.get(`/particular-insurance-document`, {
        params: { id }
      });

      let data = JSON.parse(response.data.data.documents);
      setdocuments(data);
    } catch (error) {
      console.log(error);

      toast.error("Failed to fetch insurance details");
    }
  };

  return (
    <>

      <div className='d-flex align-items-center'>
        <span>Upload Document</span>
        <button
          onClick={() => openUploadModal()}
          className="btn btn-link"
          title="Upload"
        >
          <FaUpload />
        </button>
      </div>
      <div className="d-flex gap-5 flex-wrap">
        {documents?.length > 0 && documents.map((doc, docIndex) => (
          <>
            <div key={docIndex} className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center" >
                    {doc.name.toLowerCase().endsWith('.pdf') ? (
                      // <FaFilePdf className="text-danger me-2" size={28} />
                      <div className="position-relative">
                        <img
                          src={pdf2}
                          alt={doc.type}
                          className="img-thumbnail me-2"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />

                      </div>
                    ) : (
                      <>
                        <div className="position-relative">
                          <img
                            src={`${api}/get-insurance-docs/${doc.name}`}
                            alt={doc.type}
                            className="img-thumbnail me-2"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />

                        </div>
                      </>
                    )}
                    <div>
                      <h6 className="card-title mb-0">{doc.type}</h6>
                      {/* <small className="text-muted">{doc.name}</small> */}
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-primary mt-2"
                    onClick={() => handleDocumentClick(doc)}
                  >
                    View Document
                  </button>
                  <div className="ms-3">
                    <div
                      className="d-flex justify-content-center align-items-center rounded-circle bg-danger position-absolute"
                      style={{ width: '20px', height: '20px', cursor: 'pointer', top: '-8px', right: '-10px' }}
                    >
                      <FaTimes color="white" size={10} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </>
        ))}
      </div>

      <div>
        <button onClick={() => navigate('/insurance')}>
          continue
        </button>
      </div>

      <MediaUploadModal
        customerId={uploadModal.id}
        show={uploadModal.show}
        isCustomerDoc={false}
        handleClose={closeUploadModal}
      />
    </>
  )
}
