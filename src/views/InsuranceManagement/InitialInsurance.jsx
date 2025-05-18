import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../api/axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InsuranceInitialDetails() {
  const navigate = useNavigate();
  const userID = useSelector((state) => state.id);
  const { id } = useParams();
  const api = useApi();

  const [step, setStep] = useState(1);
  const [flag, setFlag] = useState(false);

  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedOption2, setSelectedOption2] = useState([]);
  const [initialInsuranceID, setinitialInsuranceID] = useState(0);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    watch,
    reset,
  } = useForm();

  useEffect(() => {
    fetchStatus();
    setStep(1);
    setFlag(false);
  }, []);


  const fetchStatus = async ()=>{
    try{
      const response =  await api.get('/getInitialInsuranceStatus',{params:{customer_id:id}});
      if(response.data.success){    
           reset(response.data.data);
           setinitialInsuranceID(response.data.data.id);
      }
    }catch(err){
      console.log(err.response.data.message);
    }
  }



  const insurance_type = watch("insurance_type");
  const segment = watch("segment");
  const segment_vehicle_type = watch("segment_vehicle_type");
  const segment_vehicle_detail_type = watch("segment_vehicle_detail_type");

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

  useEffect(() => {
    if (insurance_type === "Non-Motor") {
      setSelectedOption(optionNonMotor);
      setFlag(true);
    } else {
      setSelectedOption(optionMotor);
      setFlag(false);
    }

    if (segment === "Commercial") {
      setSelectedOption2(option2);
    } else {
      setSelectedOption2(option1);
    }
  }, [insurance_type, segment]);

  const onSubmit = async () => {
    
    if ((flag && step === 2) || (!flag && step === 3)) {

    } else if (step < 3) {
      setStep(step + 1);
      return;
    }else{
      return;
    }
    
    const data = {
      id:initialInsuranceID,
      insurance_type: insurance_type,
      segment: segment,
      segment_vehicle_type: flag ? "-" : segment_vehicle_type,
      segment_vehicle_detail_type: flag ? "-" : segment_vehicle_detail_type,
      customer_id: id,
      user_id:userID,
    };

    try {
      const response = await api.post("/fill-initial-details", data);
      if (response.data.success) {
        let id = initialInsuranceID != 0 ?initialInsuranceID: response.data.id;
        const redirectPath = flag
          ? `/common-insurance2/${id}/0`
          : `/common-insurance1/${id}`;
        navigate(redirectPath);
      } else {
        toast.error("Error while filling initial details");
      }
    } catch (error) {
      toast.error("Error while filling initial details");
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="container-fluid py-4">
      <ToastContainer />
      <div className="initial-insurance">
        <div className="col-lg-6 col-md-8 mx-auto">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4" style={{ color: "#2c3e50", fontWeight: "600" }}>
                Insurance Details
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
                {step === 1 && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Select Insurance Type</label>
                    <select
                      {...register("insurance_type", { required: "Insurance type is required" })}
                      className="form-select border-2"
                      style={{ borderColor: errors.insurance_type ? "#dc3545" : "#dee2e6" }}
                    >
                      <option value="">Choose insurance type</option>
                      <option value="Motor">Motor</option>
                      <option value="Non-Motor">Non-Motor</option>
                    </select>
                    {errors.insurance_type && (
                      <div className="text-danger mt-1 small">{errors.insurance_type.message}</div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Select Segment Type</label>
                    <select
                      {...register("segment", { required: "Segment type is required" })}
                      className="form-select border-2"
                      style={{ borderColor: errors.segment ? "#dc3545" : "#dee2e6" }}
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
                )}

                {step === 3 && !flag && (
                  <div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Select Vehicle Type</label>
                      <select
                        {...register("segment_vehicle_type", { required: "Vehicle type is required" })}
                        className="form-select border-2"
                        style={{
                          borderColor:
                            touchedFields.segment_vehicle_type && errors.segment_vehicle_type
                              ? "#dc3545"
                              : "#dee2e6",
                        }}
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

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Detailed Type</label>
                      <input
                        type="text"
                        {...register("segment_vehicle_detail_type", { required: "Detailed type is required" })}
                        className="form-control border-2"
                        placeholder="Enter detailed type"
                        style={{
                          borderColor:
                            touchedFields.segment_vehicle_detail_type && errors.segment_vehicle_detail_type
                              ? "#dc3545"
                              : "#dee2e6",
                        }}
                      />
                      {touchedFields.segment_vehicle_detail_type && errors.segment_vehicle_detail_type && (
                        <div className="text-danger mt-1 small">{errors.segment_vehicle_detail_type.message}</div>
                      )}
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-between mt-4">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="btn btn-outline-secondary px-4"
                    >
                      Previous
                    </button>
                  )}

                    <button
                      type="submit"
                      className="btn btn-primary px-4 ms-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Next"}
                    </button>
                  
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
