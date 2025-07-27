import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import useApi from '../../api/axios';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function InsuranceCommonDetails2() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm();
  const { id } = useParams();
  const { common_id } = useParams();
  const location = useLocation();
  const type = location.state?.type || false;
  const user_id = useSelector((state) => state.id);
  const api = useApi();
  const [comp, setcomp] = useState([]);
  const [User, setUser] = useState([]);
  


  const adminType = useSelector((state) => state.adminType);


  useEffect(() => {
    getAgents();
    getCompanies();
    fetchUser();
  }, []);


  const fetchUser = async () => {
    try {
      const response = await api.post('/user-list');
      setUser(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch User');
      console.error('Failed to fetch User:', error);
    }
  };

  const getAgents = async () => {
    try {
      const response = await api.get(`/agent-list`);
      if (response.data.success) {
        setAgents(response.data.data);
      } else {
        console.log("Error while fetching agents");
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  const getCompanies = async () => {
    try {
      const response = await api.get('/insurance-companies');
      if (response.data.success) {
        setcomp(response.data.data);
      } else {
        toast.error('Error while fetching Insurance Company');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const onSubmit = async (data) => {
    try {
      data.insurance_id = id;
      data.user_id = data.emp_id ?? user_id;
    
      if (type) {
        common_id ? data.common_id = common_id : data.common_id = null;
        
        const response = await api.post(`/common-general`, data);
        if (response.data.message) {
          toast.success('Form submitted successfully!');
          navigate(`/upload-insurance-document/${response.data.id}`);
        } else {
          throw new Error('Submission failed');
        }
      } else {
        const response = await api.post(`/common-general`, data);
        if (response.data.message) {
          toast.success('Form submitted successfully!');
          navigate(`/upload-insurance-document/${response.data.id}`);
        } else {
          throw new Error('Submission failed');
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message ||error|| 'An error occurred while submitting the form.');
    }
  };

  
  const formFields = [
    { label: "idv", type: "number", id: "idv", validation: { required: "idv is required" }, width: "col-md-3" },
    { label: "Current NCB (%)", type: "number", id: "currentncb", validation: { required: "Current NCB is required" }, width: "col-md-3" },
    { label: "Policy No", type: "text", id: "policy_no", validation: { required: "Policy No is required" }, width: "col-md-3" },
    { label: "OD Premium", type: "number", id: "od_premium", validation: { required: "OD Premium is required" }, width: "col-md-3" },
    { label: "TP Premium", type: "number", id: "tp_premium", validation: { required: "TP Premium is required" }, width: "col-md-3" },
    { label: "Package Premium", type: "number", id: "package_premium", validation: { required: "Package Premium is required" }, width: "col-md-3" },
    { label: "Premium", type: "number", id: "premium", validation: { required: "Premium is required" }, width: "col-md-3" },
    { label: "gst (Premium - Package Premium)", type: "number", id: "gst", validation: { required: "gst is required" }, disabled: true, width: "col-md-3" },
    { label: "Insurance Date", type: "date", id: "insurance_date", validation: { required: "Insurance Date is required" }, width: "col-md-3" },
    { label: "Collection Date", type: "date", id: "collection_date", validation: { required: "Collection Date is required" }, width: "col-md-3" },
    { label: "New Policy Start Date", type: "date", id: "policy_start_date", validation: { required: "Start Date is required" }, width: "col-md-3" },
    { label: "New Policy Expiry Date", type: "date", id: "policy_expiry_date", validation: { required: "Expiry Date is required" }, width: "col-md-3" },
    { label: "Payout Percent", type: "number", id: "payout_percent", validation: { required: "Payout Percent is required" }, adminOnly: true, width: "col-md-3" },
    { label: "Amount", type: "number", id: "amount", validation: { required: "Amount is required" }, adminOnly: true, width: "col-md-3" },
    { label: "tds", type: "number", id: "tds", validation: { required: "tds is required" }, adminOnly: true, width: "col-md-3" },
  ];
  const case_typeValue = (watch('case_type') || '').toLowerCase();

  const [gstError, setgstError] = useState('');

  useEffect(() => {
    setValue('agent_id', null)
    setValue('emp_id', null);
  }, [case_typeValue]);

  const package_premium = Number(watch('package_premium'));
  const premium = Number(watch('premium'));


  useEffect(() => {
    if (package_premium && premium) {

      if (package_premium > premium) {
        console.log('package premium' + package_premium);
        console.log('premium' + premium);
        setgstError('Package premium can not be greater than premium');
        setValue('gst', null);
      } else {
        setgstError('');
        setValue('gst', premium - package_premium)
      }
    } else {
      setgstError('');
      setValue('gst', null)
    }
  }, [package_premium, premium]);


  return (
    <>
      <form className="container" onSubmit={handleSubmit(onSubmit)}>
        <div className="row g-3 ">
          <h3>Insurance Details</h3>
          {formFields.map((field) => {
            const showField = !field.adminOnly || (field.adminOnly && adminType === 'Admin');
            const fieldWidth = field.width || "col-md-6"; // default width

            return showField && (
              <div className={fieldWidth} key={field.id}>
                <label htmlFor={field.id} className="form-label">{field.label}</label>
                <input
                  type={field.type}
                  id={field.id}
                  className={`form-control ${errors[field.id] ? 'is-invalid' : ''}`}
                  {...register(field.id, field.validation)}
                  disabled={field.disabled}
                />
                {errors[field.id] && (
                  <div className="invalid-feedback">{errors[field.id].message}</div>
                )}
                {
                  gstError.trim() && (field.id === 'package_premium' || field.id === 'premium') && (
                    <div className="invalid-feedback">{gstError}</div>
                  )
                }
              </div>
            );
          })}


          {/* Agent Selection Field */}
            {/* Case Type */}
            <div className="col-md-3">
              <label htmlFor="case_type" className="form-label">Case type</label>
              <select
                id="case_type"
                className={`form-select ${errors.case_type ? 'is-invalid' : ''}`}
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
            {case_typeValue === 'agent' && (

              <div className="col-md-3">
                <label htmlFor="agent_id" className="form-label">Agent</label>
                <select
                  id="agent_id"
                  className={`form-select ${errors.agent_id ? 'is-invalid' : ''}`}
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
            {case_typeValue === 'office' && (
              <div className="col-md-3">
                <label htmlFor="emp_id" className="form-label">Office Employee</label>
                <select
                  id="emp_id"
                  className={`form-select ${errors.emp_id ? 'is-invalid' : ''}`}
                  {...register("emp_id", { required: "Employee is required" })}
                >
                  <option value="">Select Employee</option>
                  {User.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.full_name}
                    </option>
                  ))}
                  <option value={user_id}>self</option>
                </select>
                {errors.emp_id && (
                  <div className="invalid-feedback">{errors.emp_id.message}</div>
                )}
              </div>
            )}

          {/* Insurance Company */}
          <div className="col-md-3">
            <label htmlFor="insurance_company" className="form-label">Insurance Company</label>
            <select
              id="insurance_company"
              className={`form-select ${errors.insurance_company ? 'is-invalid' : ''}`}
              {...register("insurance_company", { required: "Insurance company is required" })}
            >
              <option value="">Select company</option>
              {comp.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.insurance_company && (
              <div className="invalid-feedback">{errors.insurance_company.message}</div>
            )}
          </div>

          <div className="col-md-3">
            <label htmlFor="business_type" className="form-label">Business Type</label>
            <select
              id="business_type"
              className={`form-select ${errors.business_type ? 'is-invalid' : ''}`}
              {...register("business_type", { required: "Insurance company is required" })}
            >
              <option value="">Select Business type</option>
              <option value="Fresh">Fresh</option>
              <option value="Renewal">Renewal</option>
            </select>
            {errors.business_type && (
              <div className="invalid-feedback">{errors.business_type.message}</div>
            )}
          </div>

          <div className="col-md-3 insurance-common-2-main">
          <label htmlFor="agent_id" className="form-label">Payment Mode</label>
          <select
            id="payment_mode"
            className={`form-select ${errors.payment_mode ? 'is-invalid' : ''}`}
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
        </div>


       

       

      <button type="submit" className="btn btn-primary mt-3">Submit</button>
    </form >
      <ToastContainer />

      
        </>
    );
}
