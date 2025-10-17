import React from 'react';

const AgenciesTab = ({ agencies, onVerifyAgency, onDeleteAgency, loading }) => {
  const handleVerify = async (agencyId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/agencies/${agencyId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verify: true }),
      });
      if (response.ok) {
        onVerifyAgency(agencyId);
      }
    } catch (error) {
      console.error('Error verifying agency:', error);
    }
  };

  const handleDelete = async (agencyId) => {
    if (window.confirm('Are you sure you want to delete this agency?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/agencies/${agencyId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          onDeleteAgency(agencyId);
        }
      } catch (error) {
        console.error('Error deleting agency:', error);
      }
    }
  };

  if (loading) {
    return <AgenciesSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Agencies Management</h3>
        <p className="text-gray-600 text-sm">
          Total Agencies: {agencies.length} • 
          Verified: {agencies.filter(a => a.verify).length} • 
          Pending: {agencies.filter(a => !a.verify).length}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agency
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {agencies.map((agency) => (
              <tr key={agency._id} className="hover:bg-gray-50">
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <img
                      className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                      src={agency.logo || '/default-agency.png'}
                      alt={agency.name}
                      onError={(e) => {
                        e.target.src = '/default-agency.png';
                      }}
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] lg:max-w-none">
                        {agency.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-[120px] lg:max-w-none">
                        {agency.user?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">
                    <p className="truncate">{agency.description}</p>
                    {agency.description && agency.description.length > 80 && (
                      <button
                        className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                        onClick={(e) => {
                          e.preventDefault();
                          // You can implement a modal or expandable text here
                          alert(agency.description);
                        }}
                      >
                        Read more
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    agency.verify
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  }`}>
                    {agency.verify ? 'Verified' : 'Pending Verification'}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(agency.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {!agency.verify && (
                    <button
                      onClick={() => handleVerify(agency._id)}
                      className="text-green-600 hover:text-green-900 text-xs lg:text-sm bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
                    >
                      Verify
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(agency._id)}
                    className="text-red-600 hover:text-red-900 text-xs lg:text-sm bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {agencies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏢</div>
            <p className="text-gray-500 text-lg">No agencies found</p>
            <p className="text-gray-400 text-sm mt-2">Agencies will appear here once they register</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton Loader for AgenciesTab
const AgenciesSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      <div className="p-4 lg:p-6">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="flex-shrink-0 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="flex-shrink-0 space-x-2 flex">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgenciesTab;