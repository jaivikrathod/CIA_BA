import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaSave, FaTimes, FaFilePdf } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api = "http://localhost:3005";

const InsuranceDetailMain = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [insuranceData, setInsuranceData] = useState([]);

  useEffect(() => {
    fetchInsuranceDetails();
  }, []);

  const fetchInsuranceDetails = async () => {
    try {
      const response = await axios.get(`${api}/particular-insurance`, {
        params: { common_id: id }
      });
      setInsuranceData(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching insurance details:", error);
      toast.error("Failed to fetch insurance details");
    }
  };

  const handleSave = async () => {
    // Save functionality will be implemented later
    setIsEditing(false);
  }

  const handleCancel = () => {
    setIsEditing(false);
    // Refresh data to revert changes
    fetchInsuranceDetails();
  }

  const handleDocumentClick = (document) => {
    if (document.name.toLowerCase().endsWith('.pdf')) {
      // Open PDF in new tab
      window.open(`${api}/get-insurance-docs/${document.name}`, '_blank');
    } else {
      // For images, show in modal or new tab
      window.open(`${api}/get-insurance-docs/${document.name}`, '_blank');
    }
  }

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Insurance Details</h2>
        <div>
          {isEditing ? (
            <>
              <button 
                className="btn btn-success me-2"
                onClick={handleSave}
              >
                <FaSave className="me-2" /> Save
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleCancel}
              >
                <FaTimes className="me-2" /> Cancel
              </button>
            </>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              <FaEdit className="me-2" /> Edit
            </button>
          )}
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        {insuranceData.map((insurance, index) => (
          <li className="nav-item" key={insurance.id}>
            <button 
              className={`nav-link ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              Insurance {index + 1}
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content">
        {insuranceData.map((insurance, index) => (
          <div key={insurance.id} className={`tab-pane ${activeTab === index ? 'active' : ''}`}>
            <div className="row">
              {/* Basic Information Section */}
              <div className="col-12 mb-4">
                <h4 className="border-bottom pb-2">Basic Information</h4>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Insurance Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.insurance_type}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Business Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.business_type}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Segment</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.segment}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Information Section */}
              <div className="col-12 mb-4">
                <h4 className="border-bottom pb-2">Vehicle Information</h4>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Vehicle Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.vehicle_number}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Product Base</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.product_base}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Manufacturer</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.manufacturer}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Model</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.model}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Fuel Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.fuel_type}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Year of Manufacture</label>
                    <input
                      type="number"
                      className="form-control"
                      value={insurance.year_of_manufacture}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Policy Details Section */}
              <div className="col-12 mb-4">
                <h4 className="border-bottom pb-2">Policy Details</h4>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Policy Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.policy_no}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Insurance Company</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.insurance_company}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">IDV</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.idv}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Current NCB</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.currentncb}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Premium Details Section */}
              <div className="col-12 mb-4">
                <h4 className="border-bottom pb-2">Premium Details</h4>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">OD Premium</label>
                    <input
                      type="number"
                      className="form-control"
                      value={insurance.od_premium}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">TP Premium</label>
                    <input
                      type="number"
                      className="form-control"
                      value={insurance.tp_premium}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Package Premium</label>
                    <input
                      type="number"
                      className="form-control"
                      value={insurance.package_premium}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">GST</label>
                    <input
                      type="number"
                      className="form-control"
                      value={insurance.gst}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Total Premium</label>
                    <input
                      type="number"
                      className="form-control"
                      value={insurance.premium}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Dates Section */}
              <div className="col-12 mb-4">
                <h4 className="border-bottom pb-2">Important Dates</h4>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Policy Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={new Date(insurance.policy_start_date).toISOString().split('T')[0]}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Policy Expiry Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={new Date(insurance.policy_expiry_date).toISOString().split('T')[0]}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Collection Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={new Date(insurance.collection_date).toISOString().split('T')[0]}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Insurance Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={new Date(insurance.insurance_date).toISOString().split('T')[0]}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Details Section */}
              <div className="col-12 mb-4">
                <h4 className="border-bottom pb-2">Payment Details</h4>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Payment Mode</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.payment_mode}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Case Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.case_type}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Executive Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.exe_name}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Agent Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.agent_code}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Financial Details Section */}
              <div className="col-12 mb-4">
                <h4 className="border-bottom pb-2">Financial Details</h4>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Payout Percent</label>
                    <input
                      type="number"
                      className="form-control"
                      value={insurance.payout_percent}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={insurance.amount}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">TDS</label>
                    <input
                      type="number"
                      className="form-control"
                      value={insurance.tds}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">TDS Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={insurance.tds_amount}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Payment Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={insurance.payment_amount}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Difference</label>
                    <input
                      type="number"
                      className="form-control"
                      value={insurance.difference}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Final Agent</label>
                    <input
                      type="number"
                      className="form-control"
                      value={insurance.final_agent}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Net Income</label>
                    <input
                      type="number"
                      className="form-control"
                      value={insurance.net_income}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Payment Received</label>
                    <input
                      type="number"
                      className="form-control"
                      value={insurance.payment_received}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="col-12 mb-4">
                <h4 className="border-bottom pb-2">Documents</h4>
                <div className="row">
                  {insurance.documents && JSON.parse(insurance.documents).map((doc, docIndex) => (
                    <div key={docIndex} className="col-md-4 mb-3">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            {doc.name.toLowerCase().endsWith('.pdf') ? (
                              <FaFilePdf className="text-danger me-2" size={24} />
                            ) : (
                              <img 
                                src={`${api}/get-insurance-docs/${doc.name}`}
                                alt={doc.type}
                                className="img-thumbnail me-2"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              />
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Information Section */}
              <div className="col-12 mb-4">
                <h4 className="border-bottom pb-2">Address Information</h4>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.city}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insurance.full_address}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsuranceDetailMain;
