import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'
import useApi from '../../api/axios'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

import { useSelector } from 'react-redux'

const Dashboard = () => {
  const [insuranceReport, setinsuranceReport] = useState([]);
  const [insuranceCategoryReport, setinsuranceCategoryReport] = useState([]);
  const [users, setusers] = useState([]);
  const [agents, setagents] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null); // { type: 'user'|'agent', id, label }
  const [preset, setPreset] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [dateError, setDateError] = useState('');
  const [counts, setCounts] = useState({ users: 0, customers: 0, insurance: 0, newCustomers: 0, agents: 0 });
  const [insuranceData, setinsuranceData] = useState({
    od_premium: 0,
    tp_premium: 0,
    packagePremium: 0,
    premium: 0,
    gst: 0,
    // payout_percent: 0,
    // net_payout_percent: 0,
    amount: 0,
    net_amount: 0,
    net_income: 0
  });
  const user_id = useSelector((state) => state.id);
  const adminType = useSelector((state) => state.adminType);
  const api = useApi()

  useEffect(() => {
    fetchUsers()
    fetchAgents()
  }, [])

  useEffect(() => {
    setDateError('');
    if (preset != 'custom') {
      fetchinsuranceReport()
      fetchInsuranceCategory()
    }
  }, [selectedEntity, preset])


  const buildParams = () => {
    const params = { user_id };
    if (selectedEntity) {
      params.entity_type = selectedEntity.type;
      params.entity_id = selectedEntity.id;
    } else {
      params.entity_type = 'user';
    }
    if (preset === 'custom') {
      if (customStart) params.start_date = customStart;
      if (customEnd) params.end_date = customEnd;
      params.preset = 'custom';
    } else if (preset) {
      params.preset = preset;
    }
    return params;
  }

  const fetchinsuranceReport = async () => {
    try {
      const response = await api.get('/get-insurance-report', { params: buildParams() });
      if (response.data.data) {
        setinsuranceReport(response.data.data)
      }
      if (response.data.counts) {
        setCounts(response.data.counts)
      }

      if (response.data.insurance_data) {
        console.log(response.data.insurance_data);

        setinsuranceData(response.data.insurance_data);
      }
    } catch (error) {
      console.error('Error fetching insurance data:', error)
    }
  }

  const fetchInsuranceCategory = async () => {
    try {
      const response = await api.get('/get-insurance-category-report', { params: buildParams() });
      if (response.data.data) {
        setinsuranceCategoryReport(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching insurance data:', error)
    }
  }
  const fetchUsers = async () => {
    try {
      const response = await api.post('/user-list');
      setusers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch User:', error);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await api.get(`/agent-list`);
      if (response.data.data) {
        setagents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching insurance data:', error)
    }
  };

  // Date validation function
  const validateDates = () => {
    setDateError('');

    if (!customStart || !customEnd) {
      setDateError('Please select both start and end dates');
      return false;
    }

    const startDate = new Date(customStart);
    const endDate = new Date(customEnd);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today

    if (startDate > endDate) {
      setDateError('Start date must be before end date');
      return false;
    }

    if (endDate > today) {
      setDateError('End date cannot be in the future');
      return false;
    }

    return true;
  };

  // Handle confirm button click
  const handleConfirmSearch = () => {
    if (validateDates()) {
      fetchinsuranceReport();
      fetchInsuranceCategory();
    }
  };

  // Handle clear button click
  const handleClearFilter = () => {
    setCustomStart('');
    setCustomEnd('');
    setDateError('');
    setPreset('all');
    // Reset to default view
    fetchinsuranceReport();
    fetchInsuranceCategory();
  };

  // CSV Download functionality
  const downloadCSV = async () => {
    try {
      // Build parameters for the insurance report API with detailed data
      const params = buildParams();
      params.detailed = true; // Request detailed data for CSV export

      const response = await api.get('/get-insurance-report', { params });

      if (response.data.detailed_data && response.data.detailed_data.length > 0) {
        // Convert data to CSV format
        const csvData = convertToCSV(response.data.detailed_data);

        // Create and download file
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);

        // Generate filename with current date and filters
        const currentDate = new Date().toISOString().split('T')[0];
        let filename = `insurance_data_${currentDate}`;

        if (selectedEntity) {
          filename += `_${selectedEntity.type}_${selectedEntity.id}`;
        }
        if (preset && preset !== 'all') {
          filename += `_${preset}`;
        }
        filename += '.csv';

        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('No data available to download');
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error downloading CSV file');
    }
  };

  // Convert insurance data to CSV format
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';

    // Define CSV headers
    const headers = [
      'Customer Name',
      'Email',
      'Mobile',
      'Date of Birth',
      'Age',
      'Vehicle Number',
      'Insurance Type',
      'Segment',
      'Manufacturer',
      'Model',
      'Fuel Type',
      'Year of Manufacture',
      'Policy Start Date',
      'Policy Expiry Date',
      'Insurance Date',
      'OD  Premium',
      'TP  Premium',
      'Package Premium',
      'Premium',
      'Gst',
      'Amount',
      'Net Amount',
      'Net Income'
    ];

    // Convert data to CSV rows
    const csvRows = data.map(row => [
      row.customer_name || '',
      row.email || '',
      row.mobile || '',
      row.dob || '',
      row.age || '',
      row.vehicle_number || '',
      row.insurance_type || '',
      row.segment || '',
      row.manufacturer || '',
      row.model || '',
      row.fuel_type || '',
      row.yom || '',
      row.policy_start_date || '',
      row.policy_expiry_date || '',
      row.insurance_date || '',
      // row.insurance_count || '',
      row.od_premium || '',
      row.tp_premium || '',
      row.packagePremium || '',
      row.premium || '',
      row.gst || '',
      row.amount || '',
      row.net_amount || '',
      row.net_income || ''
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  };

  // Helpers for entity select
  const selectedValue = selectedEntity ? `${selectedEntity.type}-${selectedEntity.id}` : ''
  const handleEntityChange = (e) => {
    const v = e.target.value
    if (!v) {
      setSelectedEntity(null)
      return
    }
    const [type, idStr] = v.split('-')
    setSelectedEntity({ type, id: Number(idStr), label: v })
  }

  const barChartData = {
    labels: insuranceReport.map(item => item.month),
    datasets: [
      {
        label: 'Insurance Count',
        data: insuranceReport.map(item => item.count),
        backgroundColor: 'rgba(0, 113, 227, 0.5)',
        borderColor: 'rgba(0, 113, 227, 1)',
        borderWidth: 1,
      },
    ],
  }

  const pieChartData = {
    labels: insuranceCategoryReport.labels,
    datasets: [
      {
        data: insuranceCategoryReport.data,
        backgroundColor: [
          'rgba(0, 113, 227, 0.7)',
          'rgba(40, 167, 69, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(220, 53, 69, 0.7)',
          'rgba(108, 117, 125, 0.7)',
        ],
        borderColor: [
          'rgba(0, 113, 227, 1)',
          'rgba(40, 167, 69, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(220, 53, 69, 1)',
          'rgba(108, 117, 125, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Insurance Count',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
      },
    },
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Customer Insurance Distribution',
      },
    },
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>

          <CRow className="g-3 mb-3">
            <CCol xs={12} md={6} lg={3}>
              <label className="form-label">Select User/Agent</label>
              <select className="form-select" value={selectedValue} onChange={handleEntityChange}>
                  <option value={`user-${user_id}`}>Self</option>
                <optgroup label="Users">
                  {(users || []).map((u) => (
                    <option key={`user-${u.id}`} value={`user-${u.id}`}>{`${u.full_name}`}</option>
                  ))}
                </optgroup>
                <optgroup label="Agents">
                  {(agents || []).map((a) => (
                    <option key={`agent-${a.id}`} value={`agent-${a.id}`}>{`${a.full_name}`}</option>
                  ))}
                </optgroup>
              </select>
            </CCol>
            <CCol xs={12} md={6} lg={2}>
              <label className="form-label">Date Range</label>
              <select className="form-select" value={preset} onChange={(e) => setPreset(e.target.value)}>
                <option value="all">All Time</option>
                <option value="this_month">This Month</option>
                <option value="2m">Last 2 Months</option>
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last 1 Year</option>
                <option value="custom">Custom</option>
              </select>
            </CCol>

            {preset === 'custom' && (
              <>
                <CCol xs={12} md={6} lg={2}>
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className={`form-control ${dateError ? 'is-invalid' : ''}`}
                    value={customStart}
                    onChange={(e) => {
                      setCustomStart(e.target.value);
                      setDateError('');
                    }}
                  />
                </CCol>
                <CCol xs={12} md={6} lg={2}>
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className={`form-control ${dateError ? 'is-invalid' : ''}`}
                    value={customEnd}
                    onChange={(e) => {
                      setCustomEnd(e.target.value);
                      setDateError('');
                    }}
                  />
                </CCol>
              </>
            )}
            <CCol xs={12} md={6} lg={2}>
              <label className="form-label">&nbsp;</label>
              <button
                type="button"
                className="btn btn-success w-100"
                onClick={downloadCSV}
                style={{ minHeight: '38px' }}
              >
                <i className="cil-cloud-download me-1"></i>
                Download CSV
              </button>
            </CCol>
          </CRow>
          {preset === 'custom' && (

            <CRow className='mb-4'>
              <CCol xs={12} md={6} lg={2}>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleConfirmSearch}
                    style={{ minWidth: '80px' }}
                  >
                    <i className="cil-magnifying-glass me-1"></i>
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleClearFilter}
                    style={{ minWidth: '80px' }}
                  >
                    <i className="cil-x me-1"></i>
                    Clear
                  </button>
                </div>
              </CCol>
            </CRow>
          )}


          {/* Error message display */}
          {dateError && (
            <CRow className="mb-3">
              <CCol xs={12}>
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="cil-warning me-2"></i>
                  <div>{dateError}</div>
                </div>
              </CCol>
            </CRow>
          )}

          <div>
            <div className="row g-2">
              {adminType === 'Admin' && (
                <div className="col-6 col-xl-4 col-xxl-3">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body py-3 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small">Users</div>
                        <div className="fw-bold fs-5">{counts.users}</div>
                      </div>
                      <span className="badge bg-success-subtle text-success">Total</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="col-6 col-xl-4 col-xxl-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small">Customers</div>
                      <div className="fw-bold fs-5">{counts.customers}</div>
                    </div>
                    <span className="badge bg-success-subtle text-success">Total</span>
                  </div>
                </div>
              </div>

              <div className="col-6 col-xl-4 col-xxl-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small">Insurance</div>
                      <div className="fw-bold fs-5">{counts.insurance}</div>
                    </div>
                    <span className="badge bg-success-subtle text-success">Total</span>
                  </div>
                </div>
              </div>

              <div className="col-6 col-xl-4 col-xxl-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small">New Customers</div>
                      <div className="fw-bold fs-5">{counts.newCustomers}</div>
                    </div>
                    <span className="badge bg-danger-subtle text-danger">New</span>
                  </div>
                </div>
              </div>

              <div className="col-6 col-xl-4 col-xxl-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small">Agents</div>
                      <div className="fw-bold fs-5">{counts.agents}</div>
                    </div>
                    <span className="badge bg-success-subtle text-success">Total</span>
                  </div>
                </div>
              </div>
               <div className="col-6 col-xl-4 col-xxl-3">

                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small">OD Premium</div>
                      <div className="fw-bold fs-5">₹ {insuranceData.od_premium}</div>
                    </div>
                    <span className="badge bg-success-subtle text-success">Total</span>
                  </div>
                </div>
              </div>
              
               <div className="col-6 col-xl-4 col-xxl-3">

                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small">TP Premium</div>
                      <div className="fw-bold fs-5">₹ {insuranceData.tp_premium}</div>
                    </div>
                    <span className="badge bg-success-subtle text-success">Total</span>
                  </div>
                </div>
              </div>


              <div className="col-6 col-xl-4 col-xxl-3">

                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small">Package Premium</div>
                      <div className="fw-bold fs-5">₹ {insuranceData.packagePremium}</div>
                    </div>
                    <span className="badge bg-success-subtle text-success">Total</span>
                  </div>
                </div>
              </div>
              <div className="col-6 col-xl-4 col-xxl-3">

                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small">Premium</div>
                      <div className="fw-bold fs-5">₹ {insuranceData.premium}</div>
                    </div>
                    <span className="badge bg-success-subtle text-success">Total</span>
                  </div>
                </div>
              </div>

              <div className="col-6 col-xl-4 col-xxl-3">

                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small">GST</div>
                      <div className="fw-bold fs-5">₹ {insuranceData.gst}</div>
                    </div>
                    <span className="badge bg-success-subtle text-success">Total</span>
                  </div>
                </div>
              </div>
              

              <div className="col-6 col-xl-4 col-xxl-3">

                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small">Amount</div>
                      <div className="fw-bold fs-5">₹ {insuranceData.amount}</div>
                    </div>
                    <span className="badge bg-success-subtle text-success">Total</span>
                  </div>
                </div>
              </div>
              
               <div className="col-6 col-xl-4 col-xxl-3">

                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small">Net Amount</div>
                      <div className="fw-bold fs-5">₹ {insuranceData.net_amount}</div>
                    </div>
                    <span className="badge bg-success-subtle text-success">Total</span>
                  </div>
                </div>
              </div>
              
               <div className="col-6 col-xl-4 col-xxl-3">

                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small">Net Income</div>
                      <div className="fw-bold fs-5">₹ {insuranceData.net_income}</div>
                    </div>
                    <span className="badge bg-success-subtle text-success">Total</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </CCardBody>
      </CCard>
      <CRow>
        <CCol xs={12} lg={8} className="mb-4">
          <CCard className="h-100">
            <CCardHeader>
              <h4 className="mb-0">Insurance Statistics</h4>
            </CCardHeader>
            <CCardBody>
              <div style={{ height: '400px' }}>
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} lg={4} className="mb-4">
          <CCard className="h-100">
            <CCardHeader>
              <h4 className="mb-0">Customer Distribution</h4>
            </CCardHeader>
            <CCardBody>
              <div style={{ height: '400px' }}>
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

    </>
  )
}

export default Dashboard
