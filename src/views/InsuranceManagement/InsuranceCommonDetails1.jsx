import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useApi from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function InsuranceCommonDetails1() {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, touchedFields },
    reset,
    setValue,
    watch
  } = useForm();

  const navigate = useNavigate();
  const axios = useApi();
  const { id } = useParams();
  const [models, setmodels] = useState([]);
  const [vehicleCompany, setvehicleCompany] = useState([]);
  const [vehicleModel, setvehicleModel] = useState([]);
  const [fetchedData, setFetchedData] = useState(null);
  const [pendingModelValue, setPendingModelValue] = useState(null);
  const user_id = useSelector((state) => state.id);

  const manufacturer = watch("manufacturer");
  const model = watch("model");


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


  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async ()=>{
     await fetchVehicleDetails();
     await fetchCommonInsuranceDetail();
  }

  const fetchCommonInsuranceDetail = async () => {
    try {
      const response = await axios.get(`/get-common-insurance/${id}`);
      if (response.data.success) {
        const data = response.data.data;
        setFetchedData(data);
        reset(data);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const setFormValues = (data) => {
    if (data.manufacturer && vehicleCompany.length > 0) {
      const manufacturerValue = vehicleCompany.find((item)=>item.company_name== data.manufacturer);          
      if (manufacturerValue) {
        setValue('manufacturer', JSON.stringify(manufacturerValue));
        if (data.model) {
          setPendingModelValue(data.model);
        }
      }
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

  useEffect(() => {   
    if(manufacturer && manufacturer !== ""){
      try {
        const manufacturerObj = JSON.parse(manufacturer);
        if(manufacturerObj && manufacturerObj.id){ 
          fetchModelsAccordingToCompany();
        }
      } catch (error) {
        console.error("Error parsing manufacturer:", error);
      }
    }

  }, [manufacturer]);

  useEffect(() => {
    if (vehicleCompany.length > 0 && fetchedData) {
      setFormValues(fetchedData);
    }
  }, [vehicleCompany, fetchedData]);


  useEffect(() => {
    if (vehicleModel.length > 0 && pendingModelValue) {
      setValue('model', pendingModelValue);
      setPendingModelValue(null);
    }
  }, [vehicleModel, pendingModelValue]);

  const onSubmit = async (data) => {
    data.id = id;
    data.user_id = user_id;
    let manufacturer = JSON.parse(data.manufacturer);
    data.manufacturer = manufacturer.company_name;
    try {
      const response = await axios.post("/common-vehical", data);
      if (response.data.message) {
        toast.success("Form submitted successfully!");
        navigate(`/common-insurance2/${data.id}/0`);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while submitting the form."
      );
    }
  };

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="" style={{ color: "#2c3e50", fontWeight: "600" }}>
            Vehicle Details
          </h2>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="vehicle_number" className="form-label">
            Vehicle Number
          </label>
          <input
            type="text"
            id="vehicle_number"
            className={`form-control ${errors.vehicle_number ? "is-invalid" : ""}`}
            placeholder="GJ01xxxx"
            {...register("vehicle_number", {
              required: "Register No is required",
              pattern: {
                value: /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/,
                message: "Invalid vehicle number format (e.g., GJ01AB1234)"
              }
            })}
          />
          {errors.vehicle_number && <div className="invalid-feedback">{errors.vehicle_number.message}</div>}
        </div>

        <div className="col-md-6">
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
          >
            <option value="">Select manufacturer</option>
            {vehicleCompany.map((item) => (
              <option key={item.id} value={JSON.stringify(item)}>
                {item.company_name}
              </option>
            ))}
          </select>
          {touchedFields.manufacturer && errors.manufacturer && (
            <div className="invalid-feedback">{errors.manufacturer.message}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="model" className="form-label">
            Model
          </label>
          <select
            id="model"
            className={`form-select ${touchedFields.model && errors.model ? "is-invalid" : ""}`}
            {...register("model", {
              required: "Vehicle Model is required"
            })}
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

        <div className="col-md-6">
          <label htmlFor="fuel_type" className="form-label">
            Fuel Type
          </label>
          <select
            id="fuel_type"
            className={`form-select ${errors.fuel_type ? "is-invalid" : ""}`}
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

        <div className="col-md-6">
          <label htmlFor="yom" className="form-label">
            Purchase year
          </label>
          <input
            type="number"
            id="yom"
            className={`form-control ${errors.yom ? "is-invalid" : ""}`}
            placeholder="YYYY"
            {...register("yom", {
              required: "Purchase year is required",
              min: {
                value: 1800,
                message: "Year cannot be before 1800"
              },
              max: {
                value: new Date().getFullYear(),
                message: "Year cannot be in the future"
              },
              validate: value => {
                if (value < 1800 || value > new Date().getFullYear()) {
                  return "Please enter a valid year between 1800 and " + new Date().getFullYear();
                }
                return true;
              }
            })}
          />
          {errors.yom && <div className="invalid-feedback">{errors.yom.message}</div>}
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
