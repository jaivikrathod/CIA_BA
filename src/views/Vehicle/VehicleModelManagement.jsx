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
            const response = await api.get('/get-vehicle-models');
            setvehicle_model(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch vehicle_model');
            console.error('Failed to fetch vehicle_model:', error);
        }
    };
     
    const fetcVehicleComapies = async ()=>{
        try {
            const response = await api.get('/get-vehicle-companies');
            setvehicleCompanies(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch vehicle_comapanies');
            console.error('Failed to fetch vehicle_comapanies:', error);
        }
    }

    const handleDeletevehicle = async (id) => {
        try {
            const response = await api.post(`/delete-vehicle-model`, { id });
            toast.success(response.data.message);
            setConfirmDelete({ show: false, id: null });
            setvehicle_model((prev)=>
            prev.filter((item)=>item.id!=id));
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
        fetcVehicleComapies();
    }, []);

    return (
        <div className="container mt-4">
            <ToastContainer position="top-right" a  utoClose={3000} hideProgressBar />
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Vehicle Model Management</h2>
                <button className="btn btn-primary" onClick={handleNewvehicleClick}>
                    <i className="fas fa-plus me-2"></i>New Vehicle Model
                </button>
            </div>

            {vehicle_model.length === 0 ? (
                <div className="alert alert-info text-center" role="alert">
                    No Vehicle Model found. Please add a new vehicle.</div>
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
                                    <td>{vehicle.company.company_name}</td>
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
                <VehicleFormModal
                    show={showvehicleModal}
                    vehicle={selectedvehicle}
                    onClose={() => {
                        setShowvehicleModal(false);
                        setSelectedvehicle(null);
                    }}
                    fetchvehicle_model={fetchvehicle_model}
                    vehicleCompanies= {vehicleCompanies}
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

const VehicleFormModal = ({ show, vehicle, onClose, fetchvehicle_model,vehicleCompanies }) => {
    const api = useApi();
    const { register, handleSubmit, setValue,watch, reset, formState: { errors } } = useForm({
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

    const Type = watch('type');

    useEffect(() => {
        console.log(Type);
        
        if(Type == 'Two Wheeler' || Type == 'Four Wheeler' || Type == 'Three Wheeler'){}else{
            setValue('other_type',vehicle.type)
            setValue('type','Other')
        }
    }, []);

    const onSubmit = async (data) => {
        if(Type =='Other'){
            data.type = data.other_type
        }
        try {
            if (vehicle && vehicle.id) {
                // Update
                const response = await api.post(`/update-vehicle-model`, { ...data, id: vehicle.id });
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
                const response = await api.post(`/create-vehicle-model`, data);
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
                                <select className='form-control' name="" id="" {...register("company_id", { required: "Company Name is required" })}>
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
                                <select className='form-control mb-2'  name="" id="" {...register('type')}>
                                    <option value="Two Wheeler">Two Wheeler</option>
                                    <option value="Four Wheeler">Four Wheeler</option>
                                    <option value="Three Wheeler">Three Wheeler</option>
                                    <option value="Other">Other</option>
                                </select>
                               {Type=='Other' && <input
                                    type="text"
                                    {...register("other_type", { required: "Type is required" })}
                                    className="form-control"
                                />}
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
