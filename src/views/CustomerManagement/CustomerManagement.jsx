import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MediaUploadModal from '../UploadDoc/MediaUploadModal';
import "../../scss/CustomerManagement.css";
import { FaInfoCircle, FaEdit, FaTrash, FaPlusSquare, FaUpload, FaEye, FaDownload } from "react-icons/fa";
import pdfImage from "../../assets/images/pdf.jpg";

const api = "http://localhost:3005";

const CustomerManagement = () => {
    const [isReadable, setisReadable] = useState(false);
    const [uploadModal, setUploadModal] = useState({ show: false, id: null });

    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });

    const fetchCustomers = async () => {
        try {
            const response = await axios.post(`${api}/customer-list`);
            setCustomers(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch customers');
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);


    const handleDeleteCustomer = async (id) => {
        try {
            await axios.post(`${api}/customer-delete`, { id });
            toast.success('Customer deleted successfully');
            setConfirmDelete({ show: false, id: null });
            fetchCustomers();
        } catch (error) {
            toast.error('Error deleting customer');
        }
    };

    const addNewInsurance = async (customerID) => {

        try {
            const response = await axios.post(`${api}/create-insurance`, { customerID });
            if (response.data.id) {
                navigate(`/insurance-initial/${response.data.id}`)
            }
        } catch (error) {
            toast.error('Error while creating Insurance');
        }
    }

    const openUploadModal = (id) => {
        setUploadModal({ show: true, id });
    };
    const closeUploadModal = () => {
        setUploadModal({ show: false, id: null });
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        gender: "",
        ageRange: ""
    });

    // Filter customers based on search and filters
    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGender = filters.gender ? customer.gender == filters.gender : true;
        const matchesAge = filters.ageRange ? (
            filters.ageRange === "0-18" ? customer.age <= 18 :
                filters.ageRange === "19-35" ? customer.age > 18 && customer.age <= 35 :
                    filters.ageRange === "36-60" ? customer.age > 35 && customer.age <= 60 :
                        customer.age > 60
        ) : true;
        return matchesSearch && matchesGender && matchesAge;
    });

    // Download CSV
    const downloadCSV = () => {
        const headers = ["Sr. No.", "Name", "Email", "Primary Mobile", "Age", "Gender", "Address"];
        const rows = filteredCustomers.map((customer, index) => [
            index + 1,
            customer.full_name,
            customer.email,
            customer.primary_mobile,
            customer.age || "N/A",
            customer.gender || "N/A",
            customer.full_address || "N/A"
        ]);

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += headers.join(",") + "\n";
        rows.forEach(row => csvContent += row.join(",") + "\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "customers.csv");
        document.body.appendChild(link);
        link.click();
    };


    return (
        <div className="container">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            <div className="container-fluid p-3">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Customer Management</h2>
                    <button className="btn btn-primary" onClick={() => { setSelectedCustomer({}), setisReadable(true) }}>
                        <FaPlusSquare /> New Customer
                    </button>
                </div>

                {/* Search and Filter Section */}
                <div className="row mb-3">
                    <div className="col-md-4 mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name or email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3 mb-2">
                        <select
                            className="form-control"
                            value={filters.gender}
                            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                        >
                            <option value="">All Genders</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="col-md-3 mb-2">
                        <select
                            className="form-control"
                            value={filters.ageRange}
                            onChange={(e) => setFilters({ ...filters, ageRange: e.target.value })}
                        >
                            <option value="">All Ages</option>
                            <option value="0-18">0-18</option>
                            <option value="19-35">19-35</option>
                            <option value="36-60">36-60</option>
                            <option value="60+">60+</option>
                        </select>
                    </div>
                    <div className="col-md-2 mb-2">
                        <button className="btn btn-success w-100" onClick={downloadCSV}>
                            <FaDownload /> Download CSV
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>Sr. No.</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Primary Mobile</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Address</th>
                                <th>Actions</th>
                                <th>Files & Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer, index) => (
                                <tr key={customer.id}>
                                    <td>{index + 1}</td>
                                    <td>{customer.full_name}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.primary_mobile}</td>
                                    <td>{customer.age || 'N/A'}</td>
                                    <td>{customer.gender || 'N/A'}</td>
                                    <td>{customer.full_address || 'N/A'}</td>
                                    <td>
                                        <button
                                            className="btn btn-link"
                                            onClick={() => setSelectedCustomer(customer)}
                                            title="Info"
                                        >
                                            <FaInfoCircle />
                                        </button>
                                        <button
                                            className="btn btn-link text-danger"
                                            onClick={() => setConfirmDelete({ show: true, id: customer.id })}
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-link text-info"
                                            onClick={() => addNewInsurance(customer.id)}
                                            title="Add Insurance"
                                        >
                                            <FaPlusSquare />
                                        </button>
                                        <button
                                            className="btn btn-link text-primary"
                                            onClick={() => openUploadModal(customer.id)}
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
            </div>


            <MediaUploadModal
                customerId={uploadModal.id}
                show={uploadModal.show}
                isCustomerDoc={true}
                handleClose={() => setUploadModal({ show: false, id: null })}
            />

            {/* Customer Form Modal */}
            {selectedCustomer !== null && (
                <CustomerForm customer={selectedCustomer} onClose={() => {
                    setSelectedCustomer(null);
                    fetchCustomers();
                    setisReadable(false);
                }} setisReadable={setisReadable} isReadable={isReadable}
                />
            )}

            {/* Delete Confirmation Modal */}
            {confirmDelete.show && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={() => setConfirmDelete({ show: false, id: null })}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this customer?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" onClick={() => handleDeleteCustomer(confirmDelete.id)}>
                                    Confirm
                                </button>
                                <button className="btn btn-secondary" onClick={() => setConfirmDelete({ show: false, id: null })}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// Customer Form Component
const CustomerForm = ({ customer, onClose, setisReadable, isReadable }) => {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: customer || {}
    });

    const [selectedID, setselectedID] = useState(customer.id);

    useEffect(() => {
        if (customer) {
            Object.keys(customer).forEach((field) => setValue(field, customer[field]));
        }
    }, [customer, setValue]);
    const [path, setpath] = useState('http://localhost:3005/get-customer-uploads');

    const onSubmit = async (data) => {
        try {
            await axios.post(`${api}/customer-create-edit`, data);
            toast.success('Customer saved successfully!');
            reset();
            onClose();
        } catch (error) {
            toast.error('Error saving customer');
        }
    };

    const deleteDocument = async (document) => {
        try {
            const response = await axios.post(`${api}/delete-customer-document`, { selectedID, document });
            if (response.data.success) {
                setdocuments(documents.filter(doc => doc.name !== document));
                toast.success('Document deleted successfully');
            } else {
                console.log("djfhb");
                toast.error('Error deleting document');
            }
        } catch (error) {
            console.log(error);
            toast.error('Error deleting document');
        }
    }
    const [documents, setdocuments] = useState(customer.documents ? JSON.parse(customer.documents) : []);


    return (
        <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'hidden' }}>
                    <div className="modal-header bg-dark text-white">
                        {isReadable && <h5 className="modal-title">{customer.id ? 'Edit Customer' : 'New Customer'}</h5>}
                        {!isReadable && <><h5 className="modal-title">Customer Details</h5>
                            <FaEdit className='ms-4' style={{ cursor: 'pointer' }} onClick={() => setisReadable(true)} /></>
                        }
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label className="form-label fw-bold">Full Name</label>
                                <input
                                    type="text"
                                    {...register("full_name", { required: "Full Name is required" })}
                                    className="form-control"
                                    disabled={!isReadable}
                                />
                                {errors.full_name && <small className="text-danger">{errors.full_name.message}</small>}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Email</label>
                                <input
                                    type="email"
                                    {...register("email", { required: "Email is required" })}
                                    className="form-control"
                                    disabled={!isReadable}
                                />
                                {errors.email && <small className="text-danger">{errors.email.message}</small>}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Primary Mobile</label>
                                <input
                                    type="text"
                                    {...register("primary_mobile", { required: "Primary Mobile is required" })}
                                    className="form-control"
                                    disabled={!isReadable}
                                />
                                {errors.primary_mobile && <small className="text-danger">{errors.primary_mobile.message}</small>}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Additional Mobile</label>
                                <input
                                    type="text"
                                    {...register("additional_mobile")}
                                    className="form-control"
                                    disabled={!isReadable}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Date of birth</label>
                                <input
                                    type="date"
                                    {...register("dob", { required: "Date of birth is required" })}
                                    className="form-control"
                                    disabled={!isReadable}
                                />
                                {errors.dob && <small className="text-danger">{errors.dob.message}</small>}

                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Gender</label>
                                <select disabled={!isReadable} {...register("gender", { required: "Gender is required" })} className="form-select">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {errors.gender && <small className="text-danger">{errors.gender.message}</small>}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">State</label>
                                <input
                                    type="text"
                                    {...register("state", { required: "State is required" })}
                                    className="form-control"
                                    disabled={!isReadable}
                                />
                                {errors.state && <small className="text-danger">{errors.state.message}</small>}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">City</label>
                                <input
                                    type="text"
                                    {...register("city", { required: "City is required" })}
                                    className="form-control"
                                    disabled={!isReadable}
                                />
                                {errors.city && <small className="text-danger">{errors.city.message}</small>}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Full Address</label>
                                <textarea
                                    {...register("full_address", { required: "Address is required" })}
                                    className="form-control"
                                    disabled={!isReadable}
                                    rows="4"
                                />
                                {errors.full_address && <small className="text-danger">{errors.full_address.message}</small>}
                            </div>


                            <div className="mb-4 d-flex">
                                {documents.map((doc, index) => (
                                    <div key={index} className="position-relative ms-3">
                                        {/* Document Image / PDF */}
                                        <a href={`${path}/${doc.name}`} target="_blank" className="text-primary" style={{ textDecoration: "none", position: "relative", display: "inline-block" }}>
                                            {doc.ext === ".pdf" ? (
                                                <img src={pdfImage} style={{ width: "100px", height: "auto", display: "block" }} />
                                            ) : (
                                                <img src={`${path}/${doc.name}`} alt={doc.type} style={{ width: "100px", height: "auto", display: "block" }} />
                                            )}

                                            {isReadable && <button
                                                className="position-absolute top-0 end-0 bg-danger text-white border-0 rounded-circle d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "22px",
                                                    height: "22px",
                                                    fontSize: "14px",
                                                    cursor: "pointer",
                                                    transform: "translate(50%, -50%)" /* Moves button slightly outside image */,
                                                }}
                                                onClick={() => deleteDocument(doc.name)}
                                            >
                                                ×
                                            </button>
                                            }
                                        </a>

                                        {/* Document Type Below */}
                                        <div className="text-center mt-2">{doc.type}</div>
                                    </div>

                                ))}
                            </div>

                            {isReadable &&
                                <div className="d-flex justify-content-end mt-4">
                                    <button type="submit" className="btn btn-primary px-4">
                                        {customer.id ? 'Update' : 'Create'}
                                    </button>
                                    <button type='button' className='btn btn-danger ms-2' onClick={onClose}>
                                        Cancel
                                    </button>
                                </div>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerManagement;
