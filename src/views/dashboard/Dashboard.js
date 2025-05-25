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

import WidgetsDropdown from '../widgets/WidgetsDropdown'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const [insuranceReport, setinsuranceReport] = useState([]);
  const [insuranceCategoryReport, setinsuranceCategoryReport] = useState([]);
  const user_id = useSelector((state)=>state.id);
  const api = useApi()

  useEffect(() => {
    fetchinsuranceReport()
    fetchInsuranceCategory()
  }, [])

  const fetchinsuranceReport = async () => {
    try {
      const response = await api.get('/get-insurance-report',{params:{user_id}});
      if (response.data.data) {
        setinsuranceReport(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching insurance data:', error)
    }
  }

  const fetchInsuranceCategory = async () => {
    try {
      const response = await api.get('/get-insurance-category-report',{params:{user_id}});
      if (response.data.data) {
        setinsuranceCategoryReport(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching insurance data:', error)
    }
  }

  

  // Dummy data for insurance counts
  const dummyData = [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 19 },
    { month: 'Mar', count: 15 },
    { month: 'Apr', count: 25 },
    { month: 'May', count: 22 },
    { month: 'Jun', count: 30 },
    { month: 'Jul', count: 28 },
    { month: 'Aug', count: 35 },
    { month: 'Sep', count: 32 },
    { month: 'Oct', count: 40 },
    { month: 'Nov', count: 38 },
    { month: 'Dec', count: 45 },
  ]

  // Dummy data for customer distribution
  const customerData = {
    labels: ['Motor Insurance', 'Health Insurance', 'Life Insurance', 'Travel Insurance', 'Other'],
    data: [45, 25, 15, 10, 5]
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
      <WidgetsDropdown className="mb-4" />
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
