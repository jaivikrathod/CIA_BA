import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useApi from '../../api/axios';

const VehicleModelManagement = () => {
    const [vehicle_model, setvehicle_model] = useState([]);
    const [selectedvehicle, setSelectedvehicle] = useState(null);
    const [showvehicleModal, setShowvehicleModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
    const [vehicleCompanies, setvehicleCompanies] = useState([]);
    const api = useApi();

    const fetchvehicle_model = async () => {
        try {
            const response = await api.get('/vehicle_model');
            setvehicle_model(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch vehicle_model');
            console.error('Failed to fetch vehicle_model:', error);
        }
    };
     
    const fetcVehicleComapies = async ()=>{
        try {
            const response = await api.get('/vehicle_model');
            setvehicleCompanies(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch vehicle_comapanies');
            console.error('Failed to fetch vehicle_comapanies:', error);
        }
    }

    const handleDeletevehicle = async (id) => {
        try {
            const response = await api.delete(`/vehicle`, { data: { id } });
            toast.success(response.data.message);
            setConfirmDelete({ show: false, id: null });
            fetchvehicle_model();
        } catch (error) {
            toast.error('Error deleting vehicle');
            console.error('Error deleting vehicle:', error);
        }
    };

    const handlevehicleClick = (vehicle) => {
        setSelectedvehicle(vehicle);
        setShowvehicleModal(true);
    };

    const handleDeleteClick = (id) => {
        setConfirmDelete({ show: true, id });
    };

    const handleNewvehicleClick = () => {
        setSelectedvehicle({});
        setShowvehicleModal(true);
    };

    useEffect(() => {
        fetchvehicle_model();  
    }, []);

    return (
        <div className="container mt-4">
            <ToastContainer position="top-right" a  utoClose={3000} hideProgressBar />
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Vehicle Management</h2>
                <button className="btn btn-primary" onClick={handleNewvehicleClick}>
                    <i className="fas fa-plus me-2"></i>New Vehicle
                </button>
            </div>

            {vehicle_model.length === 0 ? (
                <div className="alert alert-info text-center" role="alert">
                    No vehicle_model found. Please add a new vehicle.</div>
            ) : (<>
                <div style={{ maxHeight: '350px', overflowY: 'auto', width: '100%' }}>
                    <table className="table table-striped table-hover" style={{ marginBottom: 0 }}>
                        <thead className="thead-dark" style={{ position: 'sticky', top: 0, zIndex: 1, background: '#343a40' }}>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Company Name</th>
                                <th>Type</th>
                                <th>Model Name</th>
                                <th>Model Launch Year</th>
                                <th>Other Detail</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicle_model.map((vehicle, index) => (
                                <tr key={vehicle.id} style={{ verticalAlign: "middle" }}>
                                    <td>{index + 1}</td>
                                    <td>{vehicle.company_name}</td>
                                    <td>{vehicle.type}</td>
                                    <td>{vehicle.model_name}</td>
                                    <td>{vehicle.model_launch_year}</td>
                                    <td>{vehicle.other_detail || '-'}</td>
                                    <td>
                                        <button
                                            className="btn btn-link"
                                            onClick={() => handlevehicleClick(vehicle)}
                                            title="Edit"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn btn-link text-danger"
                                            onClick={() => handleDeleteClick(vehicle.id)}
                                            title="Delete"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>)}

            {showvehicleModal && (
                <vehicleFormModal
                    show={showvehicleModal}
                    vehicle={selectedvehicle}
                    onClose={() => {
                        setShowvehicleModal(false);
                        setSelectedvehicle(null);
                    }}
                    fetchvehicle_model={fetchvehicle_model}
                />
            )}

            {confirmDelete.show && (
                <DeleteConfirmModal
                    show={confirmDelete.show}
                    onClose={() => setConfirmDelete({ show: false, id: null })}
                    onConfirm={() => handleDeletevehicle(confirmDelete.id)}
                />
            )}
        </div>
    );
};

const vehicleFormModal = ({ show, vehicle, onClose, fetchvehicle_model }) => {
    const api = useApi();
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: vehicle || {}
    });

    useEffect(() => {
        if (vehicle) {
            Object.keys(vehicle).forEach((field) => setValue(field, vehicle[field]));
        }
    }, [vehicle, setValue]);

    useEffect(() => {
        if (!show) reset();
    }, [show, reset]);

    const onSubmit = async (data) => {
        try {
            if (vehicle && vehicle.id) {
                // Update
                const response = await api.put(`/vehicle`, { ...data, id: vehicle.id });
                if (response.data.success) {
                    toast.success(response.data.message);
                    reset();
                    onClose();
                    fetchvehicle_model();
                } else {
                    toast.error(response.data.message);
                }
            } else {
                // Create
                const response = await api.post(`/vehicle`, data);
                if (response.data.success) {
                    toast.success(response.data.message);
                    reset();
                    onClose();
                    fetchvehicle_model();
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error saving vehicle');
            console.error('Error saving vehicle:', error);
        }
    };

    if (!show) return null;
    return (
        <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">{vehicle.id ? 'Edit vehicle' : 'New vehicle'}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label className="form-label fw-bold">Company Name</label>
                                <select name="" id="" {...register("company_name", { required: "Company Name is required" })}>
                                    <option value="">select company</option>
                                    {vehicleCompanies.map((item)=>(
                                        <>
                                        <option value={item.id}>{item.company_name}</option>
                                        </>
                                    ))}
                                </select>
                                {errors.company_name && <small className="text-danger">{errors.company_name.message}</small>}
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-bold">Type</label>
                                <input
                                    type="text"
                                    {...register("type", { required: "Type is required" })}
                                    className="form-control"
                                />
                                {errors.type && <small className="text-danger">{errors.type.message}</small>}
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-bold">Model Name</label>
                                <input
                                    type="text"
                                    {...register("model_name", { required: "Model Name is required" })}
                                    className="form-control"
                                />
                                {errors.model_name && <small className="text-danger">{errors.model_name.message}</small>}
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-bold">Model Launch Year</label>
                                <input
                                    type="number"
                                    {...register("model_launch_year", {
                                        required: "Model Launch Year is required",
                                        min: { value: 1900, message: "Year must be >= 1900" },
                                        max: { value: new Date().getFullYear(), message: `Year must be <= ${new Date().getFullYear()}` }
                                    })}
                                    className="form-control"
                                />
                                {errors.model_launch_year && <small className="text-danger">{errors.model_launch_year.message}</small>}
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-bold">Other Detail</label>
                                <textarea
                                    {...register("other_detail")}
                                    className="form-control"
                                    rows={2}
                                />
                            </div>
                            <div className="d-flex justify-content-end mt-4">
                                <button type="submit" className="btn btn-success px-4">
                                    {vehicle.id ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={onClose} className="btn btn-secondary ms-2">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmModal = ({ show, onClose, onConfirm }) => {
    if (!show) return null;
    return (
        <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirm Deletion</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete this vehicle?</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleModelManagement;
