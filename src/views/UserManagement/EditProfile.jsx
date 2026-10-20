import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import useApi from "../../api/axios";
import { useSelector } from "react-redux";

export default function InsuranceCommonDetails1() {
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
    } = useForm();

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
        reset: resetPasswordForm,
        watch,
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
                error.response?.data?.message || "An error occurred while fetching user details."
            );
        }
    };

    // Profile Update Submit
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

    // Password Change Submit
    const onPasswordSubmit = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }

        try {
            const response = await axios.post(`/change-password/${user_id}`, {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            });

            if (response.data.success) {
                toast.success("Password updated successfully!");
                resetPasswordForm();
            } else {
                throw new Error("Password change failed");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "An error occurred while changing password."
            );
        }
    };

    return (
        <div className="container">
            <Toaster position="top-right" />

            {/* Profile Update */}
            <div className="page-card">
            <div className="row mb-4">
                <div className="col-12">
                    <h2>Update Profile</h2>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="full_name" className="form-label">Full name</label>
                    <input
                        type="text"
                        id="full_name"
                        className={`form-control ${errors.full_name ? "is-invalid" : ""}`}
                        placeholder="Enter Full Name"
                        {...register("full_name", { required: "Full name is required" })}
                    />
                    {errors.full_name && <div className="invalid-feedback">{errors.full_name.message}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="text"
                        id="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        placeholder="Enter email"
                        {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="mobile" className="form-label">Mobile</label>
                    <input
                        type="text"
                        id="mobile"
                        className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                        {...register("mobile", { required: "Mobile number is required" })}
                    />
                    {errors.mobile && <div className="invalid-feedback">{errors.mobile.message}</div>}
                </div>

                <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
            </div>

            {/* Change Password */}
            <div className="page-card">
            <div className="row mb-4">
                <div className="col-12">
                    <h2>Change Password</h2>
                </div>
            </div>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="oldPassword" className="form-label">Old Password</label>
                    <input
                        type="password"
                        id="oldPassword"
                        className={`form-control ${passwordErrors.oldPassword ? "is-invalid" : ""}`}
                        {...registerPassword("oldPassword", { required: "Old password is required" })}
                    />
                    {passwordErrors.oldPassword && <div className="invalid-feedback">{passwordErrors.oldPassword.message}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        className={`form-control ${passwordErrors.newPassword ? "is-invalid" : ""}`}
                        {...registerPassword("newPassword", { required: "New password is required" })}
                    />
                    {passwordErrors.newPassword && <div className="invalid-feedback">{passwordErrors.newPassword.message}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className={`form-control ${passwordErrors.confirmPassword ? "is-invalid" : ""}`}
                        {...registerPassword("confirmPassword", { required: "Confirm password is required" })}
                    />
                    {passwordErrors.confirmPassword && <div className="invalid-feedback">{passwordErrors.confirmPassword.message}</div>}
                </div>

                <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary">Change Password</button>
                </div>
            </form>
            </div>
        </div>
    );
}
