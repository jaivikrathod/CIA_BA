import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate,useParams } from "react-router-dom";

export default function InsuranceInitialDetails() {
  const navigate = useNavigate();
  const api = "http://localhost:3005";
  const [step, setStep] = useState(1);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  let { id } = useParams();
  const option1 = [
    {Heading: "SA OD", value: "SAOD"},
    {Heading: "Third Party", value: "ThirdParty"},
    {Heading: "Comprehensive", value: "COMPREHENSIVE"},
    {Heading: "New Vehicle", value: "NewVehicle"}
  ];
    const option2 = [
    {Heading: "PCV[Taxi, Rikshaw]", value: "PCV"},
    {Heading: "GCV [Truck,mini truck]", value: "GCV"},
    {Heading: "MISD [Ambulance, Elavator]", value: "MISD"},
  ];

  const [selectedOption, setselectedOption] = useState(option1);

  const onSubmit = async (data) => {
    console.log(id);

    if (id !== "") {
      data.id = id;
    }

    if (data.detailedType) {
      data.detailedType = data.twoWheelerType + " , " + data.detailedType;
    }

    const response = await axios.post(api + "/fill-initial-details", data);
    if (response.data.id !== "") {
      id = response.data.id;
      console.log(response.data.id);
    }

    reset();

    if (data.insuranceType === "Non-Motor") {
      navigate(`/common-insurance2/${response.data.id}`);
    }
    
    if(data.segmentType === "Commercial") {
       setselectedOption(option2);
    }else{
      setselectedOption(option1);
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      console.log("Final Submission Data:", data);
      navigate(`/common-insurance1/${data.id}`);
      reset();
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
    reset();
  };


  return (
    <div className="container mt-5">
      <h1 className="text-center fw-bold">General Questions</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              {step === 1 && (
                <div className="mb-3">
                  <h5 className="fw-bold">Enter Insurance Type</h5>
                  <select {...register("insuranceType", { required: true })} className="form-select">
                    <option value="Motor">Motor</option>
                    <option value="Non-Motor">Non-Motor</option>
                  </select>
                  {errors.insuranceType && <p className="text-danger mt-1">This field is required</p>}
                </div>
              )}

              {step === 2 && (
                <div className="mb-3">
                  <h5 className="fw-bold">Enter Segment Type</h5>
                  <select {...register("segmentType", { required: true })} className="form-select">
                    <option value="Commercial">Commercial</option>
                    <option value="Private">Private Car</option>
                    <option value="TwoWheeler">Two Wheeler</option>
                  </select>
                  {errors.segmentType && <p className="text-danger mt-1">This field is required</p>}
                </div>
              )}

              {step === 3 && (
                <div className="mb-3">
                  <h5 className="fw-bold">Enter Two Wheeler Type</h5>
                  <select {...register("twoWheelerType", { required: true })} className="form-select">
                    {selectedOption.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.Heading}
                      </option>
                    ))}
                  </select>
                  {errors.twoWheelerType && <p className="text-danger mt-1">This field is required</p>}
                  <input type="text" {...register("detailedType", { required: true })} className="form-control mt-3" placeholder="Enter detailed type" />
                  {errors.detailedType && <p className="text-danger mt-1">This field is required</p>}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt-4">
                {step > 1 && (
                  <button type="button" onClick={handlePrev} className="btn btn-secondary">
                    Previous
                  </button>
                )}
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {step < 3 ? "Next" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

     </div>
  );
}
