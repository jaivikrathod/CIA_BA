import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

export default function ChangePass() {
  const { id } = useParams(); // Get ID from route
  const navigate = useNavigate();
  const apiUrl = "http://localhost:3005";

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if(data.password == "Password@123"){
      toast.error("New Password cannot be the default password");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/change-password/${id}`, {
        password: data.password,
      });

      if (response.data.success) {
        toast.success("Password changed successfully");
        navigate("/login");
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="d-flex vh-100 align-items-center justify-content-center bg-light">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="card shadow-sm p-4">
          <h2 className="text-center mb-4">Change Password</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter new password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Confirm new password"
                {...register('confirmPassword', { required: 'Confirm Password is required' })}
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
