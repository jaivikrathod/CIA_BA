// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import MediaUploadModal from '../UploadDoc/MediaUploadModal';


// const api = "http://localhost:3005";

// const InsuranceManagement = () => {
//   const navigate = useNavigate();
//   const [insurance, setInsurance] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [email, setEmail] = useState("");
//   const [uploadModal, setUploadModal] = useState({ show: false, id: null });


//   useEffect(() => {
//     fetchInsurance();
//   }, []);

//   const fetchInsurance = async () => {
//     try {
//       const response = await axios.post(`${api}/insurance-list`);
//       setInsurance(response.data.data);
//     } catch (error) {
//       toast.error("Failed to fetch insurance");
//       console.error("Failed to fetch insurance:", error);
//     }
//   };

//   const handleEmailSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(`${api}/check-customer`, { email });

//       if (response.data.success) {
//         toast.success("Customer found!");
//         setShowModal(false);
//         navigate(`/insurance-initial/${response.data.customerId}`);
//       } else {
//         toast.error("No customer found with this email.");
//       }
//     } catch (error) {
//       toast.error("Error checking customer.");
//       console.error("API Error:", error);
//     }
//   };


//   const renewInsurance = async (insuraceID) => {
//     try {
//       const response = await axios.post(`${api}/renew-insurance`, { insuraceID });
//       if (response.data.id) {
//         navigate(`/common-insurance2/${response.data.id}`)
//       }
//     } catch (error) {
//       toast.error('Error while creating Insurance');
//     }
//   }

//   const openUploadModal = (id) => {
//     setUploadModal({ show: true, id });
//   };
//   const closeUploadModal = () => {
//     setUploadModal({ show: false, id: null });
//   };

//   return (
//     <div className="container mt-4">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

//       {/* Page Title & Button */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="fw-bold">Insurance Management</h2>
//         <button onClick={() => setShowModal(true)} className="btn btn-primary">
//           + New Insurance
//         </button>
//       </div>

//       {/* Responsive Table */}
//       <div className="card shadow-sm">
//         <div className="card-body">
//           <div className="table-responsive">
//             <table className="table table-bordered table-hover">
//               <thead className="table-primary">
//                 <tr>
//                   <th>Segment</th>
//                   <th>Customer ID</th>
//                   <th>Vehicle Number</th>
//                   <th>Actions</th>
//                   <th>upload</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {insurance.map((insurance) => (
//                   <tr key={insurance.id}>
//                     <td>{insurance.segment}</td>
//                     <td>{insurance.customer_id}</td>
//                     <td>{insurance.vehicle_number}</td>
//                     <td>
//                       <button onClick={() => renewInsurance(insurance.id)} className="btn btn-sm btn-outline-info">
//                         Renew Insurance
//                       </button>
//                     </td>
//                     <td className="py-2 px-4">
//                       <button
//                         onClick={() => openUploadModal(insurance.id)}
//                         className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//                       >
//                         Upload
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       <MediaUploadModal
//         customerId={uploadModal.id}
//         show={uploadModal.show}
//         isCustomerDoc={false}
//         handleClose={() => setUploadModal({ show: false, id: null })}
//       />

//       {/* Bootstrap Modal */}
//       {showModal && (
//         <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title fw-bold">Enter customer's Email</h5>
//                 <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
//               </div>
//               <div className="modal-body">
//                 <form onSubmit={handleEmailSubmit}>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Enter Email"
//                     className="form-control mb-3"
//                     required
//                   />
//                   <button type="submit" className="btn btn-primary w-100">
//                     Submit
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InsuranceManagement;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MediaUploadModal from '../UploadDoc/MediaUploadModal';

const api = "http://localhost:3005";

const InsuranceManagement = () => {
  const navigate = useNavigate();
  const [insurance, setInsurance] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [uploadModal, setUploadModal] = useState({ show: false, id: null });

  useEffect(() => {
    fetchInsurance();
  }, []);

  const fetchInsurance = async () => {
    try {
      const response = await axios.post(`${api}/insurance-list`);
      setInsurance(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch insurance");
      console.error("Failed to fetch insurance:", error);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${api}/check-customer`, { email });

      if (response.data.success) {
        toast.success("Customer found!");
        setShowModal(false);
        // navigate(`/insurance-initial/${response.data.id}`);
      } else {
        toast.error("No customer found with this email.");
      }
    } catch (error) {
      toast.error("Error checking customer.");
      console.error("API Error:", error);
    }
  };

  const renewInsurance = async (insuraceID) => {
    try {
      const response = await axios.post(`${api}/renew-insurance`, { insuraceID });
      if (response.data.id) {
        navigate(`/common-insurance2/${response.data.id}`);
      }
    } catch (error) {
      toast.error('Error while creating Insurance');
    }
  };

  const openUploadModal = (id) => {
    setUploadModal({ show: true, id });
  };

  const closeUploadModal = () => {
    setUploadModal({ show: false, id: null });
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Insurance Management</h2>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>New Insurance
        </button>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Sr.No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th></th>
                  <th>Actions</th>
                  <th>Upload</th>
                </tr>
              </thead>
              <tbody>
                {insurance.map((insurance, item) => (
                  <tr key={insurance.id}>
                    <td>{item + 1}</td>
                    <td>{insurance.segment}</td>
                    <td>{insurance.customer_id}</td>
                    <td>{insurance.vehicle_number}</td>
                    <td>
                      <button
                        onClick={() => renewInsurance(insurance.id)}
                        className="btn btn-link text-info p-0"
                        title="Renew Insurance"
                      >
                        <i className="fas fa-sync-alt"></i>
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => openUploadModal(insurance.id)}
                        className="btn btn-link text-primary p-0"
                        title="Upload"
                      >
                        <i className="fas fa-upload"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Media Upload Modal */}
      <MediaUploadModal
        customerId={uploadModal.id}
        show={uploadModal.show}
        isCustomerDoc={false}
        handleClose={closeUploadModal}
      />

      {/* Email Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
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
      )}
    </div>
  );
};

export default InsuranceManagement;