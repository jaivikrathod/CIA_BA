import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useApi from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function InsuranceCommonDetails1() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const  axios  = useApi();
  const { id } = useParams();
  const [models, setModels] = useState([]);
  const userid = useSelector((state)=>state.id);

  const cars = {
    manufacturers: [
      {
        name: "Toyota",
        vehicles: ["Corolla", "Camry", "RAV4", "Fortuner"],
      },
      {
        name: "Honda",
        vehicles: ["Civic", "Accord", "Activa", "CBR 650R"],
      },
      {
        name: "Bajaj",
        vehicles: ["Pulsar", "Avenger", "Dominar 400", "CT 100"],
      },
      {
        name: "Tesla",
        vehicles: ["Model S", "Model 3", "Model X", "Model Y"],
      },
    ],
  };

  const handleManufacturerChange = (manufacturer) => {
    const selectedManufacturer = cars.manufacturers.find(
      (item) => item.name === manufacturer
    );
    setModels(selectedManufacturer ? selectedManufacturer.vehicles : []);
  };

  const onSubmit = async (data) => {
    data.id = id;
    data.userid = userid;
    try {
      const response = await axios.post("/common-vehical", data);
      if (response.data.message) {
        toast.success("Form submitted successfully!");
        navigate(`/common-insurance2/${data.id}`);
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
    <div className="container mt-5">
      <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="Register_No" className="form-label">
            Register No
          </label>
          <input
            type="text"
            id="Register_No"
            className={`form-control ${errors.Register_No ? "is-invalid" : ""}`}
            placeholder="GJ01xxxx"
            {...register("Register_No", { required: "Register No is required" })}
          />
          {errors.Register_No && <div className="invalid-feedback">{errors.Register_No.message}</div>}
        </div>

        <div className="col-md-6">
          <label htmlFor="Manufacturer" className="form-label">
            Manufacturer
          </label>
          <select
            id="Manufacturer"
            className={`form-select ${errors.Manufacturer ? "is-invalid" : ""}`}
            {...register("Manufacturer", { required: "Manufacturer is required" })}
            onChange={(e) => handleManufacturerChange(e.target.value)}
          >
            <option value="">Select Manufacturer</option>
            {cars.manufacturers.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.Manufacturer && <div className="invalid-feedback">{errors.Manufacturer.message}</div>}
        </div>

        <div className="col-md-6">
          <label htmlFor="Model" className="form-label">
            Model
          </label>
          <select
            id="Model"
            className={`form-select ${errors.Model ? "is-invalid" : ""}`}
            {...register("Model", { required: "Model is required" })}
          >
            <option value="">Select Model</option>
            {models.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>
          {errors.Model && <div className="invalid-feedback">{errors.Model.message}</div>}
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
          <label htmlFor="YOM" className="form-label">
            Year of Manufacture
          </label>
          <input
            type="number"
            id="YOM"
            className={`form-control ${errors.YOM ? "is-invalid" : ""}`}
            placeholder="YYYY"
            {...register("YOM", { required: "Year of Manufacture is required" })}
          />
          {errors.YOM && <div className="invalid-feedback">{errors.YOM.message}</div>}
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
