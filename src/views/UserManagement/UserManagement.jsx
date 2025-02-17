import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api = "http://localhost:3005";

const UserManagement = () => {
    const [User, setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });

    const fetchUser = async () => {
        try {
            const response = await axios.post(`${api}/user-list`);
            setUser(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch User');
            console.error('Failed to fetch User:', error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const response = await axios.post(`${api}/user-delete`, { id });
            toast.success(response.data.message);
            setConfirmDelete({ show: false, id: null });
            fetchUser();
        } catch (error) {
            toast.error('Error deleting User');
            console.error('Error deleting User:', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="container mt-4">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>User Management</h2>
                <button className="btn btn-primary" onClick={() => setSelectedUser({})}>+ New User</button>
            </div>

            <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {User.map((user) => (
                        <tr key={user.id}>
                            <td>{user.full_name}</td>
                            <td>{user.email}</td>
                            <td>{user.mobile}</td>
                            <td>
                                <button className="btn btn-sm btn-warning me-2" onClick={() => setSelectedUser(user)}>Edit</button>
                                <button className="btn btn-sm btn-danger" onClick={() => setConfirmDelete({ show: true, id: user.id })}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedUser !== null && (
                <UserForm
                    User={selectedUser}
                    onClose={() => {
                        setSelectedUser(null);
                        fetchUser();
                    }}
                />
            )}

            {confirmDelete.show && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={() => setConfirmDelete({ show: false, id: null })}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this User?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" onClick={() => handleDeleteUser(confirmDelete.id)}>Confirm</button>
                                <button className="btn btn-secondary" onClick={() => setConfirmDelete({ show: false, id: null })}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const UserForm = ({ User, onClose }) => {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: User || {}
    });

    useEffect(() => {
        if (User) {
            Object.keys(User).forEach((field) => setValue(field, User[field]));
        }
    }, [User, setValue]);

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${api}/user-create-edit`, data);
            if(response.data.success){
                toast.success(response.data.message);
                reset();
                onClose();
            }else{
                toast.error(response.data.message);
            }
            
        } catch (error) {
            toast.error("error while saving User, Try again!..");
            console.error('Error saving User:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 p-4 border rounded bg-light">
            <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" {...register("full_name", { required: "Full Name is required" })} className="form-control" />
                {errors.full_name && <div className="text-danger">{errors.full_name.message}</div>}
            </div>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" {...register("email", { required: "Email is required" })} className="form-control" />
                {errors.email && <div className="text-danger">{errors.email.message}</div>}
            </div>
            <div className="mb-3">
                <label className="form-label">Mobile</label>
                <input type="text" {...register("mobile", { required: "Mobile Number is required" })} className="form-control" />
                {errors.mobile && <div className="text-danger">{errors.mobile.message}</div>}
            </div>
            <div className="mb-3">
                <label className="form-label">Type</label>
                <select {...register("type")} className="form-select">
                    <option value="Admin">Admin</option>
                    <option value="Sub-admin">Sub-admin</option>
                </select>
            </div>
            <button type="submit" className="btn btn-success me-2">
                {Object.keys(User || {}).length === 0 ? 'Create' : 'Update'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
        </form>
    );
};

export default UserManagement;
