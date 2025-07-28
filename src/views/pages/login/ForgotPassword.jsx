import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useApi from '../../../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import './Login.css';
import companyLogo from '../../../assets/care_insurance_logo.svg';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isotpSent, setisotpSent] = useState(false);

    const api = useApi();

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            if (isotpSent) {
                const response = await api.post("/verify-otp", data);
                if (response.data.success) {
                    navigate(`/change-password/${response.data.id}`);
                } else {
                    toast.error('Failed to verify-otp. Please try again.');
                }
            } else {
                const response = await api.post("/forgot-password", data);
                if (response.data.success) {
                    toast.success('Password reset instructions sent to your email');
                    setisotpSent(true);
                } else {
                    toast.error('Failed to process request. Please try again.');
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="login-card">
                <div className="login-header">
                    <img
                        src={companyLogo}
                        alt="Care Insurance Logo"
                        className="company-logo"
                    />
                    <h2>Reset Password</h2>
                    <p>Enter your email to receive OTP</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>

                        <div className="relative">
                            <i className="bi bi-envelope absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />

                            <input
                                type="email"
                                className={`form-control pl-10 ${errors.email ? 'is-invalid' : ''}`}
                                placeholder="Enter your email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                disabled={isotpSent}
                            />
                        </div>

                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>
                    {
                        isotpSent && <>
                            <div className="form-group">
                                <label className="form-label">Enter OTP</label>

                                <div className="relative">
                                    <i className="bi bi-envelope absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />

                                    <input
                                        type="text"
                                        className={`form-control pl-10 ${errors.otp ? 'is-invalid' : ''}`}
                                        placeholder="Enter your otp"
                                        {...register('otp', {
                                            required: 'OTP is required',
                                        })}
                                    />
                                </div>

                                {errors.otp && <div className="invalid-feedback">{errors.otp.message}</div>}
                            </div>
                        </>
                    }

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && !isotpSent ? 'Sending...' : 'Send OTP'}
                        {isotpSent && 'Verify OTP'}
                    </button>

                    <div className="forgot-password">
                        <Link to="/login">Back to Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
} 