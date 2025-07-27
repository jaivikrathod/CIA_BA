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
  const [manufacturers, setManufacturers] = useState([]);
  const [vehicle, setvehicle] = useState([]); // default to empty array
  const user_id = useSelector((state)=>state.id);

  const manufacturer = watch("manufacturer");
  const model = watch("model");

  // Fetch vehicle details and set manufacturers
  const fetchVehicleDetails = async () => {
    try {
      const response = await axios.get('/cars');

      if (response.data.success) {
        
        setvehicle(response.data.data);
        // Extract unique manufacturers
        const uniqueManufacturers = [
          ...new Set(response.data.data.map((item) => item.company_name))
        ];
        setManufacturers(uniqueManufacturers);
        console.log(uniqueManufacturers);
        
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching vehicles");
    }
  };

  useEffect(() => {
    fetchVehicleDetails(); 
  }, []);

  // Update models when manufacturer changes
  useEffect(() => {
    if (manufacturer && vehicle.length > 0) {
      const filteredModels = vehicle
        .filter((item) => item.company_name === manufacturer)
        .map((item) => item.model_name);
      setmodels(filteredModels);
    } else {
      setmodels([]);
    }
  }, [manufacturer, vehicle]);

  // Effect to handle model value after models are set
  useEffect(() => {
    const setModelValue = async () => {
      if (models.length > 0 && model) {
        const modelExists = models.includes(model);
        if (!modelExists) {
          setValue('model', '');
        }
      }
    };
    setModelValue();
  }, [models, model]);

  useEffect(() => {
    const fetchCommonInsuranceDetail = async () => {
      try {
        const response = await axios.get(`/get-common-insurance/${id}`);
        if (response.data.success) {
          const data = response.data.data;
          // Set manufacturer and model from fetched data
          if (data.manufacturer) {
            setValue('manufacturer', data.manufacturer);
          }
          if (data.model) {
            setValue('model', data.model);
          }
          // Set other form values
          reset(data);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (id) {
      fetchCommonInsuranceDetail();
    }
  }, [id, reset, setValue]);

  const onSubmit = async (data) => {
    data.id = id;
    data.user_id = user_id;
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
            manufacturer
          </label>
          <select
            id="manufacturer"
            className={`form-select ${touchedFields.manufacturer && errors.manufacturer ? "is-invalid" : ""}`}
            {...register("manufacturer", { 
              required: "manufacturer is required",
              onChange: (e) => {
                setValue("model", ""); // Reset model when manufacturer changes
              }
            })}
          >
            <option value="">Select manufacturer</option>
            {manufacturers.map((name) => (
              <option key={name} value={name}>
                {name}
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
              required: "model is required",
              validate: value => {
                if (!manufacturer) return "Please select a manufacturer first";
                return true;
              }
            })}
          >
            <option value="">Select model</option>
            {models.map((model, index) => (
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
                value: 1900,
                message: "Year cannot be before 1900"
              },
              max: {
                value: new Date().getFullYear(),
                message: "Year cannot be in the future"
              },
              validate: value => {
                if (value < 1900 || value > new Date().getFullYear()) {
                  return "Please enter a valid year between 1900 and " + new Date().getFullYear();
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
