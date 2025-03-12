import React, { useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MediaUploadModal = ({ show, customerId, handleClose,isCustomerDoc,api_key }) => {
  const [documentType, setDocumentType] = useState("");
  const [otherDocumentName, setOtherDocumentName] = useState("");
  const [file, setFile] = useState(null);
  const [selectedDocType, setselectedDocType] = useState([]);
  const [route, setroute] = useState("");
  const customerDocumentTypes = [
    { label: "Adhar Card", value: "adhar" },
    { label: "Pan Card", value: "pan" },
    { label: "Driving license", value: "license"},
    { label: "Other", value: "other" },
  ];

  const insuranceDocumentTypes =[
    { label: "Policy", value: "policy"},
    { label: "Forms", value: "form" },
    { label: "Receipt", value: "receipt"},
    { label: "Other", value: "other" },
  ];
  const api = "http://localhost:3005";


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
      const response = await axios.post(`${api}/${route}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      
      if(response.data.success){
        handleClose();
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
    <div className={`modal ${show ? "d-block" : "d-none"}`} tabIndex="-1">
      <div className="modal-dialog">
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
  );
};

export default MediaUploadModal;
