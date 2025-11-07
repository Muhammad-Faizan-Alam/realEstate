import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
    Video,
    Image,
    Plus,
    Trash2,
    Share2,
    MoreVertical,
    X,
    ChevronLeft,
    ChevronRight,
    Upload,
    Calendar
} from 'lucide-react';

// Custom Modal Component
const Modal = ({ isOpen, onClose, children, className = '' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-2xl w-full max-h-full">
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white text-2xl z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className={`bg-white rounded-2xl shadow-xl ${className}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

// Custom Dialog Component
const Dialog = ({ isOpen, onClose, children, className = '' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-md w-full">
                <div className={`bg-white rounded-2xl shadow-xl ${className}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

// Custom Alert Dialog Component
const AlertDialog = ({ isOpen, onClose, title, description, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{description}</p>
                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// Custom Context Menu Component
const ContextMenu = ({ children, menuItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleContextMenu = (e) => {
        e.preventDefault();
        setPosition({ x: e.clientX, y: e.clientY });
        setIsOpen(true);
    };

    useEffect(() => {
        const handleClick = () => setIsOpen(false);
        if (isOpen) {
            document.addEventListener('click', handleClick);
        }
        return () => document.removeEventListener('click', handleClick);
    }, [isOpen]);

    return (
        <div onContextMenu={handleContextMenu}>
            {children}
            {isOpen && (
                <div
                    className="fixed z-50 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                    style={{ left: position.x, top: position.y }}
                >
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                item.onClick();
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2 ${item.destructive ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                                }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Custom Button Component
const Button = ({
    children,
    onClick,
    className = '',
    disabled = false,
    size = 'default',
    variant = 'default',
    type = 'button',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-blue-500'
    };

    const sizes = {
        default: 'h-10 py-2 px-4',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10'
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

// Custom Card Components
const Card = ({ children, className = '', ...props }) => (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`} {...props}>
        {children}
    </div>
);

const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

const StoriesGallery = ({ agent }) => {
    const [stories, setStories] = useState([]);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [uploadData, setUploadData] = useState({
        isVideo: false,
        url: '',
        insta_url: ''
    });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [storyToDelete, setStoryToDelete] = useState(null);
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);

    const API_URL = `${import.meta.env.VITE_API_URL}/agents`;

    // Filter stories from the last 24 hours
    const currentStories = stories.filter(story => {
        const storyDate = new Date(story.date);
        const oneDayAgo = new Date();
        oneDayAgo.setHours(oneDayAgo.getHours() - 24);
        return storyDate >= oneDayAgo;
    });


    // Fetch stories
    const fetchStories = async () => {
        try {
            const response = await axios.get(`${API_URL}/stories/${agent._id}`, {
                withCredentials: true
            });
            const sortedStories = (response.data.stories || []).sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            );
            setStories(sortedStories);
        } catch (error) {
            console.error('Error fetching stories:', error);
            toast.error('Failed to fetch stories');
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    // Cloudinary file upload
    const handleFileUpload = async (file) => {
        if (!file) return null;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "my_unsigned_preset");

            const xhr = new XMLHttpRequest();

            return new Promise((resolve, reject) => {
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const progress = (event.loaded / event.total) * 100;
                        setUploadProgress(progress);
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        const data = JSON.parse(xhr.responseText);
                        resolve(data.secure_url);
                    } else {
                        reject(new Error('Upload failed'));
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new Error('Upload failed'));
                });

                xhr.open('POST', 'https://api.cloudinary.com/v1_1/dqt60inwv/upload');
                xhr.send(formData);
            });
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // Handle file selection
    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type and size
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            toast.error('File size must be less than 50MB');
            return;
        }

        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');

        if (!isVideo && !isImage) {
            toast.error('Please select an image or video file');
            return;
        }

        try {
            toast.info('Uploading file...');
            const fileUrl = await handleFileUpload(file);

            setUploadData({
                isVideo,
                url: fileUrl,
                insta_url: ''
            });

            toast.success('File uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload file');
        }
    };

    // Add new story
    const handleAddStory = async (e) => {
        e.preventDefault();

        if (!uploadData.url) {
            toast.error('Please upload a file first');
            return;
        }

        try {
            await axios.post(`${API_URL}/stories/${agent._id}`,
                uploadData,
                {
                    withCredentials: true
                });
            toast.success('Story added successfully!');
            await fetchStories();
            setIsUploadDialogOpen(false);
            setUploadData({ isVideo: false, url: '', insta_url: '' });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error adding story:', error);
            toast.error('Failed to add story');
        }
    };

    // Delete story
    const handleDeleteStory = async (storyId) => {
        try {
            await axios.delete(`${API_URL}/stories/${storyId}`, {
                withCredentials: true
            });
            toast.success('Story deleted successfully');
            await fetchStories();

            if (isLightboxOpen) {
                if (stories.length === 1) {
                    setIsLightboxOpen(false);
                } else if (currentStoryIndex >= stories.length - 1) {
                    setCurrentStoryIndex(stories.length - 2);
                }
            }
        } catch (error) {
            console.error('Error deleting story:', error);
            toast.error('Failed to delete story');
        } finally {
            setDeleteDialogOpen(false);
            setStoryToDelete(null);
        }
    };

    // Repost story
    const handleRepostStory = async (storyId) => {
        try {
            await axios.post(`${API_URL}/stories/${storyId}/repost`, {
                withCredentials: true
            });
            toast.success('Story reposted successfully');
            await fetchStories();
        } catch (error) {
            console.error('Error reposting story:', error);
            toast.error('Failed to repost story');
        }
    };

    // Lightbox navigation
    const goToNextStory = () => {
        if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
        } else {
            setIsLightboxOpen(false);
        }
    };

    const goToPrevStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(currentStoryIndex - 1);
        }
    };

    // Open lightbox with specific story
    const openLightbox = (index) => {
        if (stories.length === 0) return;
        setCurrentStoryIndex(index);
        setIsLightboxOpen(true);
    };

    // Close lightbox
    const closeLightbox = () => {
        setIsLightboxOpen(false);
        if (videoRef.current) {
            videoRef.current.pause();
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
    }, [isLightboxOpen, currentStoryIndex, stories.length]);

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        return formatDate(dateString);
    };

    // Context menu items for stories
    const getContextMenuItems = (story, index) => [
        {
            label: 'View Story',
            icon: <Image className="w-4 h-4" />,
            onClick: () => openLightbox(index)
        },
        {
            label: 'Repost',
            icon: <Share2 className="w-4 h-4" />,
            onClick: () => handleRepostStory(story._id)
        },
        {
            label: 'Delete',
            icon: <Trash2 className="w-4 h-4" />,
            onClick: () => {
                setStoryToDelete(story._id);
                setDeleteDialogOpen(true);
            },
            destructive: true
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            {/* Current Stories Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Your Stories</h2>
                    <Button
                        onClick={() => setIsUploadDialogOpen(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Story
                    </Button>
                </div>

                <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                    {/* Add New Story Circle */}
                    <div
                        className="flex flex-col items-center cursor-pointer flex-shrink-0 group"
                        onClick={() => setIsUploadDialogOpen(true)}
                    >
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-2 group-hover:from-purple-500 group-hover:to-pink-600 transition-all duration-200 shadow-lg">
                            <div className="w-18 h-18 bg-white rounded-full flex items-center justify-center">
                                <Plus className="w-8 h-8 text-purple-500" />
                            </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Add Story</span>
                    </div>

                    {/* Current Stories */}
                    {currentStories.length > 0 ? (
                        currentStories.map((story, index) => (
                            <div
                                key={story._id}
                                className="flex flex-col items-center cursor-pointer flex-shrink-0 group"
                                onClick={() => {
                                    const originalIndex = stories.findIndex(s => s._id === story._id);
                                    openLightbox(originalIndex);
                                }}
                            >
                                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full flex items-center justify-center mb-2 p-1 group-hover:scale-105 transition-transform duration-200 shadow-lg">
                                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                                        {story.isVideo ? (
                                            <div className="relative w-full h-full bg-gray-200 flex items-center justify-center">
                                                <Video className="w-6 h-6 text-gray-500" />
                                                <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 rounded-full p-1">
                                                    <Video className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                        ) : (
                                            <img
                                                src={story.url}
                                                alt="Story"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyNEMzNC4yMDkxIDI0IDM2IDIyLjIwOTEgMzYgMjBDMzYgMTcuNzkwOSAzNC4yMDkxIDE2IDMyIDE2QzI5Ljc5MDkgMTYgMjggMTcuNzkwOSAyOCAyMEMyOCAyMi4yMDkxIDI5Ljc5MDkgMjQgMzIgMjRaIiBmaWxsPSIjOUE5QjlCIi8+CjxwYXRoIGQ9Ik0yMCA0OEg0NFYzNkwzNi44IDI4LjRDMzUuMiAyNi44IDMyLjggMjYuOCAzMS4yIDI4LjRMMjQgMzUuNkwxOS4yIDMwLjhDMTcuNiAyOS4yIDE1LjIgMjkuMiAxMy42IDMwLjhMMjAgMzhWNDhaIiBmaWxsPSIjOUE5QjlCIi8+Cjwvc3ZnPgo=';
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-600 truncate max-w-20">
                                    {getRelativeTime(story.date)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="flex-1 text-center py-8">
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                                <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No recent stories</p>
                                <p className="text-gray-400 text-sm mt-2">Add your first story to get started</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* All Stories Grid */}
            <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">All Stories</h2>

                {stories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {stories.map((story, index) => (
                            <ContextMenu
                                key={story._id}
                                menuItems={getContextMenuItems(story, index)}
                            >
                                <Card
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-200 overflow-hidden"
                                    onClick={() => openLightbox(index)}
                                >
                                    <div className="relative">
                                        {story.isVideo ? (
                                            <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative">
                                                <Video className="w-12 h-12 text-blue-400" />
                                                <div className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full p-2">
                                                    <Video className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                        ) : (
                                            <img
                                                src={story.url}
                                                alt="Story"
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDI1NiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjggOTZDMTM0LjYyNyA5NiAxNDAgOTAuNjI3NCAxNDAgODRDMTQwIDc3LjM3MjYgMTM0LjYyNyA3MiAxMjggNzJDMTIxLjM3MyA3MiAxMTYgNzcuMzcyNiAxMTYgODRDMTE2IDkwLjYyNzQgMTIxLjM3MyA5NiAxMjggOTZaIiBmaWxsPSIjOUE5QjlCIi8+CjxwYXRoIGQ9Ik04MCAxNTJIMTc2VjEyOEwxNDcuMiAxMTMuNkMxNDAuOCAxMDcuMiAxMzEuMiAxMDcuMiAxMjQuOCAxMTMuNkw5NiAxNDIuNEw4MC44IDEyNy4yQzc0LjQgMTIwLjggNjQuOCAxMjAuOCA1OC40IDEyNy4yTDgwIDE0OFYxNTJaIiBmaWxsPSIjOUE5QjlCIi8+Cjwvc3ZnPgo=';
                                                }}
                                            />
                                        )}

                                        <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                                            {formatDate(story.date)}
                                        </div>
                                    </div>

                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {getRelativeTime(story.date)}
                                                </span>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </ContextMenu>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Image className="w-10 h-10 text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Stories Yet</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Share your moments with stunning stories. Upload images or videos to get started.
                        </p>
                        <Button
                            onClick={() => setIsUploadDialogOpen(true)}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            size="lg"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Your First Story
                        </Button>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <Modal isOpen={isLightboxOpen} onClose={closeLightbox}>
                <div className="relative w-full h-full flex items-center justify-center p-4">
                    {/* Navigation Buttons */}
                    {stories.length > 1 && (
                        <>
                            <Button
                                onClick={goToPrevStory}
                                className="absolute left-4 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70 rounded-full w-12 h-12 disabled:opacity-30"
                                size="icon"
                                disabled={currentStoryIndex === 0}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>

                            <Button
                                onClick={goToNextStory}
                                className="absolute right-4 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70 rounded-full w-12 h-12 disabled:opacity-30"
                                size="icon"
                                disabled={currentStoryIndex === stories.length - 1}
                            >
                                <ChevronRight className="w-6 h-6" />
                            </Button>
                        </>
                    )}

                    {/* Story Content */}
                    <div className="relative max-w-4xl max-h-full">
                        {stories[currentStoryIndex]?.isVideo ? (
                            <video
                                ref={videoRef}
                                src={stories[currentStoryIndex]?.url}
                                controls
                                autoPlay
                                className="max-w-full max-h-screen rounded-lg shadow-2xl"
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img
                                src={stories[currentStoryIndex]?.url}
                                alt="Story"
                                className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
                            />
                        )}
                    </div>

                    {/* Story Counter */}
                    {stories.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full text-sm">
                            {currentStoryIndex + 1} / {stories.length}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute bottom-4 right-4 flex space-x-3">
                        <Button
                            onClick={() => handleRepostStory(stories[currentStoryIndex]?._id)}
                            className="bg-green-500 text-white hover:bg-green-600"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Repost
                        </Button>
                        <Button
                            onClick={() => {
                                setStoryToDelete(stories[currentStoryIndex]?._id);
                                setDeleteDialogOpen(true);
                            }}
                            variant="destructive"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Upload Dialog */}
            <Dialog isOpen={isUploadDialogOpen} onClose={() => setIsUploadDialogOpen(false)} className="p-6">
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 text-center">
                        Add New Story
                    </h3>

                    <form onSubmit={handleAddStory} className="space-y-6">
                        {/* File Upload Section */}
                        <div className="space-y-4">
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-400 transition-colors duration-200 bg-gray-50"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                {isUploading ? (
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                                            <Upload className="w-6 h-6 text-purple-500 animate-pulse" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Uploading... {Math.round(uploadProgress)}%
                                            </p>
                                        </div>
                                    </div>
                                ) : uploadData.url ? (
                                    <div className="space-y-3">
                                        {uploadData.isVideo ? (
                                            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                                                <Video className="w-8 h-8 text-blue-500" />
                                            </div>
                                        ) : (
                                            <img
                                                src={uploadData.url}
                                                alt="Preview"
                                                className="w-16 h-16 object-cover rounded-xl mx-auto"
                                            />
                                        )}
                                        <p className="text-sm text-gray-600">
                                            {uploadData.isVideo ? 'Video' : 'Image'} uploaded successfully!
                                        </p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            Change File
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                                            <Upload className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Click to upload</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                PNG, JPG, MP4 up to 50MB
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Instagram URL */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Instagram URL (Optional)
                            </label>
                            <input
                                type="url"
                                value={uploadData.insta_url}
                                onChange={(e) => setUploadData({ ...uploadData, insta_url: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="https://instagram.com/p/..."
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsUploadDialogOpen(false);
                                    setUploadData({ isVideo: false, url: '', insta_url: '' });
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                }}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!uploadData.url || isUploading}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                            >
                                {isUploading ? 'Uploading...' : 'Add Story'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                title="Delete Story"
                description="Are you sure you want to delete this story? This action cannot be undone."
                onConfirm={() => handleDeleteStory(storyToDelete)}
            />
        </div>
    );
};

export default StoriesGallery;