import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../api/axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
export default function InsuranceInitialDetails() {
  const navigate = useNavigate();
  const userID  = useSelector((state) => state.id);
   
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    insuranceType: "",
    segmentType: "",
    twoWheelerType: "",
    detailedType: ""
  });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, watch } = useForm();
  let { id } = useParams();

  const option1 = [
    { Heading: "SA OD", value: "SAOD" },
    { Heading: "Third Party", value: "ThirdParty" },
    { Heading: "Comprehensive", value: "COMPREHENSIVE" },
    { Heading: "New Vehicle", value: "NewVehicle" }
  ];

  const option2 = [
    { Heading: "PCV[Taxi, Rikshaw]", value: "PCV" },
    { Heading: "GCV [Truck,mini truck]", value: "GCV" },
    { Heading: "MISD [Ambulance, Elavator]", value: "MISD" },
  ];

  const optionNonMotor = [
    { Heading: "Halth Insurance", value: "Health Insurance" },
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
  ]

  const [selectedOption, setSelectedOption] = useState(option1);
  const [selectedOption2, setSelectedOption2] = useState(option1);
  const api = useApi();

  const insuranceType = watch("insuranceType");
  const segmentType = watch("segmentType");
  const twoWheelerType = watch("twoWheelerType");
  const detailedType = watch("detailedType");
  const [flag, setFlag] = useState(false);
  
  useEffect(() => {
    
    if (segmentType === "Commercial") {
      setSelectedOption2(option2)
    } else {
      setSelectedOption2(option1);
    }

    if (insuranceType === "Non-Motor") {
      setSelectedOption(optionNonMotor);
      setFlag(true);
    } else {
      setSelectedOption(optionMotor)
      setFlag(false);
    }

  }, [segmentType, insuranceType]);


  const handleNext = async () => {
    
    if (flag && step == 2) {
      let data = {
        insuranceType: insuranceType,
        segmentType: segmentType,
        twoWheelerType: '-',
        detailedType: '-',
        customerID: id,
        userID
      }
      try {
        const response = await api.post("/fill-initial-details", data);   
        if(response.data.success){
          navigate(`/common-insurance2/${response.data.id}`);
        }else{
          toast.error("Error while filling initial details");
        }
      } catch (error) {
        toast.error("Error while filling initial details");
      }

    }
    if (step < 3) {
      setStep(step + 1);
    }else{
      let data = {
        insuranceType: insuranceType,
        segmentType: segmentType,
        twoWheelerType: twoWheelerType,
        detailedType: detailedType,
        customerID: id,
        userID
      }
      try {
        const response = await api.post("/fill-initial-details", data);
        if(response.data.success){
          navigate(`/common-insurance1/${response.data.id}`);
        }else{
          toast.error("Error while filling initial details");
        }
      } catch (error) {
        toast.error("Error while filling initial details");
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const steps = [
    { number: 1, title: "Insurance Type" },
    { number: 2, title: "Segment Type" },
    { number: 3, title: "Vehicle Details" }
  ];

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center mb-4" style={{ color: "#2c3e50", fontWeight: "600" }}>
                Insurance Details
              </h2>



              <form onSubmit={handleSubmit(handleNext)} className="mt-4">
                {step === 1 && (
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-3" style={{ color: "#2c3e50" }}>
                      Select Insurance Type
                    </label>
                    <select
                      {...register("insuranceType", { required: "Insurance type is required" })}
                      className="form-select form-select-lg border-2"
                      style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        borderColor: errors.insuranceType ? "#dc3545" : "#dee2e6"
                      }}
                    >
                      <option value="">Choose insurance type</option>
                      <option value="Motor">Motor</option>
                      <option value="Non-Motor">Non-Motor</option>
                    </select>
                    {errors.insuranceType && (
                      <div className="text-danger mt-2 small">{errors.insuranceType.message}</div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-3" style={{ color: "#2c3e50" }}>
                      Select Segment Type
                    </label>
                    <select
                      {...register("segmentType", { required: "Segment type is required" })}
                      className="form-select form-select-lg border-2"
                      style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        borderColor: errors.segmentType ? "#dc3545" : "#dee2e6"
                      }}
                    >
                      <option value="">Choose segment type</option>
                      {selectedOption.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.Heading}
                        </option>
                      ))}
                    </select>
                    {errors.segmentType && (
                      <div className="text-danger mt-2 small">{errors.segmentType.message}</div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-3" style={{ color: "#2c3e50" }}>
                      Select Vehicle Type
                    </label>
                    <select
                      {...register("twoWheelerType", { required: "Vehicle type is required" })}
                      className="form-select form-select-lg border-2 mb-3"
                      style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        borderColor: errors.twoWheelerType ? "#dc3545" : "#dee2e6"
                      }}
                    >
                      <option value="">Choose vehicle type</option>
                      {selectedOption2.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.Heading}
                        </option>
                      ))}
                    </select>
                    {errors.twoWheelerType && (
                      <div className="text-danger mt-2 small">{errors.twoWheelerType.message}</div>
                    )}

                    <div className="mt-4">
                      <label className="form-label fw-semibold mb-3" style={{ color: "#2c3e50" }}>
                        Detailed Type
                      </label>
                      <input
                        type="text"
                        {...register("detailedType", { required: "Detailed type is required" })}
                        className="form-control form-control-lg border-2"
                        placeholder="Enter detailed type"
                        style={{
                          padding: "0.75rem 1rem",
                          borderRadius: "8px",
                          borderColor: errors.detailedType ? "#dc3545" : "#dee2e6"
                        }}
                      />
                      {errors.detailedType && (
                        <div className="text-danger mt-2 small">{errors.detailedType.message}</div>
                      )}
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-between mt-5">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="btn btn-outline-secondary btn-lg px-4"
                      style={{
                        borderRadius: "8px",
                        borderWidth: "2px",
                        fontWeight: "500"
                      }}
                    >
                      Previous
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn btn-primary btn-lg px-4 ms-auto"
                      disabled={!watch(step === 1 ? "insuranceType" : step === 2 ? "segmentType" : "twoWheelerType")}
                      style={{
                        borderRadius: "8px",
                        backgroundColor: "#3498db",
                        border: "none",
                        fontWeight: "500"
                      }}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-success btn-lg px-4 ms-auto"
                      disabled={isSubmitting}
                      style={{
                        borderRadius: "8px",
                        backgroundColor: "#2ecc71",
                        border: "none",
                        fontWeight: "500"
                      }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
