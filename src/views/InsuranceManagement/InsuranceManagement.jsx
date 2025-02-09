import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api = "http://localhost:3005";

const InsuranceManagement = () => {
  const navigate = useNavigate();
  const [insurance, setInsurance] = useState([]);

  const fetchInsurance = async () => {
    try {
      const response = await axios.post(`${api}/insurance-list`);
      setInsurance(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch insurance');
      console.error('Failed to fetch insurance:', error);
    }
  };

  const CreateNew = () => {
    navigate('/insurance-initial');
  };

  useEffect(() => {
    fetchInsurance();
  }, []);

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      {/* Page Title & Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Insurance Management</h2>
        <button onClick={CreateNew} className="btn btn-primary">
          + New Insurance
        </button>
      </div>

      {/* Responsive Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Segment</th>
                  <th>Customer ID</th>
                  <th>Vehicle Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {insurance.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.segment}</td>
                    <td>{customer.customer_id}</td>
                    <td>{customer.vehicle_number}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-info">
                        Add Insurance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default InsuranceManagement;
