import React from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function login() {
  const navigate = useNavigate();   
  const apiUrl = "http://localhost:3005";
  useEffect(() => {
    const checkAuth = async () => {
      const id = window.localStorage.getItem("id");
      const token = window.localStorage.getItem("token");

      if (token) {
        try {
          const response = await axios.post(`${apiUrl}/verify-token`, { id, token });
          if (response.data.success) {
            navigate('/dashboard');
          }
        } catch (error) {
          console.error("Error during token verification:", error);
        }
      }
    };

    checkAuth();
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const onLogin = async (data) => {
    const api = "http://localhost:3005";

    try {
      const response = await axios.post(api + "/login", data);
      if (response.data.success) {
        console.log(response.data);
        if(data.password == "Password@123"){
          navigate(`/change-password/${response.data.id}`);
        }else{
          window.localStorage.setItem('id', response.data.id);
          window.localStorage.setItem('token', response.data.token);
          location.reload();
        }
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  }
  return (
    <>
      <div className="d-flex vh-100 align-items-center justify-content-center bg-light">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="w-100" style={{ maxWidth: '400px' }}>
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4">Welcome Back</h2>
            <form onSubmit={handleSubmit(onLogin)}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-primary text-white">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter email"
                    {...register('email', { required: 'Username/Email is required' })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email.message}</div>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-primary text-white">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Enter your password"
                    {...register('password', { required: 'Password is required' })}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password.message}</div>
                  )}
                </div>
              </div>
              <div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
