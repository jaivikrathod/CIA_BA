import React, { useState, useEffect } from 'react';
import { FaUpload, FaTimes } from 'react-icons/fa';
import MediaUploadModal from '../UploadDoc/MediaUploadModal';
import { useParams, useNavigate } from 'react-router-dom';
import { toast,ToastContainer } from 'react-toastify';
import useApi from '../../api/axios';
import { useSelector } from 'react-redux';
import pdfIcon from '../../assets/pdf.png'; // Use an actual PDF icon image

export default function UploadInsuranceDoc() {
  const [uploadModal, setUploadModal] = useState({ show: false, id: null });
  const [documents, setDocuments] = useState([]);
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

  const closeUploadModal = () => {
      setUploadModal({ show: false });
      fetchInsuranceDocuments();
  };

  const fetchInsuranceDocuments = async () => {
    try {
      const response = await axios.get(`/particular-insurance-document`, {
        params: { id },
      });
      const data = JSON.parse(response.data.data.documents || '[]');
      setDocuments(data);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch insurance details');
    }
  };


  const handleDelete = async (doc) => {
    try {
      const response = await axios.post('/delete-insurance-document', {
        selectedID: id,
        document: doc.name,
      });
      if(response.data.success){
        toast.success('Document deleted successfully');
        fetchInsuranceDocuments();
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete document');
    }
  }

  const handleDocumentClick = (doc) => {
    window.open(`${api}/get-insurance-docs/${doc.name}`, '_blank');
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Insurance Documents</h5>
        <button
          onClick={openUploadModal}
          className="btn btn-sm btn-primary"
          title="Upload Document"
        >
          <FaUpload className="me-1" /> Upload
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-muted text-center py-5">
          <p className="mb-2">No documents uploaded yet</p>
          <FaUpload size={32} className="text-secondary" />
        </div>
      ) : (
        <div className="row g-4">
          {documents.map((doc, index) => (
            <div className="col-md-4" key={index}>
              <div className="card h-100 shadow-sm position-relative">
                <div className="card-body text-center">
                  {doc.name.toLowerCase().endsWith('.pdf') ? (
                    <img
                      src={pdfIcon}
                      alt="PDF"
                      className="img-fluid mb-3"
                      style={{ width: 60, height: 60 }}
                    />
                  ) : (
                    <img
                      src={`${api}/get-insurance-docs/${doc.name}`}
                      alt={doc.type}
                      className="img-thumbnail mb-3"
                      style={{ width: '100%', height: 160, objectFit: 'cover' }}
                    />
                  )}
                  <h6 className="mb-1">{doc.type || 'Untitled Document'}</h6>
                  <button
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={() => handleDocumentClick(doc)}
                  >
                    View Document
                  </button>
                </div>
                {/* Optional delete icon */}
                <FaTimes
                  size={14}
                  className="position-absolute top-0 end-0 m-2 text-white bg-danger rounded-circle p-1"
                  title="Delete"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDelete(doc)} 
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <button className="btn btn-success" onClick={() => navigate('/insurance')}>
          Continue
        </button>
      </div>

      <MediaUploadModal
        customerId={uploadModal.id}
        show={uploadModal.show}
        isCustomerDoc={false}
        handleClose={closeUploadModal}
      />
      <ToastContainer />
    </>
  );
}
