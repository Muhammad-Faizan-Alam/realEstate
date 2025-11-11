import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AgentDashboard = () => {
    const [user, setUser] = useState();
    const [agent, setAgent] = useState();
    const [isAgent, setIsAgent] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [cityList, setCityList] = useState([]);
    const [cityInput, setCityInput] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Fetch logged-in user
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
                    credentials: "include",
                });
                const data = await res.json();
                if (data?._id) setUser(data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);

    // ✅ Check if already an agent
    useEffect(() => {
        if (!user?._id) return;

        const findAgent = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/agents/find/${user._id}`, {
                    credentials: 'include',
                });
                if (res.ok) setIsAgent(true);
                const data = await res.json();
            } catch (error) {
                console.error("Error fetching agent:", error);
            }
        };

        findAgent();
    }, [user]);

    // ✅ Upload to Cloudinary
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "my_unsigned_preset");

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dqt60inwv/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            setImageUrl(data.secure_url);
        } catch (error) {
            console.error("Cloudinary upload failed:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Add multiple cities
    const handleAddCity = () => {
        if (cityInput.trim() && !cityList.includes(cityInput.trim())) {
            setCityList((prev) => [...prev, cityInput.trim()]);
            setCityInput("");
        }
    };

    // ✅ Submit form to backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?._id) return alert("User not found!");
        if (!imageUrl) return alert("Please upload an image first!");
        if (cityList.length === 0) return alert("Add at least one city!");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/agents`, {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: user._id,
                    image: imageUrl,
                    city: cityList,
                }),
            });

            if (res.ok) {
                alert("Agent profile created successfully!");
                setIsAgent(true);
                window.location.href = "/agency/dashboard";
            } else {
                const err = await res.json();
                console.error(err);
                alert("Failed to create agent profile.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    // 🚫 Not an agency
    if (user && user.role !== "agent") {
        return (
            <div className="bg-red-100 text-red-600 text-xl text-center p-8">
                You are not an agent, so you can't access this dashboard.
            </div>
        );
    }

    // 🧾 Show registration form
    if (!isAgent && user?.role === "agent") {
        return (
            <div>
                <Header />
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
                    <div className="text-center mb-8">
                        <p className="text-xl italic text-blue-600 font-semibold bg-blue-100 px-6 py-4 rounded-xl shadow-sm">
                            Welcome {user.name}! <br />
                            <span className="font-medium text-gray-700">
                                You're just 1 step away from accessing your dashboard.
                            </span>
                        </p>
                        <p className="text-gray-600 font-medium text-lg mt-4">
                            Fill out this form to complete your agent profile
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6 border border-gray-200"
                    >
                        {/* Image Upload */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                📸 Give us your professional image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                            {loading && (
                                <p className="text-sm text-blue-500 mt-2">Uploading image...</p>
                            )}
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt="Uploaded"
                                    className="mt-3 w-24 h-24 rounded-full object-cover border-2 border-blue-400"
                                />
                            )}
                        </div>

                        {/* City Input */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                🏙️ Tell us about your state/city (you may add multiple)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter city or state"
                                    value={cityInput}
                                    onChange={(e) => setCityInput(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-lg p-2"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCity}
                                    className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Add
                                </button>
                            </div>

                            {cityList.length > 0 && (
                                <ul className="mt-3 flex flex-wrap gap-2">
                                    {cityList.map((city, i) => (
                                        <li
                                            key={i}
                                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                        >
                                            {city}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Submit & Continue
                        </button>
                    </form>
                </div>
                <Footer />
            </div>
        );
    }

    // ✅ Dashboard after registration
    return (
        <div>
            <Header />
            <Footer />
        </div>
    );
};

export default AgentDashboard;