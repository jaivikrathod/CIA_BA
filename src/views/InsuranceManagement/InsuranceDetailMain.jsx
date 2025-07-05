import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaEdit, FaSave, FaTimes, FaFilePdf, FaPlus } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pdf2 from '../../assets/images/pdf2.png'
import MediaUploadModal from '../UploadDoc/MediaUploadModal';
import useApi from '../../api/axios';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

const InsuranceDetailMain = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [insuranceData, setInsuranceData] = useState([]);
  const axios = useApi();
  const api = useSelector((state) => state.apiUrl);

  const [showModal, setShowModal] = useState(false);
  const [uploadModal, setUploadModal] = useState({ show: false, id: null });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchInsuranceDetails();
  }, []);

  useEffect(() => {
    if (insuranceData.length > 0) {
      reset(insuranceData[activeTab]);
    }
  }, [insuranceData, activeTab, reset]);

  const fetchInsuranceDetails = async () => {
    try {
      const response = await axios.get(`/particular-insurance`, {
        params: { common_id: id }
      });
      setInsuranceData(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch insurance details");
    }
  };

  const handleSave = async (data) => {
    try {
      // Assuming you have an endpoint to update insurance details
      // await axios.put(`/update-insurance/${insuranceData[activeTab].id}`, data);
      console.log(data);
      
      toast.success('Insurance details updated successfully');
      setIsEditing(false);
      fetchInsuranceDetails();
    } catch (error) {
      toast.error('Failed to update insurance details');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Refresh data to revert changes
    fetchInsuranceDetails();
  };

  const handleDocumentClick = (document) => {
    if (document.name.toLowerCase().endsWith('.pdf')) {
      // Open PDF in new tab
      window.open(`${api}/get-insurance-docs/${document.name}`, '_blank');
    } else {
      // For images, show in modal or new tab
      window.open(`${api}/get-insurance-docs/${document.name}`, '_blank');
    }
  }

  const openUploadModal = (id) => {
    setUploadModal({ show: true, id });
  };

  const closeUploadModal = () => {
    setUploadModal({ show: false, id: null });
  };

  return (
    <>
      <div className="container mt-4">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

        <div className="d-flex justify-content-between align-items-center mb-4 insurance-detail-main">
          <h2>Insurance Details</h2>
          <div>
            {isEditing ? (
              <>
                <button
                  className="btn btn-success me-2"
                  onClick={handleSubmit(handleSave)}
                >
                  <FaSave className="me-2" /> Save
                </button>
                <button
                  className="btn btn-common btn-danger"
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
          {insuranceData.length > 0 && (
            <form onSubmit={handleSubmit(handleSave)}>
              <div className={`tab-pane active`}>
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
                          disabled={!isEditing}
                          {...register('insurance_type')}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Business Type</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('business_type')}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Segment</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('segment')}
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
                          disabled={!isEditing}
                          {...register('vehicle_number')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Product Base</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('product_base')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Manufacturer</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('manufacturer')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Model</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('model')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Fuel Type</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('fuel_type')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Year of Manufacture</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('year_of_manufacture')}
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
                          disabled={!isEditing}
                          {...register('policy_no')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Insurance Company</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('insurance_company')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">IDV</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('idv')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Current NCB</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('currentncb')}
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
                          disabled={!isEditing}
                          {...register('od_premium')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">TP Premium</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('tp_premium')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Package Premium</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('package_premium')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">GST</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('gst')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Total Premium</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('premium')}
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
                          disabled={!isEditing}
                          {...register('policy_start_date')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Policy Expiry Date</label>
                        <input
                          type="date"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('policy_expiry_date')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Collection Date</label>
                        <input
                          type="date"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('collection_date')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Insurance Date</label>
                        <input
                          type="date"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('insurance_date')}
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
                          disabled={!isEditing}
                          {...register('payment_mode')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Case Type</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('case_type')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Executive Name</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('exe_name')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Agent Code</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('agent_code')}
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
                          disabled={!isEditing}
                          {...register('payout_percent')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Amount</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('amount')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">TDS</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('tds')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">TDS Amount</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('tds_amount')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Payment Amount</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('payment_amount')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Difference</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('difference')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Final Agent</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('final_agent')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Net Income</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('net_income')}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Payment Received</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('payment_received')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="col-12 mb-3">
                    <div className="border-bottom pb-3 mb-4 d-flex align-items-center">
                      <h4 className="mb-0">Documents</h4>

                      <div className="ms-3">
                        <div onClick={() => openUploadModal(insuranceData[activeTab].id)}
                          className="d-flex justify-content-center align-items-center rounded-circle bg-primary"
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        >
                          <FaPlus color="white" size={10} />
                        </div>
                      </div>
                    </div>


                    <div className="d-flex gap-5 flex-wrap">
                      {insuranceData[activeTab].documents && JSON.parse(insuranceData[activeTab].documents).map((doc, docIndex) => (
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
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <MediaUploadModal
        customerId={uploadModal.id}
        show={uploadModal.show}
        isCustomerDoc={false}
        handleClose={closeUploadModal}
      />
    </>
  );
};

export default InsuranceDetailMain;
