import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MediaUploadModal from '../UploadDoc/MediaUploadModal';
import "../../scss/customerManagement.css";
import { FaInfoCircle, FaUpload, FaSyncAlt, FaPlusSquare, FaDownload, FaTrash } from "react-icons/fa";
import useApi from "../../api/axios";
import LoadingComponent from "../../components/common/LoadingComponent";
import { useSelector } from "react-redux";

const InsuranceManagement2 = () => {
    const navigate = useNavigate();
    const [insurance, setInsurance] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState("");
    const [uploadModal, setUploadModal] = useState({ show: false, id: null });
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [admins, setAdmins] = useState([]);
    const user_id = useSelector((state) => state.id);
    const adminType = useSelector((state) => state.adminType);
    const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
    const [filters, setFilters] = useState({
        segment: "",
        ageRange: "",
        admin: "",
        dateRange: "",
        customFromDate: "",
        customToDate: "",
    });
    const timerRef = useRef(null);

    const api = useApi();

    const fetchAdmins = async () => {
        try {
            const response = await api.post(`/user-list`);
            if (response.data.data) {
                setAdmins(response.data.data);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchInsurance = useCallback(async (pageNum = 1, append = false, limit = 10, tempSearch = '', override = null) => {
        try {
            // setIsLoading(true);
            const payload = {
                search: tempSearch,
                segment: override?.segment ?? filters.segment,
                ageRange: override?.ageRange ?? filters.ageRange,
                minAge: (override?.ageRange ?? filters.ageRange).split('-')[0] || '',
                maxAge: (override?.ageRange ?? filters.ageRange).split('-')[1] || '',
                admin: override?.admin ?? filters.admin,
                dateRange: override?.dateRange ?? filters.dateRange,
                fromDate: override?.fromDate ?? filters.customFromDate,
                toDate: override?.toDate ?? filters.customToDate,
                page: pageNum,
                limit: limit
            };
            const response = await api.post(`/insurance-list`, payload);
            if (response.data.data) {
                if (append) {
                    setInsurance(prev => [...prev, ...response.data.data]);
                } else {
                    setInsurance(response.data.data);
                }
                setHasMore(response.data.pagination.isMoreData);
            } else {
                if (!append) {
                    setInsurance([]);
                }
                // setHasMore(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch insurance data");
        } finally {
            setTimeout(() => {
                // setIsLoading(false);
            }, 500);
        }
    }, [searchTerm, filters.segment, filters.ageRange, filters.admin, filters.dateRange, filters.customFromDate, filters.customToDate]);

    // Debounced search function with 1 second delay
    const debouncedSearch = useCallback((value) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            setPage(1);
            fetchInsurance(1, false,10, value);
        }, 1000);
    }, [fetchInsurance]);

    // Update search term and trigger debounced search
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    useEffect(() => {
        setPage(1);
        fetchInsurance(1, false);
    }, [filters.segment, filters.ageRange, filters.admin]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchInsurance(nextPage, true);
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/check-customer`, { email });
            if (response.data.success) {
                toast.success("Customer found!");
                setShowModal(false);
                navigate(`/insurance-initial/${response.data.id}`);
            } else {
                toast.error("No customer found with this email.");
            }
        } catch (error) {
            toast.error("Error checking customer.");
        }
    };

    const renewInsurance = async (insuraceID, common_id) => {
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

    const GetDate = (date)=>{
        return new Date(date).toLocaleDateString('en-GB')
    }

    // Date filter utility functions
    const getDateRange = (range) => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        
        switch (range) {
            case 'thisMonth':
                return {
                    from: new Date(currentYear, currentMonth, 1).toISOString().split('T')[0],
                    to: new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]
                };
            case '2months':
                return {
                    from: new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0],
                    to: new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]
                };
            case '3months':
                return {
                    from: new Date(currentYear, currentMonth - 2, 1).toISOString().split('T')[0],
                    to: new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]
                };
            case '4months':
                return {
                    from: new Date(currentYear, currentMonth - 3, 1).toISOString().split('T')[0],
                    to: new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]
                };
            case '5months':
                return {
                    from: new Date(currentYear, currentMonth - 4, 1).toISOString().split('T')[0],
                    to: new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]
                };
            case '6months':
                return {
                    from: new Date(currentYear, currentMonth - 5, 1).toISOString().split('T')[0],
                    to: new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]
                };
            case '1year':
                return {
                    from: new Date(currentYear - 1, currentMonth, 1).toISOString().split('T')[0],
                    to: new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]
                };
            default:
                return { from: '', to: '' };
        }
    };

    const handleDateRangeChange = (range) => {
        if (range === 'custom') {
            setFilters(prev => ({ 
                ...prev, 
                dateRange: range,
                customFromDate: '',
                customToDate: ''
            }));
        } else {
            const dateRange = getDateRange(range);
            setFilters(prev => ({ 
                ...prev, 
                dateRange: range,
                customFromDate: dateRange.from,
                customToDate: dateRange.to
            }));
        }
    };

    const handleCustomDateChange = (field, value) => {
        const today = new Date().toISOString().split('T')[0];
        
        // Prevent future dates
        if (value > today) {
            toast.error('Future dates are not allowed');
            return;
        }
        
        // Validate date range
        if (field === 'customFromDate' && filters.customToDate && value > filters.customToDate) {
            toast.error('From date cannot be greater than To date');
            return;
        }
        
        if (field === 'customToDate' && filters.customFromDate && value < filters.customFromDate) {
            toast.error('To date cannot be less than From date');
            return;
        }
        
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const clearDateFilters = () => {
        setFilters(prev => ({ 
            ...prev, 
            dateRange: '',
            customFromDate: '',
            customToDate: ''
        }));
    };

    const handleApplyFilters = () => {
        // Prevent applying invalid custom ranges
        if (filters.dateRange === 'custom') {
            if (!filters.customFromDate || !filters.customToDate) {
                toast.error('Please select both From and To dates');
                return;
            }
        }
        setPage(1);
        fetchInsurance(1, false, 10, searchTerm);
    };

    const isCustomDateIncomplete = filters.dateRange === 'custom' && (!filters.customFromDate || !filters.customToDate);

    const downloadCSV = async () => {
        try {
            setIsLoading(true);
            const response = await api.post(`/insurance-list`, {
                search: searchTerm,
                segment: filters.segment,
                ageRange: filters.ageRange,
                minAge: filters.ageRange.split('-')[0] || '',
                maxAge: filters.ageRange.split('-')[1] || '',
                admin: filters.admin,
                dateRange: filters.dateRange,
                fromDate: filters.customFromDate,
                toDate: filters.customToDate,
                page: 1,
                limit: 0
            });

            if (!response.data.data) {
                toast.error('No insurance data available');
                return;
            }

            const headers = ["Sr. No.", "Name", "Email", "Type", 'Age',"Date","segment",'vehicle_number','insurance_type','segment_vehicle_type','segment_vehicle_detail_type','Vehicle Company name','Vehicle Model','fuel_type','Year of manufacturer'];
            const rows = response.data.data.map((insurance, index) => [
                index + 1,
                insurance.full_name,
                insurance.email,
                insurance.insurance_type,
                insurance.age,
                GetDate(insurance.insurance_date),
                insurance.segment,
                insurance.vehicle_number,
                insurance.insurance_type,
                insurance.segment_vehicle_type,
                insurance.segment_vehicle_detail_type,
                insurance.manufacturer,
                insurance.model,
                insurance.fuel_type,
                insurance.yom,
            ]);

            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += headers.join(",") + "\n";
            rows.forEach(row => csvContent += row.join(",") + "\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "insurance.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            toast.error('Failed to download insurance data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteInsurance = async (id) => {
        try {
            const response = await api.post(`/delete-insurance-details`, { id });
            if (response.data.success) {
                toast.success('Insurance deleted successfully');
                setConfirmDelete({ show: false, id: null });
                fetchInsurance();
            }
        } catch (error) {
            toast.error('Failed to delete insurance');
        }
    }

    const handleConfirmDelete = (id) => {
        setConfirmDelete({ show: true, id });
    }

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
                            <p>Are you sure you want to delete this Insurance?</p>
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
    

    return (
        <>
        <div className="container-fluid px-0" style={{ maxWidth: "100vw" }}>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            {isLoading && <LoadingComponent />}

            <div className="container-fluid p-3">
                {/* Header Section */}
                <div className="row mb-3">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <h2 className="mb-0">Insurance Management</h2>
                            <div className="d-flex gap-2 flex-wrap">
                                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
                                    <FaPlusSquare /> <span style={{"marginBottom":"1px"}}>New Insurance</span>
                                </button>
                                <button className="btn btn-success d-flex align-items-center gap-2" onClick={downloadCSV}>
                                    <FaDownload /> <span style={{"marginBottom":"2px"}}> Download CSV</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compact Filters Toolbar */}
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                    <div className="input-group input-group-sm" style={{ maxWidth: 320 }}>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Search name or email"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {adminType === 'Admin' && (
                        <select
                            className="form-select"
                            style={{ width: 180 }}
                            value={filters.admin}
                            onChange={(e) => setFilters({ ...filters, admin: e.target.value })}
                        >
                            <option value="">All admins</option>
                            {admins.map((item) =>
                                item.id !== user_id ? (
                                    <option key={item.id} value={item.id}>
                                        {item.full_name}
                                    </option>
                                ) : null
                            )}
                            <option key={user_id} value={user_id}>Self</option>
                        </select>
                    )}

                    <select
                        className="form-select"
                        style={{ width: 150 }}
                        value={filters.segment}
                        onChange={(e) => setFilters({ ...filters, segment: e.target.value })}
                    >
                        <option value="">All Segments</option>
                        <option value="Motor">Motor</option>
                        <option value="Non-Motor">Non-Motor</option>
                    </select>

                    <select
                        className="form-select"
                        style={{ width: 140 }}
                        value={filters.ageRange}
                        onChange={(e) => setFilters({ ...filters, ageRange: e.target.value })}
                    >
                        <option value="">All Ages</option>
                        <option value="0-18">0-18</option>
                        <option value="19-35">19-35</option>
                        <option value="36-60">36-60</option>
                        <option value="60-120">60+</option>
                    </select>

                    <select
                        className="form-select"
                        style={{ width: 160 }}
                        value={filters.dateRange}
                        onChange={(e) => handleDateRangeChange(e.target.value)}
                    >
                        <option value="">All Time</option>
                        <option value="thisMonth">This Month</option>
                        <option value="2months">Last 2 Months</option>
                        <option value="3months">Last 3 Months</option>
                        <option value="4months">Last 4 Months</option>
                        <option value="5months">Last 5 Months</option>
                        <option value="6months">Last 6 Months</option>
                        <option value="1year">Last 1 Year</option>
                        <option value="custom">Custom</option>
                    </select>

                    {filters.dateRange === 'custom' && (
                        <>
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                style={{ width: 160 }}
                                placeholder="From"
                                value={filters.customFromDate}
                                onChange={(e) => handleCustomDateChange('customFromDate', e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                style={{ width: 160 }}
                                placeholder="To"
                                value={filters.customToDate}
                                onChange={(e) => handleCustomDateChange('customToDate', e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                min={filters.customFromDate || undefined}
                            />
                        </>
                    )}

                    <button
                        className="btn btn-primary"
                        onClick={handleApplyFilters}
                        disabled={isCustomDateIncomplete}
                    >
                        Search
                    </button>
                    {(filters.segment || filters.ageRange || filters.admin || filters.dateRange) && (
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => {
                                const cleared = {
                                    segment: "",
                                    ageRange: "",
                                    admin: "",
                                    dateRange: "",
                                    fromDate: "",
                                    toDate: "",
                                };
                                setFilters({
                                    segment: "",
                                    ageRange: "",
                                    admin: "",
                                    dateRange: "",
                                    customFromDate: "",
                                    customToDate: "",
                                });
                                setPage(1);
                                fetchInsurance(1, false, 10, '', cleared);
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>

                {insurance.length === 0 ? (
                    <div className="alert alert-info text-center fade-in" role="alert">
                        No insurance found. Please add a new insurance.</div>
                ) : (<>
                    <div className="table-responsive fade-in" style={{ maxHeight: '350px' }}>
                        <table className="table table-striped table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Name</th>
                                    {/* <th>Email</th> */}
                                    <th>Mobile</th>
                                    <th>segment</th>
                                    <th>Type</th>
                                    <th>Manufacturer</th>
                                    <th>Model</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {insurance.map((insurance, index) => (
                                    <tr key={insurance.id} style={{ verticalAlign: "middle" }}>
                                        <td>{index + 1}</td>
                                        <td>{insurance.full_name}</td>
                                        <td>{insurance.primary_mobile}</td>
                                        <td>{insurance.segment}</td>
                                        {/* <td>{insurance.email}</td> */}
                                        <td>{insurance.insurance_type ?? 'N/A'}</td>
                                        <td>{insurance.manufacturer ?? 'N/A'}</td>
                                        <td>{insurance.model ?? 'N/A'}</td>
                                        <td>{new Date(insurance.insurance_date).toLocaleDateString('en-GB')}</td>
                                        <td>
                                            <button
                                                className="btn btn-link"
                                                onClick={() => getParticularInsurance(insurance.common_id)}
                                                title="Info"
                                            >
                                                <FaInfoCircle />
                                            </button>
                                            <button
                                                onClick={() => renewInsurance(insurance.id, insurance.common_id)}
                                                className="btn btn-link"
                                                title="Renew Insurance"
                                            >
                                                <FaSyncAlt />
                                            </button>
                                            <button
                                                onClick={() => handleConfirmDelete(insurance.id)}
                                                className="btn btn-link text-danger"
                                                title="Delete Insurance"
                                            >
                                                <FaTrash />
                                            </button>
                                            {/* <button
                                                onClick={() => openUploadModal(insurance.id)}
                                                className="btn btn-link"
                                                title="Upload"
                                            >
                                                <FaUpload />
                                            </button> */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {hasMore && insurance.length > 0 && (
                            <div className="load-more-container">
                                <button
                                    className="btn btn-primary load-more-btn"
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    ) : null}
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>
                </>)}

                {/* Media Upload Modal */}
                <MediaUploadModal
                    customerId={uploadModal.id}
                    show={uploadModal.show}
                    isCustomerDoc={false}
                    handleClose={closeUploadModal}
                />

                {/* Email Modal */}
                {showModal && (
                    <>
                        <div className="modal-backdrop fade show"></div>
                        <div className="modal fade show d-block" tabIndex="-1">
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
                    </>
                )}
            </div>
        </div>
        {confirmDelete.show && (
                <DeleteConfirmModal
                    show={confirmDelete.show}
                    onClose={() => setConfirmDelete({ show: false, id: null })}
                    onConfirm={() => handleDeleteInsurance(confirmDelete.id)}
                />
            )}
        </>
    );
};

export default InsuranceManagement2;