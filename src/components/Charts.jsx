

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import '../styles/Charts.css';

const Charts = ({ candidates, companies, dataType }) => {
  let barChartData = [];
  let pieChartData = [];
  let statusChartData = [];

  if (dataType === 'candidates') {
    const categoryData = candidates.reduce((acc, candidate) => {
      const category = candidate.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    barChartData = Object.entries(categoryData).map(([name, count]) => ({
      name: name.length > 10 ? name.substring(0, 10) + '...' : name,
      candidates: count
    }));

    pieChartData = Object.entries(categoryData).map(([name, count]) => ({
      name: name.length > 10 ? name.substring(0, 10) + '...' : name,
      value: count
    }));

    const statusData = candidates.reduce((acc, candidate) => {
      const status = candidate.registrationStatus || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    statusChartData = Object.entries(statusData).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: count
    }));
  } else {
    const categoryData = companies.reduce((acc, company) => {
      if (Array.isArray(company.categories)) {
        company.categories.forEach(category => {
          acc[category] = (acc[category] || 0) + 1;
        });
      }
      return acc;
    }, {});

    barChartData = Object.entries(categoryData).map(([name, count]) => ({
      name: name.length > 10 ? name.substring(0, 10) + '...' : name,
      companies: count
    })).slice(0, 10);

    pieChartData = Object.entries(categoryData).map(([name, count]) => ({
      name: name.length > 10 ? name.substring(0, 10) + '...' : name,
      value: count
    })).slice(0, 6);

    const statusData = companies.reduce((acc, company) => {
      const status = company.registrationStatus || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    statusChartData = Object.entries(statusData).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: count
    }));
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="charts-section">
      <h2>Analytics Overview - {dataType === 'candidates' ? 'Candidates' : 'Companies'}</h2>
      
      <div className="charts-grid">
        <div className="chart-card">
          <h3>{dataType === 'candidates' ? 'Candidates by Category' : 'Companies by Required Categories'}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey={dataType === 'candidates' ? 'candidates' : 'companies'} 
                fill="#8884d8" 
                name={dataType === 'candidates' ? 'Number of Candidates' : 'Number of Companies'} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Registration Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;

