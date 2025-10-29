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

const Charts = ({ vendors }) => {
  // Prepare data for charts
  const categoryData = vendors.reduce((acc, vendor) => {
    const category = vendor.serviceCategory;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.entries(categoryData).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    vendors: count
  }));

  const pieChartData = Object.entries(categoryData).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: count
  }));

  const rateTypeData = vendors.reduce((acc, vendor) => {
    const type = vendor.rateType || 'not-specified';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const rateTypeChartData = Object.entries(rateTypeData).map(([name, count]) => ({
    name: name === 'hourly' ? 'Hourly' : name === 'per-job' ? 'Per Job' : 'Not Specified',
    value: count
  }));

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="charts-section">
      <h2>Analytics Overview</h2>
      
      <div className="charts-grid">
        {/* Bar Chart - Vendors by Category */}
        <div className="chart-card">
          <h3>Vendors by Service Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vendors" fill="#8884d8" name="Number of Vendors" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Category Distribution */}
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

        {/* Pie Chart - Rate Type Distribution */}
        <div className="chart-card">
          <h3>Rate Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={rateTypeChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {rateTypeChartData.map((entry, index) => (
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