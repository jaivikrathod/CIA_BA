import React, { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MediaUploadModal from '../UploadDoc/MediaUploadModal';
import "../../scss/CustomerManagement.css";
import { FaInfoCircle, FaUpload, FaSyncAlt } from "react-icons/fa";
import useApi from "../../api/axios";

const InsuranceManagement2 = () => {
    const navigate = useNavigate();
    const [insurance, setInsurance] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState("");
    const [uploadModal, setUploadModal] = useState({ show: false, id: null });

    const api = useApi();

    useEffect(() => {
        fetchInsurance();
    }, []);

    const fetchInsurance = async () => {
        try {
            const response = await api.post(`/insurance-list`);
            setInsurance(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch insurance");
            console.error("Failed to fetch insurance:", error);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(`/check-customer`, { email });
            console.log(response);

            if (response.data.success) {
                toast.success("Customer found!");
                setShowModal(false);
                navigate(`/insurance-initial/${response.data.id}`);
            } else {
                toast.error("No customer found with this email.");
            }
        } catch (error) {
            toast.error("Error checking customer.");
            console.error("API Error:", error);
        }
    };

    const renewInsurance = async (insuraceID,common_id) => {
        navigate(`/common-insurance2/${insuraceID}/${common_id}`, { state: { type: true } });
    }

    const openUploadModal = (id) => {
        setUploadModal({ show: true, id });
    };

    const closeUploadModal = () => {
        setUploadModal({ show: false, id: null });
    };

    const getParticularInsurance = async (common_id) => {
        navigate('/insurance-detail/' + common_id);
    }

    return (
        <div className="container mt-4">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            {/* Page Title & Button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Insurance Management</h2>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>New Insurance
                </button>
            </div>

            {/* Responsive Table */}
            {insurance.length === 0 ? (
                <div className="alert alert-info text-center" role="alert">
                    No Insurance found. Please add a new insurance.</div>
            ) : (<>

                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>Sr.No</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {insurance.map((insurance, item) => (
                                <tr key={insurance.id}>
                                    <td>{item + 1}</td>
                                    <td>{insurance.full_name}</td>
                                    <td>{insurance.email}</td>
                                    <td>{insurance.insurance_type}</td>
                                    <td>{new Date(insurance.insurance_date).toLocaleDateString('en-GB')}</td> 
                                    <td> <button
                                        className="btn btn-link"
                                        onClick={() => getParticularInsurance(insurance.common_id)}
                                        title="Info"
                                    >
                                        <FaInfoCircle />
                                    </button>
                                        <button
                                            onClick={() => renewInsurance(insurance.id,insurance.common_id)}
                                            className="btn btn-link"
                                            title="Renew Insurance"
                                        >
                                            <FaSyncAlt />

                                        </button>
                                        <button
                                            onClick={() => openUploadModal(insurance.id)}
                                            className="btn btn-link"
                                            title="Upload"
                                        >
                                            <FaUpload />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>)}



            {/* Media Upload Modal */}
            < MediaUploadModal
                customerId={uploadModal.id}
                show={uploadModal.show}
                isCustomerDoc={false}
                handleClose={closeUploadModal}
            />

            {/* Email Modal */}
            {
                showModal && (
                    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header bg-dark text-white">
                                    <h5 className="modal-title fw-bold">Enter Customer's Email</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
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
                )
            }
        </div >
    );
};



export default InsuranceManagement2;