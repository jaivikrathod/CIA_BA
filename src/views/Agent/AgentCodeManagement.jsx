import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../scss/customerManagement.css";
import { FaInfoCircle, FaTrash, FaPlusSquare, FaEdit, FaDownload } from "react-icons/fa";
import useApi from "../../api/axios";

const AgentCodeManagement = () => {
    const [isReadable, setisReadable] = useState(false);
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
    const [searchTerm, setSearchTerm] = useState("");

    const api = useApi();

    const fetchAgentCode = async () => {
        try {
            const response = await api.get(`/agentcode-list`);
            if (response.data.data) {
                setAgents(response.data.data);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        fetchAgentCode();
    }, []);

     const handleDeleteAgent = async (id) => {
            try {
                await api.post(`/agentcode-delete`, { id });
                toast.success('Agent Code deleted successfully');
                setConfirmDelete({ show: false, id: null });
                fetchAgentCode();
            } catch (error) {
                toast.error('Error deleting agent');
            }
        };

    const filteredAgents = agents?.filter(agent => {
        const matchesSearch = agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const downloadCSV = () => {
        const headers = ["Sr. No.", "Name", "Email", "Primary Mobile"];
        const rows = filteredAgents?.map((agent, index) => [
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
                    <h2>Agent Code Management</h2>
                    <button className="btn btn-primary" onClick={() => { setSelectedAgent({}); setisReadable(true); }}>
                        <FaPlusSquare className='mb-1' /> New Agent code
                    </button>
                </div>
                {agents.length === 0 ? (
                    <div className="alert alert-info text-center">No agent code found. Please add a new agent.</div>
                ) : (
                    <>

                        <div style={{ maxHeight: '70vh', overflowY: 'auto' }} className="table-responsive">
                            <table className="table table-striped table-hover" >
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Agent Name</th>
                                        <th>Agent code</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAgents.map((agent, index) => (
                                        <tr key={agent.id}>
                                            <td>{index + 1}</td>
                                            <td title={agent.agent_name}>{agent.agent_name}</td>
                                            <td title={agent.agent_code}>{agent.agent_code}</td>
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
                        setisReadable(false);
                    }}
                    setisReadable={setisReadable}
                    isReadable={isReadable}
                    fetchAgentCode={fetchAgentCode}
                />
            )}

            {confirmDelete.show && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Delete</h5>
                                    <button type="button" className="btn-close" onClick={() => setConfirmDelete({ show: false, id: null })}></button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete this agent code?</p>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-danger" onClick={() => handleDeleteAgent(confirmDelete.id)}>Confirm</button>
                                    <button className="btn btn-secondary" onClick={() => setConfirmDelete({ show: false, id: null })}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const AgentForm = ({ agent, onClose, setisReadable, isReadable,fetchAgentCode }) => {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const api = useApi();

    useEffect(() => {
        if (agent) {
            Object.keys(agent).forEach((field) => setValue(field, agent[field]));
        }
    }, [agent, setValue]);

    const onSubmit = async (data) => {
        try {
            const response = await api.post(`/agentcode-create-edit`, data);
            console.log(response);
            
            if (response.data.success) {
                toast.success("Agent Code saved successfully!");
                reset();
                onClose();
                fetchAgentCode();
            } else {
                toast.error(response.data.message || "Something went wrong");
            }
        } catch (error) {
            console.log(error);
            
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'hidden' }}>
                    <div className="modal-header bg-dark">
                        <h5 className="modal-title">{isReadable ? (agent.id ? 'Edit Agent Code' : 'New Agent Code') : 'Agent Details'}</h5>
                        {!isReadable && (
                            <FaEdit className='ms-4' style={{ cursor: 'pointer' }} onClick={() => setisReadable(true)} />
                        )}
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Agent Name</label>
                                <input
                                    type="text"
                                    {...register("agent_name", {
                                        required: "Agent Name is required",
                                    })}
                                    className="form-control"
                                    disabled={!isReadable}
                                />
                                {errors.agent_name && <small className="text-danger">{errors.agent_name.message}</small>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Agent code</label>
                                <input
                                    type="text"
                                    {...register("agent_code", { required: "Agent code is required" })}
                                    className="form-control"
                                    disabled={!isReadable}
                                />
                                {errors.agent_code && <small className="text-danger">{errors.agent_code.message}</small>}
                            </div>

                            

                            {isReadable && (
                                <div className="text-end">
                                    <button className="btn btn-primary" type="submit">Save</button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentCodeManagement;
