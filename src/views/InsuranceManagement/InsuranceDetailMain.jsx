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
  const [isMotor, setisMotor] = useState();
  const user_id = useSelector((state) => state.id);
  const [activeInsuranceId, setActiveInsuranceId] = useState(null);
  const [InsuranceCommonId, setInsuranceCommonId] = useState();
  const [vehicle, setvehicleCompany] = useState([]);
  const [vehicleModel, setvehicleModel] = useState([]);
  const [uploadModal, setUploadModal] = useState({ show: false, id: null });
  const [fetchedData, setFetchedData] = useState(null);
  const [pendingModelValue, setPendingModelValue] = useState(null);

  const adminType = useSelector((state) => state.adminType);

  const [selectedOption2, setSelectedOption2] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);

  const [insuranceCompanies, setInsuranceCompanies] = useState([]);

  const [User, setUser] = useState([]);
  const [agents, setAgents] = useState([]);


  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isDirty, touchedFields },
  } = useForm();

  const manufacturer = watch("manufacturer");
  const model = watch("model");

  const option1 = [
    { Heading: "SA OD", value: "SAOD" },
    { Heading: "Third Party", value: "ThirdParty" },
    { Heading: "Comprehensive", value: "COMPREHENSIVE" },
    { Heading: "New Vehicle", value: "NewVehicle" },
  ];

  const option2 = [
    { Heading: "PCV[Taxi, Rikshaw]", value: "PCV" },
    { Heading: "GCV [Truck,mini truck]", value: "GCV" },
    { Heading: "MISD [Ambulance, Elavator]", value: "MISD" },
  ];

  const optionNonMotor = [
    { Heading: "Health Insurance", value: "Health Insurance" },
    { Heading: "Life Insurance", value: "Life Insurance" },
    { Heading: "WC Insurance", value: "WC Insurance" },
    { Heading: "PA cover", value: "PA cover" },
    { Heading: "Travel Insurance", value: "Travel Insurance" },
    { Heading: "Fire Insurance", value: "Fire Insurance" },
    { Heading: "Marine Insurance", value: "Marine Insurance" },
  ];

  const optionMotor = [
    { Heading: "Private Car", value: "Private Car" },
    { Heading: "Two Wheeler", value: "Two Wheeler" },
    { Heading: "Commercial", value: "Commercial" },
  ];

  const case_type = watch('case_type')


  const fetchVehicleDetails = async () => {
    try {
      const response = await axios.get('/get-vehicle-companies');

      if (response.data.success) {
        setvehicleCompany(response.data.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching vehicle Company");
    }
  };

  const fetchModelsAccordingToCompany = async () => {

    try {
      const manufacturerObj = JSON.parse(manufacturer);
      const response = await axios.get('/get-vehicle-modelBycompany', { params: { id: manufacturerObj.id } });

      if (response.data.success) {
        console.log(response.data.data);

        setvehicleModel(response.data.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching vehicle Model");
    }
  }

  const setFormValues = (data) => {

    if (data.segment === "Commercial") {
      setSelectedOption2(option2);
    } else {
      setSelectedOption2(option1);
    }

    if (data.manufacturer && vehicle.length > 0) {
      const manufacturerValue = vehicle.find((item) => item.company_name == data.manufacturer);
      if (manufacturerValue) {
        setValue('manufacturer', JSON.stringify(manufacturerValue));
        if (data.model) {
          setPendingModelValue(data.model);
        }
      }
    }
  };

  useEffect(() => {
    if (fetchedData && selectedOption2.length > 0) {
      setValue('segment_vehicle_type', fetchedData.segment_vehicle_type)
    }
  }, [selectedOption2, fetchedData]);


  useEffect(() => {
    if (manufacturer && manufacturer !== "") {
      try {
        const manufacturerObj = JSON.parse(manufacturer);
        if (manufacturerObj && manufacturerObj.id) {
          fetchModelsAccordingToCompany();
        }
      } catch (error) {
        console.error("Error parsing manufacturer:", error);
      }
    }

  }, [manufacturer]);

  useEffect(() => {
    fetchInsuranceCompanies();
    fetchVehicleDetails();
    fetchInsuranceDetails();
    getAgents();
    fetchUser();
  }, []);

  useEffect(() => {
    setValue('agent_id', null)
  }, [case_type]);

  useEffect(() => {
    if (fetchedData) {
      if (fetchedData.case_type == 'office') {
        setValue('user_id', fetchedData.user_id);
      } else {
        setValue('agent_id', fetchedData.agent_id);
      }
    }
  }, [fetchedData]);


  const fetchUser = async () => {
    try {
      const response = await axios.post('/user-list');
      setUser(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch User');
      console.error('Failed to fetch User:', error);
    }
  };

  const getAgents = async () => {
    try {
      const response = await axios.get(`/agent-list`);
      if (response.data.success) {
        setAgents(response.data.data);
      } else {
        console.log("Error while fetching agents");
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }


  useEffect(() => {
    if (insuranceData.length > 0) {
      const data = insuranceData[activeTab];
      reset(data);
      setFetchedData(data);
    }
  }, [insuranceData, activeTab, reset]);

  useEffect(() => {
    if (vehicle.length > 0 && fetchedData) {
      setFormValues(fetchedData);
    }
  }, [vehicle, fetchedData]);

  useEffect(() => {
    if (vehicleModel.length > 0 && pendingModelValue) {
      setValue('model', pendingModelValue);
      setPendingModelValue(null);
    }
  }, [vehicleModel, pendingModelValue]);

  const fetchInsuranceDetails = async () => {
    try {
      const response = await axios.get(`/particular-insurance`, {
        params: { common_id: id }
      });
      setInsuranceData(response.data.data);
      setActiveInsuranceId(response.data.data[0].id);
      setInsuranceCommonId(response.data.data[0].insurance_id);
      if (response.data?.data[0].insurance_type == 'Motor') {
        setisMotor(true);
        setSelectedOption(optionMotor);
      } else {
        setisMotor(false);
        setSelectedOption(optionNonMotor);
      }
    } catch (error) {
      toast.error("Failed to fetch insurance details");
    }
  };

  const fetchInsuranceCompanies = async () => {
    try {
      const response = await axios.get('/insurance-companies');
      if (response.data.success) {
        setInsuranceCompanies(response.data.data);
      } else {
        toast.error('Error while fetching Insurance Company');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const handleSave = async (data) => {
    try {

      let payload = {};
      payload.isMotor = isMotor;
      payload.insurance_detail_id = activeInsuranceId;
      payload.insurance_common_detail_id = InsuranceCommonId;
      payload.segment = data.segment;
      if (isMotor) {
        let manufacturer = data.manufacturer;
        if (typeof data.manufacturer === 'string' && data.manufacturer.startsWith('{')) {
          try {
            manufacturer = JSON.parse(data.manufacturer);
            manufacturer = manufacturer.company_name;
          } catch (error) {
            console.error("Error parsing manufacturer:", error);
          }
        }

        payload.motor_details = {
          "vehicle_number": data.vehicle_number,
          "segment_vehicle_type": data.segment_vehicle_type,
          "segment_vehicle_detail_type": data.segment_vehicle_detail_type,
          "model": data.model,
          "manufacturer": manufacturer,
          "fuel_type": data.fuel_type,
          "yom": data.yom,
        }
      }
      payload.other_details = {
        "insurance_date": data.insurance_date,
        "idv": data.idv,
        "currentncb": data.currentncb,
        "insurance_company": data.insurance_company,
        "policy_no": data.policy_no,
        "od_premium": data.od_premium,
        "tp_premium": data.tp_premium,
        "package_premium": data.package_premium,
        "gst": data.gst,
        "premium": data.premium,
        "collection_date": data.collection_date,
        "case_type": data.case_type,
        "payment_mode": data.payment_mode,
        "policy_start_date": data.policy_start_date,
        "policy_expiry_date": data.policy_expiry_date,
        "agent_id": data.agent_id,
        "user_id": data.user_id,
        "payout_percent": data.payout_percent,
        "amount": data.amount,
      }

      await axios.post(`/update-insurance`, { payload });

      toast.success('Insurance details updated successfully');
      setIsEditing(false);
      fetchInsuranceDetails();
    } catch (error) {
      console.log(error);
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
    fetchInsuranceDetails();
  };

  const handleDelete = async (doc) => {
    try {
      const response = await axios.post('/delete-insurance-document', {
        selectedID: activeInsuranceId,
        document: doc.name,
      });
      if (response.data.success) {
        toast.success('Document deleted successfully');
        fetchInsuranceDetails();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete document');
    }
  }

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
                  onClick={() => handleCancel()}
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
                onClick={() => { setActiveTab(index); setActiveInsuranceId(insurance.id); }}
              >
                {insuranceData.length - 1 == index ? 'Initial' : 'Renewal ' + (index + 1)}
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
                          disabled={true}
                          {...register('insurance_type')}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Business Type</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={true}
                          {...register('business_type')}
                        />
                      </div>
                      {/* <div className="col-md-4 mb-3">
                        <label className="form-label">Segment</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('segment')}
                        />
                      </div> */}

                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Select Segment Type</label>
                        <select
                          {...register("segment", { required: "Segment type is required" })}
                          className="form-select border-2"
                          disabled={!isEditing}
                        >
                          <option value="">Choose segment type</option>
                          {selectedOption.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.Heading}
                            </option>
                          ))}
                        </select>
                        {errors.segment && (
                          <div className="text-danger mt-1 small">{errors.segment.message}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information Section */}
                  {isMotor && (
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
                        {/* <div className="col-md-3 mb-3">
                        <label className="form-label">Product Base</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('product_base')}
                        />
                      </div> */}
                        <div className="col-md-3">
                          <label htmlFor="manufacturer" className="form-label">
                            Manufacturer
                          </label>
                          <select
                            id="manufacturer"
                            className={`form-select ${touchedFields.manufacturer && errors.manufacturer ? "is-invalid" : ""}`}
                            {...register("manufacturer", {
                              required: "Manufacturer is required",
                              onChange: (e) => {
                                setValue("model", "");
                              }
                            })}
                            disabled={!isEditing}
                          >
                            <option value="">Select manufacturer</option>
                            {vehicle.map((item) => (
                              <option key={item.id} value={JSON.stringify(item)}>
                                {item.company_name}
                              </option>
                            ))}
                          </select>
                          {touchedFields.manufacturer && errors.manufacturer && (
                            <div className="invalid-feedback">{errors.manufacturer.message}</div>
                          )}
                        </div>

                        <div className="col-md-3">
                          <label htmlFor="model" className="form-label">
                            Model
                          </label>
                          <select
                            id="model"
                            className={`form-select ${touchedFields.model && errors.model ? "is-invalid" : ""}`}
                            {...register("model", {
                              required: "Vehicle Model is required"
                            })}
                            disabled={!isEditing}
                          >
                            <option value="">Select model</option>
                            {vehicleModel?.map((model, index) => (
                              <option key={index} value={model}>
                                {model}
                              </option>
                            ))}
                          </select>
                          {touchedFields.model && errors.model && (
                            <div className="invalid-feedback">{errors.model.message}</div>
                          )}
                        </div>
                        {/* <div className="col-md-3 mb-3">
                          <label className="form-label">Fuel Type</label>
                          <input
                            type="text"
                            className="form-control"
                            disabled={!isEditing}
                            {...register('fuel_type')}
                          />
                        </div> */}
                        <div className="col-md-3">
                          <label htmlFor="fuel_type" className="form-label">
                            Fuel Type
                          </label>
                          <select
                            id="fuel_type"
                            className={`form-select ${errors.fuel_type ? "is-invalid" : ""}`}
                            disabled={!isEditing}
                            {...register("fuel_type", { required: "Fuel Type is required" })}
                          >
                            <option value="">Select Type</option>
                            <option value="petrol">Petrol</option>
                            <option value="diesel">Diesel</option>
                            <option value="electric">Electric</option>
                            <option value="hybrid">Hybrid</option>
                          </select>
                          {errors.fuel_type && <div className="invalid-feedback">{errors.fuel_type.message}</div>}
                        </div>

                        <div className="col-md-3 mb-3">
                          <label className="form-label fw-semibold">Select Vehicle Type</label>
                          <select
                            {...register("segment_vehicle_type", { required: "Vehicle type is required" })}
                            className="form-select border-2"
                            disabled={!isEditing}
                          >
                            <option value="">Choose vehicle type</option>
                            {selectedOption2.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.Heading}
                              </option>
                            ))}
                          </select>
                          {touchedFields.segment_vehicle_type && errors.segment_vehicle_type && (
                            <div className="text-danger mt-1 small">{errors.segment_vehicle_type.message}</div>
                          )}
                        </div>
                        <div className="col-md-3 mb-3">
                          <label className="form-label">Segment Vehicle Detail Type</label>
                          <input
                            type="text"
                            className="form-control"
                            disabled={!isEditing}
                            {...register('segment_vehicle_detail_type')}
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label className="form-label">Year of Manufacture</label>
                          <input
                            type="number"
                            className="form-control"
                            disabled={!isEditing}
                            {...register('yom')}
                          />
                        </div>
                      </div>
                    </div>
                  )}

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
                      {/* <div className="col-md-3 mb-3">
                        <label className="form-label">Insurance Company</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('insurance_company')}
                        />
                      </div> */}

                      <div className="col-md-3">
                        <label htmlFor="insurance_company" className="form-label">Insurance Company</label>
                        <select
                          id="insurance_company"
                          className={`form-select ${errors.insurance_company ? 'is-invalid' : ''}`}
                          disabled={!isEditing}
                          {...register("insurance_company", { required: "Insurance company is required" })}
                        >
                          <option value="">Select company</option>
                          {insuranceCompanies.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        {errors.insurance_company && (
                          <div className="invalid-feedback">{errors.insurance_company.message}</div>
                        )}
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
                        {/* <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('payment_mode')}
                        /> */}
                        <select
                          id="payment_mode"
                          className={`form-select ${errors.payment_mode ? 'is-invalid' : ''}`}
                          disabled={!isEditing}
                          {...register("payment_mode", { required: "Agent is required" })}
                        >
                          <option value="">Select Payment mode</option>
                          <option value="online">Online</option>
                          <option value="offline">Offline</option>
                          <option value="offline">Not Paid Yet</option>
                        </select>
                        {errors.payment_mode && (
                          <div className="invalid-feedback">{errors.payment_mode.message}</div>
                        )}
                      </div>

                      {/* <div className="col-md-3 mb-3">
                        <label className="form-label">Case Type</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('case_type')}
                        />
                      </div>
                      {insuranceData[activeTab].case_type == 'agent' && (
                        <div className="col-md-3 mb-3">
                          <label className="form-label">Agent Code</label>
                          <input
                            type="text"
                            className="form-control"
                            disabled={!isEditing}
                            {...register('agent_id')}
                          />
                        </div>
                      )}

                      {insuranceData[activeTab].case_type == 'office' && (
                        <div className="col-md-3 mb-3">
                          <label className="form-label">Employee</label>
                          <input
                            type="text"
                            className="form-control"
                            disabled={true}
                            value={insuranceData[activeTab].user_id == user_id ? 'Self' : insuranceData[activeTab].full_name}

                          />
                        </div>
                      )} */}

                      {/* Agent Selection Field */}
                      {/* Case Type */}
                      <div className="col-md-3">
                        <label htmlFor="case_type" className="form-label">Case type</label>
                        <select
                          id="case_type"
                          className={`form-select ${errors.case_type ? 'is-invalid' : ''}`}
                          disabled={!isEditing}
                          {...register("case_type", { required: "Case type is required" })}
                        >
                          <option value="">Select Case type</option>
                          <option value="office">Office</option>
                          <option value="agent">Agent</option>
                        </select>
                        {errors.case_type && (
                          <div className="invalid-feedback">{errors.case_type.message}</div>
                        )}
                      </div>

                      {/* Agent or Office Employee */}
                      {case_type === 'agent' && (

                        <div className="col-md-3">
                          <label htmlFor="agent_id" className="form-label">Agent</label>
                          <select
                            id="agent_id"
                            className={`form-select ${errors.agent_id ? 'is-invalid' : ''}`}
                            disabled={!isEditing}
                            {...register("agent_id", { required: "Agent is required" })}
                          >
                            <option value="">Select Agent</option>
                            {agents.map((agent) => (
                              <option key={agent.id} value={agent.id}>
                                {agent.full_name}
                              </option>
                            ))}
                          </select>
                          {errors.agent_id && (
                            <div className="invalid-feedback">{errors.agent_id.message}</div>
                          )}
                        </div>
                      )}
                      {case_type === 'office' && (
                        <div className="col-md-3">
                          <label htmlFor="user_id" className="form-label">Office Employee</label>
                          <select
                            id="user_id"
                            className={`form-select ${errors.user_id ? 'is-invalid' : ''}`}
                            disabled={!isEditing}
                            {...register("user_id", { required: "Employee is required" })}
                          >
                            <option value="">Select Employee</option>
                            {adminType === 'Admin' && User.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.full_name}
                              </option>
                            ))}
                            <option value={user_id}>self</option>
                          </select>
                          {errors.user_id && (
                            <div className="invalid-feedback">{errors.user_id.message}</div>
                          )}
                        </div>
                      )}

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
                      {/* <div className="col-md-3 mb-3">
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
                        <label className="form-label">Net Income</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('net_income')}
                        />
                      </div> */}
                      {/* <div className="col-md-3 mb-3">
                        <label className="form-label">Payment Received</label>
                        <input
                          type="number"
                          className="form-control"
                          disabled={!isEditing}
                          {...register('payment_received')}
                        />
                      </div> */}
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
                          <div key={docIndex} className="col-md-3 mb-3">
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
                                  type='button'
                                  className="btn btn-sm btn-outline-primary mt-2"
                                  onClick={() => handleDocumentClick(doc)}
                                >
                                  View Document
                                </button>
                                <div className="ms-3">
                                  <div
                                    className="d-flex justify-content-center align-items-center rounded-circle bg-danger position-absolute"
                                    style={{ width: '20px', height: '20px', cursor: 'pointer', top: '-8px', right: '-10px' }}
                                    onClick={() => handleDelete(doc)}
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
