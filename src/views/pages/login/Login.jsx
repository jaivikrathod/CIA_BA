import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import './Login.css';
import companyLogo from '../../../assets/care_insurance_logo.svg';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import useApi from '../../../api/axios';

export default function Login() {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, []);

  const api = useApi();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onLogin = async (data) => {
    try {
      const response = await api.post("/login", data);
      console.log(response.data);
      
      if (response.data.success) {
        if (data.changePassword) {
          navigate(`/change-password/${response.data.data.id}`);
        } else {
          window.localStorage.setItem('id', response.data.data.id);
          window.localStorage.setItem('token', response.data.data.token);
          dispatch({ type: 'set', id: response.data.data.id, token: response.data.data.token, isAuthenticated: true, username: response.data.data.full_name, adminType: response.data.data.type });
          navigate('/dashboard');
        }
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit(onLogin)}>
          {/* --- EMAIL ------------------------------------------------------ */}
          <div className="form-group">
            <label className="form-label">Email Address</label>

            <div className="relative">      {/* relative wrapper for absolute icon */}
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
              />
            </div>

            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          {/* PASSWORD FIELD WITH ICON NEXT TO LABEL */}
          <div className="form-group">
            <div className="flex items-center gap-2 mb-2" style={{display: 'flex', justifyContent: 'space-between'}}>
              <label className="form-label m-0">Password</label>
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
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required'
              })}
            />

            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>




          <button type="submit" className="login-btn">
            Sign In
          </button>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
