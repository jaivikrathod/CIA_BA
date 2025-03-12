import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MediaUploadModal from '../UploadDoc/MediaUploadModal';
import "../../scss/CustomerManagement.css";

const api = "http://localhost:3005";
const CustomerManagement = () => {
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


    return (
        <div className="container mt-4">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Customer Management</h2>
                <button className="btn btn-primary" onClick={() => setSelectedCustomer({})}>
                    + New Customer
                </button>
            </div>

            {/* Customer Table */}
            {/* <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Primary Mobile</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Address</th>
                            <th>Actions</th>
                            <th>Insurance</th>
                            <th>upload</th>
                            <th>view</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.full_name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.primary_mobile}</td>
                                <td>{customer.age || 'N/A'}</td>
                                <td>{customer.gender || 'N/A'}</td>
                                <td>{customer.full_address || 'N/A'}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => setSelectedCustomer(customer)}>
                                        Edit
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete({ show: true, id: customer.id })}>
                                        Delete
                                    </button>
                                </td>
                                <td> <button className="btn btn-sm" onClick={() => addNewInsurance(customer.id)}>
                                    Add insurance
                                </button>
                                </td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => openUploadModal(customer.id)}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Upload
                                    </button>
                                </td>
                                <td className="py-2 px-4">
                                    <button
                                        className="btn btn-success btn-sm"
                                    >
                                        view
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}
           <div className="table-responsive">
    <table className="table table-bordered table-hover">
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
                <th>Insurance</th>
                <th>Upload</th>
                <th>View</th>
            </tr>
        </thead>
        <tbody>
            {customers.map((customer, index) => (
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
                            className="btn btn-link text-warning p-0 me-2"
                            onClick={() => setSelectedCustomer(customer)}
                            title="Edit"
                        >
                            <i className="fas fa-edit"></i>
                        </button>
                        <button
                            className="btn btn-link text-danger p-0"
                            onClick={() => setConfirmDelete({ show: true, id: customer.id })}
                            title="Delete"
                        >
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </td>
                    <td>
                        <button
                            className="btn btn-link text-info p-0"
                            onClick={() => addNewInsurance(customer.id)}
                            title="Add Insurance"
                        >
                            <i className="fas fa-plus-circle"></i>
                        </button>
                    </td>
                    <td>
                        <button
                            className="btn btn-link text-primary p-0"
                            onClick={() => openUploadModal(customer.id)}
                            title="Upload"
                        >
                            <i className="fas fa-upload"></i>
                        </button>
                    </td>
                    <td>
                        <button
                            className="btn btn-link text-success p-0"
                            title="View"
                        >
                            <i className="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
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
                }} />
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
const CustomerForm = ({ customer, onClose }) => {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: customer || {}
    });

    useEffect(() => {
        if (customer) {
            Object.keys(customer).forEach((field) => setValue(field, customer[field]));
        }
    }, [customer, setValue]);

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

    return (
        // <div className="modal fade show d-block" tabIndex="-1">
        //     <div className="modal-dialog">
        //         <div className="modal-content">
        //             <div className="modal-header">
        //                 <h5 className="modal-title">{customer.id ? 'Edit Customer' : 'New Customer'}</h5>
        //                 <button type="button" className="btn-close" onClick={onClose}></button>
        //             </div>
        //             <div className="modal-body">
        //                 <form onSubmit={handleSubmit(onSubmit)}>
        //                     <div className="mb-3">
        //                         <label className="form-label">Full Name</label>
        //                         <input
        //                             type="text"
        //                             {...register("full_name", { required: "Full Name is required" })}
        //                             className="form-control"
        //                         />
        //                         {errors.full_name && <small className="text-danger">{errors.full_name.message}</small>}
        //                     </div>

        //                     <div className="mb-3">
        //                         <label className="form-label">Email</label>
        //                         <input
        //                             type="email"
        //                             {...register("email", { required: "Email is required" })}
        //                             className="form-control"
        //                         />
        //                         {errors.email && <small className="text-danger">{errors.email.message}</small>}
        //                     </div>

        //                     <div className="mb-3">
        //                         <label className="form-label">Primary Mobile</label>
        //                         <input
        //                             type="text"
        //                             {...register("primary_mobile", { required: "Primary Mobile is required" })}
        //                             className="form-control"
        //                         />
        //                         {errors.primary_mobile && <small className="text-danger">{errors.primary_mobile.message}</small>}
        //                     </div>

        //                     <div className="mb-3">
        //                         <label className="form-label">Additional Mobile</label>
        //                         <input
        //                             type="text"
        //                             {...register("additional_mobile")}
        //                             className="form-control"
        //                         />
        //                     </div>

        //                     <div className="mb-3">
        //                         <label className="form-label">Age</label>
        //                         <input
        //                             type="number"
        //                             {...register("age")}
        //                             className="form-control"
        //                         />
        //                     </div>

        //                     <div className="mb-3">
        //                         <label className="form-label">Gender</label>
        //                         <select {...register("gender")} className="form-select">
        //                             <option value="male">Male</option>
        //                             <option value="female">Female</option>
        //                         </select>
        //                     </div>

        //                     <div className="mb-3">
        //                         <label className="form-label">State</label>
        //                         <input
        //                             type="text"
        //                             {...register("state")}
        //                             className="form-control"
        //                         />
        //                     </div>

        //                     <div className="mb-3">
        //                         <label className="form-label">City</label>
        //                         <input
        //                             type="text"
        //                             {...register("city")}
        //                             className="form-control"
        //                         />
        //                     </div>

        //                     <div className="mb-3">
        //                         <label className="form-label">Full Address</label>
        //                         <textarea
        //                             {...register("full_address")}
        //                             className="form-control"
        //                         />
        //                     </div>

        //                     <button type="submit" className="btn btn-success">
        //                         {customer.id ? 'Update' : 'Create'}
        //                     </button>
        //                 </form>
        //             </div>

        //         </div>
        //     </div>
        // </div>
        <div className="modal fade show d-block" tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">{customer.id ? 'Edit Customer' : 'New Customer'}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            <div className="modal-body p-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="form-label fw-bold">Full Name</label>
                        <input
                            type="text"
                            {...register("full_name", { required: "Full Name is required" })}
                            className="form-control"
                        />
                        {errors.full_name && <small className="text-danger">{errors.full_name.message}</small>}
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            className="form-control"
                        />
                        {errors.email && <small className="text-danger">{errors.email.message}</small>}
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Primary Mobile</label>
                        <input
                            type="text"
                            {...register("primary_mobile", { required: "Primary Mobile is required" })}
                            className="form-control"
                        />
                        {errors.primary_mobile && <small className="text-danger">{errors.primary_mobile.message}</small>}
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Additional Mobile</label>
                        <input
                            type="text"
                            {...register("additional_mobile")}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Age</label>
                        <input
                            type="number"
                            {...register("age")}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Gender</label>
                        <select {...register("gender")} className="form-select">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">State</label>
                        <input
                            type="text"
                            {...register("state")}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">City</label>
                        <input
                            type="text"
                            {...register("city")}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Full Address</label>
                        <textarea
                            {...register("full_address")}
                            className="form-control"
                            rows="4"
                        />
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                        <button type="submit" className="btn btn-success px-4">
                            {customer.id ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
    );
};

export default CustomerManagement;
