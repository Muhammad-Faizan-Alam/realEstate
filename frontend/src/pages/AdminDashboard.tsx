import React, { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AdminPropertyCard from "@/components/apartments/AdminPropertyCard";
//  ${import.meta.env.VITE_API_URL}/user        (get all and delete users)
// `${import.meta.env.VITE_API_URL}/





// users
// agencies
// agents
// verified properties
// unverified properties
const AdminDashboard = () => {
    const [properties, setProperties] = React.useState([]);
    useEffect(() => {
        const properties = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/properties`);
                const data = await res.json();
                console.log("Fetched properties:", data);
                setProperties(data);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };
        properties();
    }, []);

    return (
        <div>
            <Header />
            <h1 className='bg-gray-100 text-gray-500 p-4'>
                Welcome to <span className='text-blue-500 font-bold italic'>Secure Admin</span> Dashboard
            </h1>
            {/* properties */}
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
                {properties.length > 0 ? (
                    properties.map((property) => (
                        <AdminPropertyCard key={property._id} property={property} />
                    ))
                ) : (
                    <p className='text-center text-gray-500 mt-10'>No properties available</p>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default AdminDashboard