import React from "react";
import { Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AgentCard = ({ agent }) => {
    return (
        <div
            className="
        flex flex-col sm:flex-row items-center sm:items-center justify-between
        bg-white rounded-2xl shadow-md hover:shadow-lg 
        transition-all duration-300 p-4 md:p-6 gap-4
      "
        >
            {/* Left: Image */}
            <div className="flex-shrink-0">
                <img
                    src={agent.image}
                    alt={agent.user?.name || 'Agent'}
                    className="
            w-28 h-28 sm:w-24 sm:h-24 md:w-28 md:h-28 
            rounded-xl object-cover border border-gray-200
          "
                />
            </div>

            {/* Middle: Info */}
            <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-wrap gap-3 items-center">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                        {agent.user?.name}
                    </h2>
                    <Badge variant={agent?.verify ? "default" : "secondary"} className="text-xs mt-1">
                        {agent?.verify ? "Verified" : "Unverified"}
                    </Badge>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {agent.city?.map((c, i) => (
                        <span
                            key={i}
                            className="bg-blue-100 text-blue-700 text-xs md:text-sm px-3 py-1 rounded-full"
                        >
                            {c}
                        </span>
                    ))}
                </div>
            </div>

            {/* Right: Contact Button */}
            <div className="w-full sm:w-auto flex justify-center sm:justify-end">
                <a
                    href={`mailto:${agent.user?.email}`}
                    className="
            inline-flex items-center gap-2 
            bg-blue-600 text-white font-medium
            px-6 py-2 rounded-full
            hover:bg-blue-700 transition-colors
            text-sm md:text-base
          "
                >
                    <Mail size={18} />
                    <span>Contact</span>
                </a>
            </div>
        </div>
    );
};

export default AgentCard;