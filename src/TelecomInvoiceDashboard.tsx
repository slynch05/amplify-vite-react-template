import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Calendar, DollarSign, Clock, CheckCircle, AlertTriangle, Filter } from 'lucide-react';

const TelecomInvoiceDashboard = () => {
  const [selectedVendor, setSelectedVendor] = useState('Verizon');
  const [startDate, setStartDate] = useState('2024-02-01');
  const [endDate, setEndDate] = useState('2024-08-01');

  // Sample data for invoices awaiting approval
  const pendingInvoices = [
    { id: 'INV-2024-001', vendor: 'Verizon', amount: 15420.50, dueDate: '2024-08-15', type: 'Mobile Services', status: 'pending', daysOverdue: 0 },
    { id: 'INV-2024-002', vendor: 'AT&T', amount: 8750.25, dueDate: '2024-08-12', type: 'Internet', status: 'pending', daysOverdue: 3 },
    { id: 'INV-2024-003', vendor: 'T-Mobile', amount: 12300.75, dueDate: '2024-08-18', type: 'Mobile Services', status: 'pending', daysOverdue: 0 },
    { id: 'INV-2024-004', vendor: 'Comcast', amount: 5680.00, dueDate: '2024-08-10', type: 'Internet', status: 'pending', daysOverdue: 5 },
    { id: 'INV-2024-005', vendor: 'Sprint', amount: 9200.30, dueDate: '2024-08-20', type: 'Mobile Services', status: 'pending', daysOverdue: 0 },
    { id: 'INV-2024-006', vendor: 'Verizon', amount: 18500.80, dueDate: '2024-08-08', type: 'Data Plans', status: 'urgent', daysOverdue: 7 },
  ];

  // Sample data for vendor statistics
  const vendorStats = [
    { vendor: 'Verizon', totalInvoices: 24, totalAmount: 285600.50, avgAmount: 11900.02, pendingCount: 3 },
    { vendor: 'AT&T', totalInvoices: 18, totalAmount: 198750.25, avgAmount: 11041.68, pendingCount: 2 },
    { vendor: 'T-Mobile', totalInvoices: 15, totalAmount: 165200.75, avgAmount: 11013.38, pendingCount: 1 },
    { vendor: 'Comcast', totalInvoices: 12, totalAmount: 89400.00, avgAmount: 7450.00, pendingCount: 1 },
    { vendor: 'Sprint', totalInvoices: 10, totalAmount: 78500.30, avgAmount: 7850.03, pendingCount: 1 },
  ];

  // Sample data for 6-month vendor trend (filtered by selected vendor)
  const vendorTrendData = [
    { month: 'Feb 2024', Verizon: 42500, 'AT&T': 31200, 'T-Mobile': 28900, Comcast: 15600, Sprint: 12800 },
    { month: 'Mar 2024', Verizon: 38900, 'AT&T': 29800, 'T-Mobile': 31500, Comcast: 14200, Sprint: 13600 },
    { month: 'Apr 2024', Verizon: 45600, 'AT&T': 33100, 'T-Mobile': 27800, Comcast: 16800, Sprint: 11900 },
    { month: 'May 2024', Verizon: 51200, 'AT&T': 35600, 'T-Mobile': 29200, Comcast: 15900, Sprint: 14200 },
    { month: 'Jun 2024', Verizon: 48800, 'AT&T': 32900, 'T-Mobile': 33100, Comcast: 17200, Sprint: 13800 },
    { month: 'Jul 2024', Verizon: 47300, 'AT&T': 36400, 'T-Mobile': 30600, Comcast: 16400, Sprint: 15100 },
  ];

  // Sample data for total invoices over 6 months
  const totalInvoicesData = [
    { month: 'Feb 2024', total: 131000, invoiceCount: 28 },
    { month: 'Mar 2024', total: 128000, invoiceCount: 25 },
    { month: 'Apr 2024', total: 135200, invoiceCount: 31 },
    { month: 'May 2024', total: 146100, invoiceCount: 29 },
    { month: 'Jun 2024', total: 145800, invoiceCount: 33 },
    { month: 'Jul 2024', total: 145800, invoiceCount: 27 },
  ];

  // Colors for different elements
  const colors = {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    danger: '#EF4444',
    warning: '#F97316',
    purple: '#8B5CF6',
    pink: '#EC4899',
    teal: '#14B8A6',
  };

  const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const getStatusColor = (status, daysOverdue) => {
    if (status === 'urgent' || daysOverdue > 5) return 'bg-red-100 text-red-800 border-red-200';
    if (daysOverdue > 0) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const totalPendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const urgentInvoices = pendingInvoices.filter(inv => inv.status === 'urgent' || inv.daysOverdue > 5).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Telecom Invoice Dashboard</h1>
              <p className="text-slate-600">Monitor and manage telecom invoices across all vendors</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-slate-500">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Pending Invoices</p>
                <p className="text-3xl font-bold">{pendingInvoices.length}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Pending Amount</p>
                <p className="text-3xl font-bold">${(totalPendingAmount / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Urgent Invoices</p>
                <p className="text-3xl font-bold">{urgentInvoices}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Active Vendors</p>
                <p className="text-3xl font-bold">{vendorStats.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoices Awaiting Approval */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-blue-600" />
                Invoices Awaiting Approval
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {pendingInvoices.map((invoice) => (
                  <div key={invoice.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-slate-800">{invoice.id}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status, invoice.daysOverdue)}`}>
                            {invoice.daysOverdue > 0 ? `${invoice.daysOverdue} days overdue` : 'On time'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{invoice.vendor} • {invoice.type}</p>
                        <p className="text-xs text-slate-500">Due: {invoice.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-800">${invoice.amount.toLocaleString()}</p>
                        <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vendor Statistics */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Vendor Statistics</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {vendorStats.map((vendor, index) => (
                  <div key={vendor.vendor} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-800">{vendor.vendor}</h3>
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: pieColors[index] }}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-slate-500">Total Invoices</p>
                        <p className="font-semibold text-slate-800">{vendor.totalInvoices}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Pending</p>
                        <p className="font-semibold text-orange-600">{vendor.pendingCount}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Total Amount</p>
                        <p className="font-semibold text-green-600">${(vendor.totalAmount / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Avg Amount</p>
                        <p className="font-semibold text-blue-600">${(vendor.avgAmount / 1000).toFixed(1)}K</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vendor Trend Chart */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Vendor Invoice Trends</h2>
                <select 
                  value={selectedVendor} 
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {vendorStats.map(vendor => (
                    <option key={vendor.vendor} value={vendor.vendor}>{vendor.vendor}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={vendorTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey={selectedVendor} 
                    stroke={colors.primary} 
                    strokeWidth={3}
                    dot={{ fill: colors.primary, strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: colors.secondary }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Total Invoices Chart */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Total Invoice Amount Trends</h2>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={totalInvoicesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="total" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors.secondary} />
                      <stop offset="100%" stopColor={colors.teal} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Vendor Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Invoice Amount Distribution by Vendor</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={vendorStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ vendor, percent }) => `${vendor} ${(percent as number * 100).toFixed(1)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="totalAmount"
                >
                  {vendorStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`$${(value / 1000).toFixed(0)}K`, 'Total Amount']}
                  contentStyle={{ 
                    backgroundColor: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelecomInvoiceDashboard;