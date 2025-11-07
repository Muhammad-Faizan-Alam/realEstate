import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgentCard from '@/components/AgentCard';
import { Play, Image, X, ChevronLeft, ChevronRight, Clock } from "lucide-react";

const FindMyAgent = () => {
  const [agents, setAgents] = useState([]);
  const [stories, setStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch agents and their stories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const agentsRes = await fetch(`${import.meta.env.VITE_API_URL}/agents`, {
          credentials: "include"
        });
        if (agentsRes.ok) {
          const agentsData = await agentsRes.json();
          setAgents(agentsData);

          // Extract and filter stories from all agents (last 24 hours)
          const allStories = [];
          agentsData.forEach(agent => {
            if (agent.stories && agent.stories.length > 0) {
              agent.stories.forEach(story => {
                const storyDate = new Date(story.date);
                const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

                if (storyDate >= twentyFourHoursAgo) {
                  allStories.push({
                    ...story,
                    agent: {
                      _id: agent._id,
                      name: agent.user?.name,
                      image: agent.image,
                      city: agent.city
                    }
                  });
                }
              });
            }
          });

          // Sort stories by date (newest first)
          const sortedStories = allStories.sort((a, b) =>
            new Date(b.date) - new Date(a.date)
          );
          setStories(sortedStories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter stories for the last 24 hours
  const recentStories = stories.filter(story => {
    const storyDate = new Date(story.date);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return storyDate >= twentyFourHoursAgo;
  });

  // Group stories by agent
  const storiesByAgent = recentStories.reduce((acc, story) => {
    const agentId = story.agent._id;
    if (!acc[agentId]) {
      acc[agentId] = {
        agent: story.agent,
        stories: []
      };
    }
    // Only add the latest story from each agent for the carousel
    if (acc[agentId].stories.length === 0) {
      acc[agentId].stories.push(story);
    }
    return acc;
  }, {});

  const agentStories = Object.values(storiesByAgent);

  // Lightbox navigation
  const openLightbox = (agentId, storyIndex = 0) => {
    const agentStoriesList = recentStories.filter(story => story.agent._id === agentId);
    setCurrentAgent({
      ...storiesByAgent[agentId].agent,
      stories: agentStoriesList
    });
    setCurrentStoryIndex(storyIndex);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setCurrentAgent(null);
    setCurrentStoryIndex(0);
  };

  const goToNextStory = () => {
    if (currentAgent && currentStoryIndex < currentAgent.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      closeLightbox();
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goToNextStory();
      if (e.key === 'ArrowLeft') goToPrevStory();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, currentStoryIndex, currentAgent]);

  // Format relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return 'Yesterday';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stories Section */}
        {agentStories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Stories</h2>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                Last 24 hours
              </div>
            </div>

            {/* Stories Carousel */}
            <div className="relative">
              <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                {agentStories.map(({ agent, stories: agentStoriesList }) => (
                  <div
                    key={agent._id}
                    className="flex flex-col items-center cursor-pointer flex-shrink-0 group"
                    onClick={() => openLightbox(agent._id)}
                  >
                    {/* Story Circle with Gradient Border */}
                    <div className="relative mb-2">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center p-1 group-hover:scale-110 transition-transform duration-200">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                          <img
                            src={agent.image}
                            alt={agent.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyNEMzNC4yMDkxIDI0IDM2IDIyLjIwOTEgMzYgMjBDMzYgMTcuNzkwOSAzNC4yMDkxIDE2IDMyIDE2QzI5Ljc5MDkgMTYgMjggMTcuNzkwOSAyOCAyMEMyOCAyMi4yMDkxIDI5Ljc5MDkgMjQgMzIgMjRaIiBmaWxsPSIjOUE5QjlCIi8+CjxwYXRoIGQ9Ik0yMCA0OEg0NFYzNkwzNi44IDI4LjRDMzUuMiAyNi44IDMyLjggMjYuOCAzMS4yIDI4LjRMMjQgMzUuNkwxOS4yIDMwLjhDMTcuNiAyOS4yIDE1LjIgMjkuMiAxMy42IDMwLjhMMjAgMzhWNDhaIiBmaWxsPSIjOUE5QjlCIi8+Cjwvc3ZnPgo=';
                            }}
                          />
                        </div>
                      </div>

                      {/* Story Type Indicator */}
                      {agentStoriesList[0]?.isVideo && (
                        <div className="absolute -bottom-1 -right-1 bg-black bg-opacity-70 rounded-full p-1">
                          <Play className="w-3 h-3 text-white fill-white" />
                        </div>
                      )}
                    </div>

                    {/* Agent Name */}
                    <span className="text-xs font-medium text-gray-700 truncate max-w-20 text-center">
                      {agent.name}
                    </span>

                    {/* Story Time */}
                    <span className="text-xs text-gray-500 mt-1">
                      {getRelativeTime(agentStoriesList[0]?.date)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-700">
          Find Your Trusted Real Estate Agent
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : agents.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No agents found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
            {agents.map((agent) => (
              <div key={agent._id}>
                <AgentCard agent={agent} openLightbox={openLightbox} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {isLightboxOpen && currentAgent && currentAgent.stories[currentStoryIndex] && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {currentAgent.stories.length > 1 && (
              <>
                <button
                  onClick={goToPrevStory}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors disabled:opacity-30"
                  disabled={currentStoryIndex === 0}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={goToNextStory}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors disabled:opacity-30"
                  disabled={currentStoryIndex === currentAgent.stories.length - 1}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Story Content */}
            <div className="bg-white rounded-2xl overflow-hidden">
              {/* Agent Header */}
              <div className="flex items-center p-4 border-b border-gray-200">
                <img
                  src={currentAgent.image}
                  alt={currentAgent.name}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{currentAgent.name}</h3>
                  <p className="text-sm text-gray-500">
                    {getRelativeTime(currentAgent.stories[currentStoryIndex].date)}
                  </p>
                </div>
              </div>

              {/* Media Content */}
              <div className="relative">
                {currentAgent.stories[currentStoryIndex].isVideo ? (
                  <video
                    src={currentAgent.stories[currentStoryIndex].url}
                    controls
                    autoPlay
                    className="w-full max-h-96 object-contain bg-black"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={currentAgent.stories[currentStoryIndex].url}
                    alt="Story"
                    className="w-full max-h-96 object-contain"
                  />
                )}
              </div>

              {/* Story Counter */}
              {currentAgent.stories.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                  {currentStoryIndex + 1} / {currentAgent.stories.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default FindMyAgent;