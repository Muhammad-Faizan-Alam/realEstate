import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminPropertyCard from "@/components/apartments/AdminPropertyCard";
import Sidebar from '@/components/admin/Sidebar';
import DashboardHome from '@/components/admin/DashboardHome';
import UsersTab from '@/components/admin/UsersTab';
import AgentsTab from '@/components/admin/AgentsTab';
import AgenciesTab from '@/components/admin/AgenciesTab';
import SkeletonLoader from '@/components/admin/SkeletonLoader';

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, agentsRes, agenciesRes, propertiesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/user`, {
            credentials: "include"
          }),
          fetch(`${import.meta.env.VITE_API_URL}/agents`, {
            credentials: "include"
          }),
          fetch(`${import.meta.env.VITE_API_URL}/agencies`, {
            credentials: "include"
          }),
          fetch(`${import.meta.env.VITE_API_URL}/properties`, {
            credentials: "include"
          })
        ]);

        const [usersData, agentsData, agenciesData, propertiesData] = await Promise.all([
          usersRes.json(),
          agentsRes.json(),
          agenciesRes.json(),
          propertiesRes.json()
        ]);

        setUsers(usersData);
        setAgents(agentsData);
        setAgencies(agenciesData);
        setProperties(propertiesData);
        console.log("Fetched properties data:", propertiesData);
        // Calculate stats
        calculateStats(usersData, agentsData, agenciesData, propertiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStats = (usersData, agentsData, agenciesData, propertiesData) => {
    const verifiedProperties = propertiesData.filter(p => p.propertyInfo?.truCheck);
    const unverifiedProperties = propertiesData.filter(p => !p.propertyInfo?.truCheck);

    // Calculate monthly growth data
    const monthlyData = calculateMonthlyGrowth(usersData, propertiesData, agentsData, agenciesData);

    // Calculate property type distribution
    const propertyTypeData = calculatePropertyTypes(propertiesData);

    setStats({
      totalUsers: usersData.length,
      totalAgents: agentsData.length,
      totalAgencies: agenciesData.length,
      totalProperties: propertiesData.length,
      verifiedProperties: verifiedProperties.length,
      unverifiedProperties: unverifiedProperties.length,
      monthlyData,
      propertyTypeData
    });
  };

  const calculateMonthlyGrowth = (users, properties, agents, agencies) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();

    return months.slice(0, currentMonth + 1).map((month, index) => {
      const monthIndex = index;
      const monthUsers = users.filter(user =>
        new Date(user.createdAt).getMonth() === monthIndex
      ).length;

      const monthProperties = properties.filter(property =>
        new Date(property.createdAt).getMonth() === monthIndex
      ).length;

      const monthAgents = agents.filter(agent =>
        new Date(agent.createdAt).getMonth() === monthIndex
      ).length;

      const monthAgencies = agencies.filter(agency =>
        new Date(agency.createdAt).getMonth() === monthIndex
      ).length;

      return {
        month,
        users: monthUsers,
        properties: monthProperties,
        agents: monthAgents,
        agencies: monthAgencies
      };
    });
  };

  const calculatePropertyTypes = (properties) => {
    const typeCount = {};
    properties.forEach(property => {
      const type = property.propertyInfo?.type || 'Unknown';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    return Object.entries(typeCount).map(([name, value]) => ({
      name,
      value
    }));
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user._id !== userId));
    setStats(prev => ({
      ...prev,
      totalUsers: prev.totalUsers - 1
    }));
  };

  const handleVerifyAgent = (agentId) => {
    setAgents(agents.map(agent =>
      agent._id === agentId ? { ...agent, verify: true } : agent
    ));
  };

  const handleDeleteAgent = (agentId) => {
    setAgents(agents.filter(agent => agent._id !== agentId));
    setStats(prev => ({
      ...prev,
      totalAgents: prev.totalAgents - 1
    }));
  };

  const handleVerifyAgency = (agencyId) => {
    setAgencies(agencies.map(agency =>
      agency._id === agencyId ? { ...agency, verify: true } : agency
    ));
  };

  const handleDeleteAgency = (agencyId) => {
    setAgencies(agencies.filter(agency => agency._id !== agencyId));
    setStats(prev => ({
      ...prev,
      totalAgencies: prev.totalAgencies - 1
    }));
  };

  const verifiedProperties = properties.filter(p => p.propertyInfo?.truCheck);
  const unverifiedProperties = properties.filter(p => !p.propertyInfo?.truCheck);

  const renderContent = () => {
    if (loading) {
      return <SkeletonLoader type={activeTab} />;
    }

    switch (activeTab) {
      case 'home':
        return (
          <DashboardHome
            stats={stats}
            users={users}
            agents={agents}
            agencies={agencies}
            properties={properties}
            loading={loading}
          />
        );
      case 'users':
        return <UsersTab users={users} onDeleteUser={handleDeleteUser} loading={loading} />;
      case 'agents':
        return (
          <AgentsTab
            agents={agents}
            onVerifyAgent={handleVerifyAgent}
            onDeleteAgent={handleDeleteAgent}
            loading={loading}
          />
        );
      case 'agencies':
        return (
          <AgenciesTab
            agencies={agencies}
            onVerifyAgency={handleVerifyAgency}
            onDeleteAgency={handleDeleteAgency}
            loading={loading}
          />
        );
      case 'verified-properties':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {verifiedProperties.length > 0 ? (
              verifiedProperties.map((property) => (
                <AdminPropertyCard key={property._id} property={property} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏠</div>
                <p className="text-gray-500 text-lg">No verified properties available</p>
              </div>
            )}
          </div>
        );
      case 'unverified-properties':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {unverifiedProperties.length > 0 ? (
              unverifiedProperties.map((property) => (
                <AdminPropertyCard key={property._id} property={property} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏠</div>
                <p className="text-gray-500 text-lg">No unverified properties available</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Mobile Menu Button */}
      <div className="lg:hidden bg-white shadow-sm border-b">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-4 text-gray-600 hover:text-gray-900 flex items-center space-x-2"
        >
          <span>☰</span>
          <span>Menu</span>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isMobile={false}
            setIsMobileOpen={setIsMobileOpen}
          />
        </div>

        {/* Mobile Sidebar */}
        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isMobile={true}
              setIsMobileOpen={setIsMobileOpen}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-h-screen p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6 lg:mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {activeTab === 'home' ? 'Dashboard Overview' :
                  activeTab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </h1>
              <p className="text-gray-600 mt-2 text-sm lg:text-base">
                {activeTab === 'home'
                  ? 'Welcome to your admin dashboard. Here you can manage users, agents, agencies, and properties.'
                  : `Manage ${activeTab.split('-').join(' ')} in your system.`}
              </p>
            </div>

            {/* Content */}
            <div className="overflow-hidden">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;