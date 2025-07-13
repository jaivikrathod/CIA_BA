import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useApi from '../../api/axios';

const CarsManagement = () => {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [showCarModal, setShowCarModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
    const api = useApi();

    const fetchCars = async () => {
        try {
            const response = await api.get('/cars');
            setCars(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch cars');
            console.error('Failed to fetch cars:', error);
        }
    };

    const handleDeleteCar = async (id) => {
        try {
            const response = await api.delete(`/car`, { data: { id } });
            toast.success(response.data.message);
            setConfirmDelete({ show: false, id: null });
            fetchCars();
        } catch (error) {
            toast.error('Error deleting car');
            console.error('Error deleting car:', error);
        }
    };

    const handleCarClick = (car) => {
        setSelectedCar(car);
        setShowCarModal(true);
    };

    const handleDeleteClick = (id) => {
        setConfirmDelete({ show: true, id });
    };

    const handleNewCarClick = () => {
        setSelectedCar({});
        setShowCarModal(true);
    };

    useEffect(() => {
        fetchCars();  
    }, []);

    return (
        <div className="container mt-4">
            <ToastContainer position="top-right" a  utoClose={3000} hideProgressBar />
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Vehicle Management</h2>
                <button className="btn btn-primary" onClick={handleNewCarClick}>
                    <i className="fas fa-plus me-2"></i>New Vehicle
                </button>
            </div>

            {cars.length === 0 ? (
                <div className="alert alert-info text-center" role="alert">
                    No cars found. Please add a new car.</div>
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
                            {cars.map((car, index) => (
                                <tr key={car.id} style={{ verticalAlign: "middle" }}>
                                    <td>{index + 1}</td>
                                    <td>{car.company_name}</td>
                                    <td>{car.type}</td>
                                    <td>{car.model_name}</td>
                                    <td>{car.model_launch_year}</td>
                                    <td>{car.other_detail || '-'}</td>
                                    <td>
                                        <button
                                            className="btn btn-link"
                                            onClick={() => handleCarClick(car)}
                                            title="Edit"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn btn-link text-danger"
                                            onClick={() => handleDeleteClick(car.id)}
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

            {showCarModal && (
                <CarFormModal
                    show={showCarModal}
                    car={selectedCar}
                    onClose={() => {
                        setShowCarModal(false);
                        setSelectedCar(null);
                    }}
                    fetchCars={fetchCars}
                />
            )}

            {confirmDelete.show && (
                <DeleteConfirmModal
                    show={confirmDelete.show}
                    onClose={() => setConfirmDelete({ show: false, id: null })}
                    onConfirm={() => handleDeleteCar(confirmDelete.id)}
                />
            )}
        </div>
    );
};

const CarFormModal = ({ show, car, onClose, fetchCars }) => {
    const api = useApi();
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: car || {}
    });

    useEffect(() => {
        if (car) {
            Object.keys(car).forEach((field) => setValue(field, car[field]));
        }
    }, [car, setValue]);

    useEffect(() => {
        if (!show) reset();
    }, [show, reset]);

    const onSubmit = async (data) => {
        try {
            if (car && car.id) {
                // Update
                const response = await api.put(`/car`, { ...data, id: car.id });
                if (response.data.success) {
                    toast.success(response.data.message);
                    reset();
                    onClose();
                    fetchCars();
                } else {
                    toast.error(response.data.message);
                }
            } else {
                // Create
                const response = await api.post(`/car`, data);
                if (response.data.success) {
                    toast.success(response.data.message);
                    reset();
                    onClose();
                    fetchCars();
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error saving car');
            console.error('Error saving car:', error);
        }
    };

    if (!show) return null;
    return (
        <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">{car.id ? 'Edit Car' : 'New Car'}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label className="form-label fw-bold">Company Name</label>
                                <input
                                    type="text"
                                    {...register("company_name", { required: "Company Name is required" })}
                                    className="form-control"
                                />
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
                                    {car.id ? 'Update' : 'Create'}
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
                        <p>Are you sure you want to delete this car?</p>
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

export default CarsManagement;
