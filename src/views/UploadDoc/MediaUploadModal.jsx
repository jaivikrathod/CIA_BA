import React, { useState,useEffect, use } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import useApi from "../../api/axios";

const MediaUploadModal = ({ show, customerId, handleClose,isCustomerDoc,api_key }) => {
  const [documentType, setDocumentType] = useState("");
  const [otherDocumentName, setOtherDocumentName] = useState("");
  const [file, setFile] = useState(null);
  const [selectedDocType, setselectedDocType] = useState([]);
  const [route, setroute] = useState("");
  const axios = useApi();

  const customerDocumentTypes = [
    { label: "Adhar Card", value: "AdharCard" },
    { label: "Pan Card", value: "PanCard" },
    { label: "Driving license", value: "License"},
    { label: "Other", value: "other" },
  ];

  const insuranceDocumentTypes =[
    { label: "Policy", value: "Policy"},
    { label: "Forms", value: "Forms" },
    { label: "Receipt", value: "Receipt"},
    { label: "Other", value: "other" },
  ];
  


  useEffect(() => {
    if(isCustomerDoc){
      setselectedDocType(customerDocumentTypes);
      setroute("upload-customer");
    }else{
      setselectedDocType(insuranceDocumentTypes);
      setroute("upload-insurance");
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!documentType || (documentType === "other" && !otherDocumentName)) {
      toast.error('Please select a document type or provide a name for "Other"');
      return;
    }

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("customer_id", customerId);
    formData.append("document_type", documentType === "other" ? otherDocumentName : documentType);
    formData.append("document", file);
    try {
      const response = await axios.post(`/${route}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if(response.data.success){
        handleClose(response.data);
        setFile(null);
        setOtherDocumentName("");
        setDocumentType("");
        toast.success('Document uploaded successfully!');
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error uploading document");
      console.error("Error uploading document:", error);
    }
  };

  return (
    <>
      {show && <div className="modal-backdrop fade show"></div>}
      <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Upload Media</h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Select Document Type</label>
                <select
                  className="form-select"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                >
                  <option value="">Select</option>
                  {selectedDocType.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                {documentType === "other" && (
                  <div className="mb-3">
                    <label className="form-label mt-3">Other Document Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={otherDocumentName}
                      onChange={(e) => setOtherDocumentName(e.target.value)}
                      placeholder="Enter document name"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Choose File</label>
                <input type="file" className="form-control" onChange={handleFileChange} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleUpload}>
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaUploadModal;
