import React, { useState } from 'react';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log('Form submitted:', formData);

        try {
            if (isLogin) {
                const res = await fetch("http://localhost:5000/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: formData.email, password: formData.password }),
                    credentials: "include", // ✅ VERY IMPORTANT (sends cookies)
                });

                const data = await res.json();
                if (data.success) {
                    console.log("Logged in:", data.user);
                    // Redirect or update UI after successful login
                    window.location.href = "/"; // Redirect to home page
                } else {
                    console.error("Login failed:", data.msg);
                    alert("Login failed: " + data.msg); // Show alert on failure
                }
            } else {
                const res = await fetch("http://localhost:5000/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, role: formData.role }),
                    credentials: "include", // ✅ VERY IMPORTANT (sends cookies)
                });
                const data = await res.json();
                if (data.success) {
                    console.log("Registered:", data.user);
                    setIsLogin(true); // Switch to login mode after successful registration
                } else {
                    console.error("Registration failed:", data.msg);
                    alert("Registration failed: " + data.msg); // Show alert on failure
                }
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Error: " + error.msg); // Show alert on error
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        // Reset form when switching modes
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'user'
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-6xl w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="md:flex gap-20 justify-center items-centers">
                    {/* Image Section */}
                    {/* <div className="md:w-[40%] bg-black p-8 flex items-center justify-center">
                        <div className="text-center text-white">
                            <h2 className="text-4xl font-bold mb-4">
                                {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
                            </h2>
                            <p className="text-black text-lg mb-8">
                                {isLogin
                                    ? 'Sign in to access your account and manage your properties.'
                                    : 'Create your account and start your real estate journey.'
                                }
                            </p>
                            <div className="w-64 h-64 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div> */}

                    {/* Form Section */}
                    <div className="md:w-1/2 p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {isLogin
                                    ? "Don't have an account? "
                                    : "Already have an account? "
                                }
                                <button
                                    onClick={switchMode}
                                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                                >
                                    {isLogin ? 'Register here' : 'Sign in here'}
                                </button>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field - Only show for registration */}
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required={!isLogin}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your password"
                                />
                            </div>

                            {/* Role Field - Only show for registration */}
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        I want to join as
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required={!isLogin}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="user">Property Buyer/Renter</option>
                                        <option value="agent">Real Estate Agent</option>
                                        <option value="agency">Real Estate Agency</option>
                                    </select>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                className="bg-black w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg"
                            >
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;