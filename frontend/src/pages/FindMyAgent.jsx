import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgentCard from '@/components/AgentCard'

const FindMyAgent = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetching = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/agents`);
        if (res.ok) {
          const data = await res.json();
          setAgents(data);
          console.log("0000000", agents)
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetching();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-700">
          Find Your Trusted Real Estate Agent
        </h1>

        {agents.length === 0 ? (
          <p className="text-center text-gray-500">Loading agents...</p>
        ) : (
          <div>
            {agents.map((agent) => (
              // <div
              //   key={agent._id}
              //   className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              // >
              //   {/* Agent Image */}
              //   <div className="h-56 w-full overflow-hidden">
              //     <img
              //       src={agent.image}
              //       alt={agent.user?.name || "Agent"}
              //       className="h-full w-full object-cover transform hover:scale-110 transition-transform duration-500"
              //     />
              //   </div>

              //   {/* Agent Info */}
              //   <div className="p-6 flex flex-col items-center text-center">
              //     <h2 className="text-xl font-semibold text-gray-900">
              //       {agent.user?.name}
              //     </h2>
              //     <p className="text-gray-500 mb-3">Real Estate Agent</p>

              //     {/* City Tags */}
              //     <div className="flex flex-wrap justify-center gap-2 mb-4">
              //       {agent.city?.map((c, i) => (
              //         <span
              //           key={i}
              //           className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
              //         >
              //           {c}
              //         </span>
              //       ))}
              //     </div>

              //     {/* Contact Button */}
              //     <a
              //       href={`mailto:${agent.user?.email}`}
              //       className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors"
              //     >
              //       <Mail size={18} />
              //       Contact
              //     </a>
              //   </div>
              // </div>
              <div key={agent._id} className="mb-2">
                <AgentCard agent={agent} />
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default FindMyAgent;