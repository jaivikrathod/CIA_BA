import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = "http://localhost:3005";

const InsuranceManagement = () => {
  const navigate = useNavigate();
  const [insurance, setInsurance] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchInsurance();
  }, []);

  const fetchInsurance = async () => {
    try {
      const response = await axios.post(`${api}/insurance-list`);
      setInsurance(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch insurance");
      console.error("Failed to fetch insurance:", error);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${api}/check-customer`, { email });

      if (response.data.success) {
        toast.success("Customer found!");
        setShowModal(false);
        navigate(`/insurance-initial/${response.data.customerId}`);
      } else {
        toast.error("No customer found with this email.");
      }
    } catch (error) {
      toast.error("Error checking customer.");
      console.error("API Error:", error);
    }
  };


  const renewInsurance = async (insuraceID) => {
    try {
        const response = await axios.post(`${api}/renew-insurance`, { insuraceID });
        if (response.data.id) {
            navigate(`/common-insurance2/${response.data.id}`)
        }
    } catch (error) {
        toast.error('Error while creating Insurance');
    }
}

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Page Title & Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Insurance Management</h2>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
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
                      <button onClick={()=> renewInsurance(customer.id)} className="btn btn-sm btn-outline-info">
                        Renew Insurance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bootstrap Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Enter customer's Email</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEmailSubmit}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    className="form-control mb-3"
                    required
                  />
                  <button type="submit" className="btn btn-primary w-100">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceManagement;
