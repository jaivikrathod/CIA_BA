import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import useApi from '../../../api/axios';
import './Login.css';
import companyLogo from '../../../assets/care_insurance_logo.svg';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function ChangePass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const api = useApi();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if(data.password === "Password@123"){
      toast.error("New Password cannot be the default password");
      return;
    }

    try {
      const response = await api.post(`/change-password/${id}`, {
        password: data.password,
      });

      if (response.data.success) {
        toast.success("Password changed successfully");
        navigate("/login");
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
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
          <h2>Change Password</h2>
          <p>Enter your new password to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <div className="flex items-center gap-2 mb-2" style={{display: 'flex', justifyContent: 'space-between'}}>
              <label className="form-label m-0">New Password</label>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className=""
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
                style={{background: "white", color: 'black', border: 'none'}}
              >
                {showPassword ? <FiEyeOff size={18} className="mb-2" /> : <FiEye size={18} />}
              </button>
            </div>

            <input
              type={showPassword ? 'text' : 'password'}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Enter new password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <div className="form-group">
            <div className="flex items-center gap-2 mb-2" style={{display: 'flex', justifyContent: 'space-between'}}>
              <label className="form-label m-0">Confirm Password</label>
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className=""
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
                style={{background: "white", color: 'black', border: 'none'}}
              >
                {showConfirmPassword ? <FiEyeOff size={18} className="mb-2" /> : <FiEye size={18} />}
              </button>
            </div>

            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              placeholder="Confirm new password"
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
          </div>

          <button type="submit" className="login-btn">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
