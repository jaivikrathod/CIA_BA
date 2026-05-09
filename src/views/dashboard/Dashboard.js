import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormSelect,
  CFormLabel,
  CButton,
  CBadge,
} from '@coreui/react'
import useApi from '../../api/axios'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import * as XLSX from 'xlsx'
import { useSelector } from 'react-redux'
import { cilChart, cilDollar, cilFactory, cilCalendar, cilCloudDownload, cilX, cilSearch, cilCheckCircle } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const softPalette = [
  'rgba(15, 76, 129, 0.85)',
  'rgba(72, 137, 115, 0.85)',
  'rgba(153, 125, 94, 0.85)',
  'rgba(112, 112, 112, 0.85)',
  'rgba(96, 88, 168, 0.85)',
  'rgba(95, 158, 160, 0.85)',
  'rgba(170, 92, 92, 0.85)',
]

const KpiCard = ({ title, value, icon, color = 'primary' }) => (
  <CCard className="kpi-card-shadow h-100" style={{ borderLeft: `4px solid var(--cui-${color})` }}>
    <CCardBody className="p-3">
      <div className="d-flex align-items-center justify-content-between">
        <div className="text-truncate">
          <div className="text-muted small text-uppercase">{title}</div>
          <div className="fw-bold fs-5 text-dark mt-1">{value}</div>
        </div>
        {/* {icon =='rupees' ? <span className={`text-${color}`} style={{fontSize:'28px'}}>₹</span> :
        <CIcon icon={icon} className={`text-${color}`} size="xl" />} */}
      </div>
    </CCardBody>
  </CCard>
)

const SearchableTagInput = ({ users, agents, adminType, user_id, selectedEntities, setSelectedEntities }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const allEntities = useMemo(() => {
        let entities = [];
        if (adminType === 'Admin') {
            entities.push({ type: 'all', id: 0, label: 'All Entities', category: 'Global' });
        }
        entities.push({ type: 'user', id: user_id, label: 'Self', category: 'Your Account' });
        
        if (adminType === 'Admin') {
            entities.push(...users.map(u => ({ type: 'user', id: u.id, label: u.full_name, category: 'Users' })));
            entities.push(...agents.map(a => ({ type: 'agent', id: a.id, label: a.full_name, category: 'Agents' })));
        }
        return entities;
    }, [users, agents, adminType, user_id]);

    const filteredEntities = useMemo(() => {
        if (!searchTerm) return allEntities;
        const lowerSearch = searchTerm.toLowerCase();
        return allEntities.filter(e => e.label.toLowerCase().includes(lowerSearch));
    }, [allEntities, searchTerm]);

    const handleSelect = useCallback((entity) => {
        const isSelected = selectedEntities.some(s => s.type === entity.type && s.id === entity.id);
        
        if (entity.type === 'all') {
            setSelectedEntities(isSelected ? [] : [entity]);
            setSearchTerm(''); // Clear search term after selection
            setIsOpen(false); // Close dropdown after selection
            return;
        }

        setSelectedEntities(prev => {
            // Filter out 'all' if a specific entity is selected
            const current = prev.filter(s => s.type !== 'all');
            
            if (isSelected) {
                // Deselect
                return current.filter(s => !(s.type === entity.type && s.id === entity.id));
            } else {
                // Select
                return [...current, entity];
            }
        });
        setSearchTerm(''); // Clear search term after selection
    }, [selectedEntities, setSelectedEntities]);

    // Remove entity tag from within the input field
    const handleRemoveTag = useCallback((type, id) => {
        setSelectedEntities(prev => prev.filter(s => !(s.type === type && s.id === id)));
    }, [setSelectedEntities]);
    
    // Check if an entity is currently selected
    const isEntitySelected = (type, id) => selectedEntities.some(s => s.type === type && s.id === id);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [wrapperRef]);

    // Separate filtered entities by category for grouping in the results list
    const groupedEntities = filteredEntities.reduce((acc, entity) => {
        acc[entity.category] = acc[entity.category] || [];
        acc[entity.category].push(entity);
        return acc;
    }, {});
    
    // Determine placeholder/input value
    const inputDisplayValue = selectedEntities.length > 0 ? '' : searchTerm;
    const placeholder = selectedEntities.length > 0 ? '' : 'Search users or agents...';

    // Tags inside the input field
    const selectedTags = selectedEntities.map(s => (
        <CBadge 
            key={`${s.type}-${s.id}`} 
            color="primary" 
            className="me-1 px-2 py-1 d-inline-flex align-items-center tag-inside-input"
        >
            {s.label}
            <CIcon 
                icon={cilX} 
                size="sm" 
                className="ms-1" 
                onClick={(e) => { e.stopPropagation(); handleRemoveTag(s.type, s.id); }} 
                style={{ cursor: 'pointer' }}
            />
        </CBadge>
    ));

    return (
        <div ref={wrapperRef} style={{ position: 'relative' }}>
            <CFormLabel className="fw-semibold">Select Users / Agents</CFormLabel>
            <div 
                className={`form-control multi-select-input-container ${isOpen ? 'is-focused' : ''}`}
                onClick={() => setIsOpen(true)}
                style={{ cursor: 'text',overflow:'auto',gap:'10px', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}
            >
                {selectedTags}
                <input
                    type="text"
                    className="tag-input-field"
                    placeholder={placeholder}
                    value={inputDisplayValue}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    style={{ flexGrow: 1, border: 'none', outline: 'none', background: 'transparent', padding: 0, margin: 0 }}
                />
            </div>

            {isOpen && (
                <div 
                    className="dropdown-menu show" 
                    style={{ position: 'absolute', width: '100%', zIndex: 1050, maxHeight: '300px', overflowY: 'auto' }}
                >
                    {Object.entries(groupedEntities).map(([category, entities]) => (
                        <React.Fragment key={category}>
                            <h6 className="dropdown-header">{category}</h6>
                            {entities.map(entity => (
                                <a 
                                    key={`${entity.type}-${entity.id}`}
                                    className={`dropdown-item d-flex justify-content-between align-items-center ${isEntitySelected(entity.type, entity.id) ? 'active' : ''}`}
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleSelect(entity); }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {entity.label}
                                    {isEntitySelected(entity.type, entity.id) && <CIcon icon={cilCheckCircle} />}
                                </a>
                            ))}
                        </React.Fragment>
                    ))}
                    {filteredEntities.length === 0 && (
                        <div className="dropdown-item text-muted">No results found for "{searchTerm}"</div>
                    )}
                </div>
            )}
        </div>
    );
};
// --- END NEW SEARCHABLE MULTI-SELECT COMPONENT ---


