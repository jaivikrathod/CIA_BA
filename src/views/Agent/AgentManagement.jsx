import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../scss/customerManagement.css";
import { FaInfoCircle, FaTrash, FaPlusSquare, FaEdit, FaDownload } from "react-icons/fa";
import useApi from "../../api/axios";

const AgentManagement = () => {
    const [isReadable, setisReadable] = useState(false);
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
    const [searchTerm, setSearchTerm] = useState("");

    const api = useApi();

    const fetchAgents = async () => {
        try {
            const response = await api.get(`/agent-list`);
            if (response.data.data) {
                setAgents(response.data.data);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleDeleteAgent = async (id) => {
        try {
            await api.post(`/agent-delete`, { id });
            toast.success('Agent deleted successfully');
            setConfirmDelete({ show: false, id: null });
            fetchAgents();
        } catch (error) {
            toast.error('Error deleting agent');
        }
    };

    const filteredAgents = agents?.filter(agent => {
        const matchesSearch = agent.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const downloadCSV = () => {
        const headers = ["Sr. No.", "Name", "Email", "Primary Mobile"];
        const rows = filteredAgents.map((agent, index) => [
            index + 1,
            agent.full_name,
            agent.email,
            agent.primary_mobile,
        ]);

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += headers.join(",") + "\n";
        rows.forEach(row => csvContent += row.join(",") + "\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "agents.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="container">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className="container-fluid p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Agent Management</h2>
                    <button className="btn btn-primary" onClick={() => { setSelectedAgent({}); setisReadable(true); }}>
                        <FaPlusSquare /> New Agent
                    </button>
                </div>

                {agents.length === 0 ? (
                    <div className="alert alert-info text-center">No agents found. Please add a new agent.</div>
                ) : (
                    <>
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
                         
                            <div className="col-md-2 mb-2">
                                <button className="btn btn-success w-100" onClick={downloadCSV}>
                                    <FaDownload /> Download CSV
                                </button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Primary Mobile</th>
                                        <th>Files & Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAgents.map((agent, index) => (
                                        <tr key={agent.id}>
                                            <td>{index + 1}</td>
                                            <td>{agent.full_name}</td>
                                            <td>{agent.email}</td>
                                            <td>{agent.primary_mobile}</td>
                                            <td>
                                                <button className="btn btn-link" title="Info" onClick={() => setSelectedAgent(agent)}>
                                                    <FaInfoCircle />
                                                </button>
                                                <button className="btn btn-link text-danger" title="Delete" onClick={() => setConfirmDelete({ show: true, id: agent.id })}>
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {selectedAgent !== null && (
                <AgentForm
                    agent={selectedAgent}
                    onClose={() => {
                        setSelectedAgent(null);
                        fetchAgents();
                        setisReadable(false);
                    }}
                    setisReadable={setisReadable}
                    isReadable={isReadable}
                />
            )}

            {confirmDelete.show && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={() => setConfirmDelete({ show: false, id: null })}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this agent?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" onClick={() => handleDeleteAgent(confirmDelete.id)}>Confirm</button>
                                <button className="btn btn-secondary" onClick={() => setConfirmDelete({ show: false, id: null })}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AgentForm = ({ agent, onClose, setisReadable, isReadable }) => {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const api = useApi();

    useEffect(() => {
        if (agent) {
            Object.keys(agent).forEach((field) => setValue(field, agent[field]));
        }
    }, [agent, setValue]);

    const onSubmit = async (data) => {
        try {
            const response = await api.post(`/agent-create-edit`, data);
            if (response.data.success) {
                toast.success("Agent saved successfully!");
                reset();
                onClose();
            } else {
                toast.error(response.data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error("Error saving agent");
        }
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'hidden' }}>
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">{isReadable ? (agent.id ? 'Edit Agent' : 'New Agent') : 'Agent Details'}</h5>
                        {!isReadable && (
                            <FaEdit className='ms-4' style={{ cursor: 'pointer' }} onClick={() => setisReadable(true)} />
                        )}
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Full Name</label>
                                <input
                                    type="text"
                                    {...register("full_name", {
                                        required: "Full Name is required",
                                        pattern: {
                                            value: /^[A-Za-z\s]+$/,
                                            message: "Only letters allowed"
                                        }
                                    })}
                                    className="form-control"
                                    disabled={!isReadable}
                                />
                                {errors.full_name && <small className="text-danger">{errors.full_name.message}</small>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Email</label>
                                <input
                                    type="email"
                                    {...register("email", { required: "Email is required" })}
                                    className="form-control"
                                    disabled={!isReadable}
                                />
                                {errors.email && <small className="text-danger">{errors.email.message}</small>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Primary Mobile</label>
                                <input
                                    type="text"
                                    maxLength={10}
                                    {...register("primary_mobile", {
                                        required: "Primary Mobile is required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Must be exactly 10 digits"
                                        }
                                    })}
                                    className="form-control"
                                    disabled={!isReadable}
                                />
                                {errors.primary_mobile && <small className="text-danger">{errors.primary_mobile.message}</small>}
                            </div>

                            {isReadable && (
                                <div className="text-end">
                                    <button className="btn btn-primary" type="submit">Save Agent</button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentManagement;
