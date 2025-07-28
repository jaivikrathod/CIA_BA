import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import useApi from "../../api/axios";
import { useSelector } from "react-redux";

export default function InsuranceCommonDetails1() {
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty, touchedFields },
        reset,
        setValue,
    } = useForm();

    const axios = useApi();
    const user_id = useSelector((state) => state.id);

    useEffect(() => {
        fetchUserDetail();
    }, []);

    const fetchUserDetail = async () => {
        try {
            const response = await axios.get("/particular-user-detail", { params: { user_id } });

            if (response.data.success) {
                reset(response.data.data);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "An error occurred while submitting the form."
            );
        }
    }

    const onSubmit = async (data) => {
        if (!isDirty) {
            toast.error("No changes were made to update");
            return;
        }

        data.id = user_id;
        try {
            const response = await axios.post("/update-particular-user", data);
            if (response.data.message) {
                toast.success("Details updated successfully!");
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
            <Toaster position="top-right" />
            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="" style={{ color: "#2c3e50", fontWeight: "600" }}>
                        Update Profile
                    </h2>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="full_name" className="form-label">
                        Full name
                    </label>
                    <input
                        type="text"
                        id="full_name"
                        className={`form-control ${errors.full_name ? "is-invalid" : ""}`}
                        placeholder="Enter Full Name"
                        {...register("full_name", {
                            required: "Full name is required",
                        })}
                    />
                    {errors.full_name && <div className="invalid-feedback">{errors.full_name.message}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="text"
                        id="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        placeholder="Enter email"
                        {...register("email", {
                            required: "Email is required",
                        })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="mobile" className="form-label">
                        Mobile
                    </label>
                    <input
                        type="text"
                        id="mobile"
                        className={`form-control ${errors.mobile ? "is-invalid" : ""}`}

                        {...register("mobile", {
                            required: "Mobile number is required",
                        })}
                    />
                    {errors.mobile && <div className="invalid-feedback">{errors.mobile.message}</div>}
                </div>

                <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
