import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MediaUploadModal from '../UploadDoc/MediaUploadModal';
import "../../scss/customerManagement.css";
import { FaInfoCircle, FaUpload, FaSyncAlt, FaPlusSquare, FaDownload } from "react-icons/fa";
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
    const [filters, setFilters] = useState({
        segment: "",
        ageRange: "",
        admin: "",
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

    const fetchInsurance = useCallback(async (pageNum = 1, append = false, limit = 10,tempSearch='') => {
        try {
            // setIsLoading(true);
            const response = await api.post(`/insurance-list`, {
                search: tempSearch,
                segment: filters.segment,
                ageRange: filters.ageRange,
                minAge: filters.ageRange.split('-')[0] || '',
                maxAge: filters.ageRange.split('-')[1] || '',
                admin: filters.admin,
                page: pageNum,
                limit: limit
            });
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
            toast.error("Failed to fetch insurance");
        } finally {
            setTimeout(() => {
                // setIsLoading(false);
            }, 500);
        }
    }, [searchTerm, filters.segment, filters.ageRange, filters.admin]);

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

    const downloadCSV = async () => {
        try {
            setIsLoading(true);
            const response = await api.post(`/insurance-list`, {
                search: searchTerm,
                segment: filters.segment,
                ageRange: filters.ageRange,
                minAge: filters.ageRange.split('-')[0] || '',
                maxAge: filters.ageRange.split('-')[1] || '',
                page: 1,
                limit: 0
            });

            if (!response.data.data) {
                toast.error('No insurance data available');
                return;
            }

            const headers = ["Sr. No.", "Name", "Email", "Type", "Date"];
            const rows = response.data.data.map((insurance, index) => [
                index + 1,
                insurance.full_name,
                insurance.email,
                insurance.insurance_type,
                new Date(insurance.insurance_date).toLocaleDateString('en-GB')
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

    return (
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
                                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                                    <FaPlusSquare /> New Insurance
                                </button>
                                <button className="btn btn-success" onClick={downloadCSV}>
                                    <FaDownload /> Download CSV
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="row mb-3">
                    <div className="col-12">
                        <div className="d-flex flex-wrap gap-2">
                            <div className="flex-grow-1" style={{ minWidth: '200px' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by name or email"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            {adminType == 'Admin' &&   
                            <div className="flex-grow-1" style={{ minWidth: '200px' }}>
                                <select
                                    className="form-control"
                                    value={filters.admin}
                                    onChange={(e) => setFilters({ ...filters, admin: e.target.value })}
                                >
                                    <option value="">All admins</option>
                                    {admins.map((item) =>
                                        item.id != user_id ? (
                                            <option key={item.id} value={item.id}>
                                                {item.full_name}
                                            </option>
                                        ) : null
                                    )}
                                    <option key={user_id} value={user_id}>Self</option>
                                </select>
                            </div>
                            }
                            <div className="flex-grow-1" style={{ minWidth: '200px' }}>
                                <select
                                    className="form-control"
                                    value={filters.segment}
                                    onChange={(e) => setFilters({ ...filters, segment: e.target.value })}
                                >
                                    <option value="">All Segments</option>
                                    <option value="Motor">Motor</option>
                                    <option value="Non-Motor">Non-Motor</option>
                                </select>
                            </div>
                            <div className="flex-grow-1" style={{ minWidth: '200px' }}>
                                <select
                                    className="form-control"
                                    value={filters.ageRange}
                                    onChange={(e) => setFilters({ ...filters, ageRange: e.target.value })}
                                >
                                    <option value="">All Ages</option>
                                    <option value="0-18">0-18</option>
                                    <option value="19-35">19-35</option>
                                    <option value="36-60">36-60</option>
                                    <option value="60-120">60+</option>
                                </select>
                            </div>
                        </div>
                    </div>
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
                                    <th>Email</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {insurance.map((insurance, index) => (
                                    <tr key={insurance.id} style={{ verticalAlign: "middle" }}>
                                        <td>{index + 1}</td>
                                        <td>{insurance.full_name}</td>
                                        <td>{insurance.email}</td>
                                        <td>{insurance.insurance_type}</td>
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
                                                onClick={() => openUploadModal(insurance.id)}
                                                className="btn btn-link"
                                                title="Upload"
                                            >
                                                <FaUpload />
                                            </button>
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
    );
};

export default InsuranceManagement2;