const Dashboard = () => {
    const api = useApi();
    const user_id = useSelector((state) => state.id);
    const adminType = useSelector((state) => state.adminType);

    // data state
    const [users, setUsers] = useState([]);
    const [agents, setAgents] = useState([]);
    const [preset, setPreset] = useState('all');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [dateError, setDateError] = useState('');
    const [selectedEntities, setSelectedEntities] = useState([]); // [{ type, id, label }]

    // response state
    const [monthlySeries, setMonthlySeries] = useState([]);
    const [combinedCounts, setCombinedCounts] = useState({ users: 0, customers: 0, insurance: 0, newCustomers: 0, agents: 0 });
    const [summaryPerEntity, setSummaryPerEntity] = useState([]);
    const [combinedSummary, setCombinedSummary] = useState({ policies: 0, od_premium: 0, premium: 0, gst: 0, amount: 0, net_amount: 0, net_income: 0, tp_premium: 0 ,package_premium:0});

    // Data fetching functions
    useEffect(() => {
        fetchUsers();
        fetchAgents();
        // Initialize default selection on mount
        if (selectedEntities.length === 0) {
            if (adminType === 'Admin') {
                setSelectedEntities([{ type: 'all', id: 0, label: 'All Entities' }]);
            } else {
                setSelectedEntities([{ type: 'user', id: user_id, label: 'Self' }]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (preset !== 'custom') {
            fetchReportData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedEntities, preset]);

    const fetchUsers = async () => {
        try {
            const resp = await api.post('/user-list');
            setUsers(resp.data.data || []);
        } catch (err) {
            console.error('fetchUsers', err);
        }
    };
    const fetchAgents = async () => {
        try {
            const resp = await api.get('/agent-list');
            setAgents(resp.data.data || []);
        } catch (err) {
            console.error('fetchAgents', err);
        }
    };

    const buildParams = () => {
        const params = { user_id };
        
        if (!selectedEntities || selectedEntities.length === 0 || selectedEntities.some(s => s.type === 'all')) {
            if (adminType === 'Admin') {
                params.entity_type = 'all';
            } else {
                params.entity_type = 'user';
                params.entity_id = String(user_id);
            }
        } else {
            params.entity_type = 'mixed';
            params.entity_ids = selectedEntities.map(s => `${s.type}-${s.id}`).join(',');
        }

        if (preset === 'custom') {
            params.preset = 'custom';
            if (customStart) params.start_date = customStart;
            if (customEnd) params.end_date = customEnd;
        } else if (preset) {
            params.preset = preset;
        }
        params.adminType = adminType;
        return params;
    };

    const fetchReportData = async () => {
        setDateError('');
        try {
            const params = buildParams();
            const resp = await api.get('/get-insurance-report', { params });
            if (resp.data && resp.data.success) {
                const { per_entity_series, counts, insurance_data, summaries } = resp.data;

                setMonthlySeries(per_entity_series || []);
                setSummaryPerEntity(summaries?.per_entity || []);
                setCombinedSummary(summaries?.combined || (insurance_data || {}));
                setCombinedCounts(counts || combinedCounts);
            }
        } catch (err) {
            console.error('fetchReportData', err);
        }
    };

    const validateDates = () => {
        setDateError('');
        if (!customStart || !customEnd) {
            setDateError('Please select both start and end dates');
            return false;
        }
        const s = new Date(customStart);
        const e = new Date(customEnd);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (s > e) {
            setDateError('Start date must be before end date');
            return false;
        }
        // if (e > today) {
        //     setDateError('End date cannot be in the future');
        //     return false;
        // }
        return true;
    };

    const handleConfirmSearch = () => {
        if (validateDates()) {
            fetchReportData();
        }
    };
    
    const handleClearFilter = () => {
        setCustomStart('');
        setCustomEnd('');
        setDateError('');
        setPreset('all');
        
        // Reset selection to default
        if (adminType === 'Admin') {
            setSelectedEntities([{ type: 'all', id: 0, label: 'All Entities' }]);
        } else {
            setSelectedEntities([{ type: 'user', id: user_id, label: 'Self' }]);
        }
        fetchReportData();
    };

    const chartData = useMemo(() => {
        const monthSet = new Set();
        monthlySeries.forEach(series => {
            (series.data || []).forEach(d => monthSet.add(d.ym));
        });
        const months = Array.from(monthSet).sort();
        const labels = months.map(m => {
            const [y, mm] = m.split('-').map(Number);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${monthNames[mm - 1]} ${String(y).slice(-2)}`;
        });

        const datasets = (monthlySeries || []).map((series, idx) => {
            const color = softPalette[idx % softPalette.length];
            const data = months.map(m => {
                const found = (series.data || []).find(d => d.ym === m);
                return found ? Number(found.count) : 0;
            });
            return {
                label: series.label,
                data,
                backgroundColor: color,
                borderColor: color.replace(/0\.85/, '1') || color,
                borderWidth: 1,
            };
        });

        if (monthlySeries && monthlySeries.length > 0) {
            const combinedData = months.map(m => {
                return monthlySeries.reduce((acc, s) => {
                    const f = (s.data || []).find(d => d.ym === m);
                    return acc + (f ? Number(f.count) : 0);
                }, 0);
            });
            datasets.push({
                label: 'Combined',
                data: combinedData,
                backgroundColor: 'rgba(45,55,72,0.85)',
                borderColor: 'rgba(45,55,72,1)',
                borderWidth: 1,
            });
        }

        return { labels, datasets };
    }, [monthlySeries]);

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Monthly Policies — Per Entity vs Combined' },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            x: { stacked: false },
            y: { beginAtZero: true }
        }
    };

    const downloadExcel = async () => {
        try {
            const params = buildParams();
            params.detailed = true;
            const resp = await api.get('/get-insurance-report', { params });
            if (resp.data && resp.data.detailed_data && resp.data.detailed_data.length) {
                const worksheet = XLSX.utils.json_to_sheet(resp.data.detailed_data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Insurance Data');
                const dateStr = new Date().toISOString().split('T')[0];
                const selLabel = selectedEntities && selectedEntities.length > 0 ? selectedEntities.map(s => s.label).join('_') : 'all';
                const filename = `insurance_report_${selLabel}_${dateStr}.xlsx`;
                XLSX.writeFile(workbook, filename);
            } else {
                alert('No data available to download');
            }
        } catch (err) {
            console.error('downloadExcel', err);
            alert('Error downloading Excel file');
        }
    };

    // Helper for currency formatting
    const formatCurrency = (amount) => `₹ ${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

    return (
        <>
            <h3 className="mb-4 d-flex align-items-center"><CIcon icon={cilChart} size="xxl" className="me-2 text-primary" /> Performance Dashboard</h3>

            {/* 1. Filter and Selection Card */}
            <CCard className="mb-4 shadow-sm border-0">
                <CCardHeader className="bg-light border-bottom">
                    <h6 className="mb-0">Selection & Date Range</h6>
                </CCardHeader>
                <CCardBody>
                    <CRow className="align-items-end g-3">
                        {/* Entity Select (NEW Searchable Tag Input) */}
                        <CCol xs={12} md={6} lg={4}>
                            <SearchableTagInput
                                users={users}
                                agents={agents}
                                adminType={adminType}
                                user_id={user_id}
                                selectedEntities={selectedEntities}
                                setSelectedEntities={setSelectedEntities}
                            />
                        </CCol>

                        {/* Date Range Preset */}
                        <CCol xs={12} md={6} lg={2}>
                            <CFormLabel className="fw-semibold">Date Preset</CFormLabel>
                            <CFormSelect value={preset} onChange={(e) => { setPreset(e.target.value); setDateError(''); }}>
                                <option value="all">All Time</option>
                                <option value="last_month">Last Month</option>
                                <option value="this_month">This Month</option>
                                <option value="next_month">Next Month</option>
                                <option value="2m">Last 2 Months</option>
                                <option value="3m">Last 3 Months</option>
                                <option value="6m">Last 6 Months</option>
                                <option value="1y">Last 1 Year</option>
                                <option value="custom">Custom Range</option>
                            </CFormSelect>
                        </CCol>

                        {/* Custom Dates & Controls */}
                        {preset === 'custom' ? (
                            <>
                                <CCol xs={12} md={4} lg={2}>
                                    <CFormLabel className="fw-semibold">Start Date</CFormLabel>
                                    <input type="date" className={`form-control ${dateError ? 'is-invalid' : ''}`}
                                        value={customStart} onChange={(e) => { setCustomStart(e.target.value); setDateError(''); }} />
                                </CCol>
                                <CCol xs={12} md={4} lg={2}>
                                    <CFormLabel className="fw-semibold">End Date</CFormLabel>
                                    <input type="date" className={`form-control ${dateError ? 'is-invalid' : ''}`}
                                        value={customEnd} onChange={(e) => { setCustomEnd(e.target.value); setDateError(''); }} />
                                    {dateError && <div className="invalid-feedback d-block">{dateError}</div>}
                                </CCol>
                                <CCol xs={12} md={4} lg={2} className="mt-4 mt-lg-0">
                                    <CButton color="primary" className="w-100 mb-2" onClick={handleConfirmSearch}>
                                        <CIcon icon={cilCalendar} className="me-1" /> Apply
                                    </CButton>
                                    <CButton color="secondary" variant="outline" className="w-100" onClick={handleClearFilter}>
                                        Clear Filter
                                    </CButton>
                                </CCol>
                            </>
                        ) : (
                            <CCol xs={12} md={12} lg={4} className="mt-4 mt-lg-0">
                                <CButton color="secondary" variant="outline" onClick={handleClearFilter} style={{ minWidth: 120 }}>
                                    <CIcon icon={cilCheckCircle} className="me-1" /> Clear Selections
                                </CButton>
                            </CCol>
                        )}

                    </CRow>
                </CCardBody>
            </CCard>

            {/* <h4 className="mb-3">Combined Performance Summary</h4>
            <CButton color="success" onClick={downloadExcel} className="ms-3 shadow-sm">
                <CIcon icon={cilCloudDownload} className="me-1" /> Export Details (.xlsx)
            </CButton> */}
            <h4 className="mt-4 mb-3 d-flex justify-content-between align-items-center">
                Combined Performance Summary
                <CButton color="success" onClick={downloadExcel} className="ms-3 shadow-sm">
                    <CIcon icon={cilCloudDownload} className="me-1" /> Export Details (.xlsx)
                </CButton>
            </h4>
            <CRow className="g-3 mb-4">
                <CCol sm={6} md={4} lg={2}>
                    <KpiCard title="Total Policies" icon={cilFactory} color="primary"
                        value={combinedSummary.policies ?? combinedCounts.insurance ?? 0} />
                </CCol>
                <CCol sm={6} md={4} lg={2}>
                    <KpiCard title="OD Premium" icon='rupees' color="warning"
                        value={formatCurrency(combinedSummary.od_premium)} />
                </CCol>
                {/* <CCol sm={6} md={4} lg={2}>
                    <KpiCard title="TP Premium" icon='rupees' color="info"
                        value={formatCurrency(combinedSummary.tp_premium)} />
                </CCol> */}
                 <CCol sm={6} md={4} lg={2}>
                    <KpiCard title="Package Premium" icon='rupees' color="info"
                        value={formatCurrency(combinedSummary.package_premium)} />
                </CCol>
                <CCol sm={6} md={4} lg={2}>
                    <KpiCard title="Total Premium" icon='rupees' color="secondary"
                        value={formatCurrency(combinedSummary.premium)} />
                </CCol>
                <CCol sm={6} md={4} lg={2}>
                    <KpiCard title="Net Amount" icon='rupees' color="success"
                        value={formatCurrency(combinedSummary.net_amount)} />
                </CCol>
                <CCol sm={6} md={4} lg={2}>
                    <KpiCard title="Net Income" icon='rupees' color="danger"
                        value={formatCurrency(combinedSummary.net_income)} />
                </CCol>
            </CRow>

            {selectedEntities.length > 1 && (

                <CRow>
                    <CCol xs={12} lg={12}>
                        <CCard className="mb-4 shadow-sm border-0">
                            <CCardHeader className="bg-white border-bottom">
                                <h6 className="mb-0">Monthly Policies Trend</h6>
                            </CCardHeader>
                            <CCardBody style={{ height: '400px' }}>
                                {chartData.datasets && chartData.datasets.length > 0 ? (
                                    <Bar data={chartData} options={barOptions} />
                                ) : (
                                    <div className="text-center text-medium-emphasis p-5">
                                        <CIcon icon={cilChart} size="xl" className="mb-3" />
                                        <p>No chart data available for selected entities and date range.</p>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            )
            }

            {
                adminType === 'Admin' &&
                selectedEntities.length > 1 && (
                    <>
                        <h4 className="mt-4 mb-3 d-flex justify-content-between align-items-center">
                            Entity Comparison
                        </h4>

                        <CCard className="mb-4 shadow-sm border-0"> 
                            <CCardBody className="p-0">
                                <div className="table-responsive premium-table-wrapper">
                                    <table className="table premium-table align-middle mb-0">
                                        <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                            <tr>
                                                <th>Entity</th>
                                                <th className="text-end">Policies</th>
                                                <th className="text-end">OD Premium</th>
                                                <th className="text-end">Package Premium</th>
                                                <th className="text-end">Premium</th>
                                                <th className="text-end">GST</th>
                                                <th className="text-end">Amount</th>
                                                <th className="text-end">Net Amount</th>
                                                <th className="text-end">Net Income</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(summaryPerEntity && summaryPerEntity.length > 0) ? summaryPerEntity.map((s, idx) => (
                                                <tr key={`${s.type}-${s.id || idx}`}>
                                                    <td title={s.label}>{s.label}</td>
                                                    <td className="text-end">{s.totals?.policies ?? 0}</td>
                                                    <td className="text-end">{formatCurrency(s.totals?.od_premium)}</td>
                                                    <td className="text-end">{formatCurrency(s.totals?.package_premium)}</td>
                                                    <td className="text-end">{formatCurrency(s.totals?.premium)}</td>
                                                    <td className="text-end">{formatCurrency(s.totals?.gst)}</td>
                                                    <td className="text-end">{formatCurrency(s.totals?.amount)}</td>
                                                    <td className="text-end">{formatCurrency(s.totals?.net_amount)}</td>
                                                    <td className="text-end">{formatCurrency(s.totals?.net_income)}</td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={9} className="text-center text-medium-emphasis py-4">No entity summary data for comparison.</td>
                                                </tr>
                                            )}

                                            {/* Combined row */}
                                            <tr style={{ backgroundColor: '#f1f5f9' }}>
                                                <td><strong>TOTAL COMBINED</strong></td>
                                                <td className="text-end"><strong>{combinedSummary.policies ?? combinedCounts.insurance ?? 0}</strong></td>
                                                <td className="text-end"><strong>{formatCurrency(combinedSummary.od_premium)}</strong></td>
                                                <td className="text-end"><strong>{formatCurrency(combinedSummary.package_premium)}</strong></td>
                                                <td className="text-end"><strong>{formatCurrency(combinedSummary.premium)}</strong></td>
                                                <td className="text-end"><strong>{formatCurrency(combinedSummary.gst)}</strong></td>
                                                <td className="text-end"><strong>{formatCurrency(combinedSummary.amount)}</strong></td>
                                                <td className="text-end"><strong>{formatCurrency(combinedSummary.net_amount)}</strong></td>
                                                <td className="text-end"><strong>{formatCurrency(combinedSummary.net_income)}</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CCardBody>
                        </CCard>
                    </>
                )
            }
        </>
    );
};

export default Dashboard;