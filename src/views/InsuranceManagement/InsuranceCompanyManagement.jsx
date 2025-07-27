import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useApi from '../../api/axios';

const InsuranceCompanyManagement = () => {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
    const api = useApi();

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/insurance-companies');
            setCompanies(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch insurance companies');
            console.error('Failed to fetch insurance companies:', error);
        }
    };

    const handleDeleteCompany = async (id) => {
        try {
            const response = await api.delete(`/insurance-company`, { data: { id } });
            toast.success(response.data.message);
            setConfirmDelete({ show: false, id: null });
            fetchCompanies();
        } catch (error) {
            toast.error('Error deleting insurance company');
            console.error('Error deleting insurance company:', error);
        }
    };

    const handleCompanyClick = (company) => {
        setSelectedCompany(company);
        setShowCompanyModal(true);
    };

    const handleDeleteClick = (id) => {
        setConfirmDelete({ show: true, id });
    };

    const handleNewCompanyClick = () => {
        setSelectedCompany({});
        setShowCompanyModal(true);
    };

    useEffect(() => {
        fetchCompanies();  
    }, []);

    return (
        <div className="container mt-4">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Insurance Company Management</h2>
                <button className="btn btn-primary" onClick={handleNewCompanyClick}>
                    <i className="fas fa-plus me-2"></i>New Insurance Company
                </button>
            </div>

            {companies.length === 0 ? (
                <div className="alert alert-info text-center" role="alert">
                    No insurance companies found. Please add a new company.</div>
            ) : (<>
                <div style={{ maxHeight: '350px', overflowY: 'auto', width: '100%' }}>
                    <table className="table table-striped table-hover" style={{ marginBottom: 0 }}>
                        <thead className="thead-dark" style={{ position: 'sticky', top: 0, zIndex: 1, background: '#343a40' }}>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Name</th>
                                <th>Extras</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map((company, index) => (
                                <tr key={company.id} style={{ verticalAlign: "middle" }}>
                                    <td>{index + 1}</td>
                                    <td>{company.name}</td>
                                    <td>{company.extras || '-'}</td>
                                    <td>
                                        <button
                                            className="btn btn-link"
                                            onClick={() => handleCompanyClick(company)}
                                            title="Edit"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn btn-link text-danger"
                                            onClick={() => handleDeleteClick(company.id)}
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

            {showCompanyModal && (
                <CompanyFormModal
                    show={showCompanyModal}
                    company={selectedCompany}
                    onClose={() => {
                        setShowCompanyModal(false);
                        setSelectedCompany(null);
                    }}
                    fetchCompanies={fetchCompanies}
                />
            )}

            {confirmDelete.show && (
                <DeleteConfirmModal
                    show={confirmDelete.show}
                    onClose={() => setConfirmDelete({ show: false, id: null })}
                    onConfirm={() => handleDeleteCompany(confirmDelete.id)}
                />
            )}
        </div>
    );
};

const CompanyFormModal = ({ show, company, onClose, fetchCompanies }) => {
    const api = useApi();
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: company || {}
    });

    useEffect(() => {
        if (company) {
            Object.keys(company).forEach((field) => setValue(field, company[field]));
        }
    }, [company, setValue]);

    useEffect(() => {
        if (!show) reset();
    }, [show, reset]);

    const onSubmit = async (data) => {
        try {
            if (company && company.id) {
                // Update
                const response = await api.put(`/insurance-company`, { ...data, id: company.id });
                if (response.data.success) {
                    toast.success(response.data.message);
                    reset();
                    onClose();
                    fetchCompanies();
                } else {
                    toast.error(response.data.message);
                }
            } else {
                // Create
                const response = await api.post(`/insurance-company`, data);
                if (response.data.success) {
                    toast.success(response.data.message);
                    reset();
                    onClose();
                    fetchCompanies();
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error saving insurance company');
            console.error('Error saving insurance company:', error);
        }
    };

    if (!show) return null;
    return (
        <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">{company.id ? 'Edit Insurance Company' : 'New Insurance Company'}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label className="form-label fw-bold">Name</label>
                                <input
                                    type="text"
                                    {...register("name", { required: "Name is required" })}
                                    className="form-control"
                                />
                                {errors.name && <small className="text-danger">{errors.name.message}</small>}
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-bold">Extras</label>
                                <textarea
                                    {...register("extras")}
                                    className="form-control"
                                    rows={2}
                                />
                            </div>
                            <div className="d-flex justify-content-end mt-4">
                                <button type="submit" className="btn btn-success px-4">
                                    {company.id ? 'Update' : 'Create'}
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
                        <p>Are you sure you want to delete this insurance company?</p>
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

export default InsuranceCompanyManagement; 