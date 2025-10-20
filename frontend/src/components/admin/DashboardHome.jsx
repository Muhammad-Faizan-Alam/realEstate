import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import {
  Users,
  Handshake,
  Building,
  Home,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import StatsCard from './StatsCard';
import SkeletonLoader from './SkeletonLoader';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DashboardHome = ({ stats, users, agents, agencies, properties, loading }) => {
  if (loading) {
    return <SkeletonLoader type="home" />;
  }

  const {
    totalUsers,
    totalAgents,
    totalAgencies,
    totalProperties,
    verifiedProperties,
    unverifiedProperties,
    monthlyData = [],
    propertyTypeData = []
  } = stats;

  const calculateChange = (current) => {
    return current > 0 ? Math.floor((current / 10) * 100) / 100 : 0;
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={<Users className="w-5 h-5 text-blue-500" />}
          color="text-blue-500"
          change={calculateChange(totalUsers)}
        />
        <StatsCard
          title="Total Agents"
          value={totalAgents}
          icon={<Handshake className="w-5 h-5 text-green-500" />}
          color="text-green-500"
          change={calculateChange(totalAgents)}
        />
        <StatsCard
          title="Total Agencies"
          value={totalAgencies}
          icon={<Building className="w-5 h-5 text-purple-500" />}
          color="text-purple-500"
          change={calculateChange(totalAgencies)}
        />
        <StatsCard
          title="Total Properties"
          value={totalProperties}
          icon={<Home className="w-5 h-5 text-orange-500" />}
          color="text-orange-500"
          change={calculateChange(totalProperties)}
        />
        <StatsCard
          title="Verified Properties"
          value={verifiedProperties}
          icon={<CheckCircle className="w-5 h-5 text-green-500" />}
          color="text-green-500"
          change={calculateChange(verifiedProperties)}
        />
        <StatsCard
          title="Unverified Properties"
          value={unverifiedProperties}
          icon={<XCircle className="w-5 h-5 text-red-500" />}
          color="text-red-500"
          change={calculateChange(unverifiedProperties)}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Line Chart */}
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Growth Overview</h3>
          <div className="h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#0088FE" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="properties" stroke="#00C49F" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="agents" stroke="#FFBB28" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="agencies" stroke="#FF8042" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Property Types Distribution</h3>
          <div className="h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Recent Properties</h3>
        <div className="space-y-3">
          {properties.slice(0, 5).map((property) => (
            <div
              key={property._id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <img
                  src={property.images?.[0] || '/placeholder-property.jpg'}
                  alt={property.title}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate text-sm lg:text-base">
                    {property.title}
                  </p>
                  <p className="text-gray-500 truncate text-xs lg:text-sm">{property.location}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="font-semibold text-gray-900 text-sm lg:text-base">
                  AED {property.price}
                </p>
                <p className="text-gray-500 text-xs lg:text-sm">
                  {new Date(property.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;