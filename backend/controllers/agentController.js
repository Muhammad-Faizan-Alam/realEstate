const Agent = require("../models/Agent");

// Get all agents
exports.listAgents = async (req, res) => {
  try {
    const agents = await Agent.find().populate('user').sort({ createdAt: -1 });
    res.json(agents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single agent
exports.getAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).populate('user');
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.json(agent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// find agent by user
exports.findAgent = async (req, res) => {
  try {
    const agent = await Agent.findOne({user: req.params.id}).populate('user');
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.status(201).json(agent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create agent
exports.createAgent = async (req, res) => {
  try {
    const data = req.body;
    const agent = await Agent.create(data);
    res.status(201).json(agent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Bulk insert
exports.bulkInsert = async (req, res) => {
  try {
    const agents = await Agent.insertMany(req.body);
    res.status(201).json(agents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Bulk insert failed" });
  }
};

// Update agent
exports.updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.json(agent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete agent
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// verify agent
exports.verifyAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { verify: true },
      { new: true }
    );
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.json(agent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




// ========================stories====================================
// controllers/agentController.js - Updated with proper validation

// Add a new story
exports.addStory = async (req, res) => {
  try {
    const { isVideo, url, insta_url } = req.body;
    const agentId = req.params.id;

    // Validation
    if (!url) {
      return res.status(400).json({ message: 'Media URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid media URL format' });
    }

    // Validate Instagram URL if provided
    if (insta_url) {
      try {
        new URL(insta_url);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid Instagram URL format' });
      }
    }

    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const newStory = {
      isVideo: Boolean(isVideo),
      url: url.trim(),
      insta_url: insta_url ? insta_url.trim() : '',
      date: new Date()
    };

    agent.stories.push(newStory);
    await agent.save();

    // Get the newly added story with its ID
    const savedStory = agent.stories[agent.stories.length - 1];

    res.status(201).json({
      message: 'Story added successfully',
      story: savedStory
    });
  } catch (error) {
    console.error('Add story error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a story
exports.deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const agentId = req.user._id;

    // Validate storyId
    if (!storyId || !mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({ message: 'Invalid story ID' });
    }

    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Check if stories array exists and has items
    if (!agent.stories || agent.stories.length === 0) {
      return res.status(404).json({ message: 'No stories found' });
    }

    const storyIndex = agent.stories.findIndex(
      story => story._id.toString() === storyId
    );

    if (storyIndex === -1) {
      return res.status(404).json({ message: 'Story not found' });
    }

    agent.stories.splice(storyIndex, 1);
    await agent.save();

    res.json({ 
      message: 'Story deleted successfully',
      deletedStoryId: storyId
    });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Repost a story
exports.repostStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const agentId = req.user._id;

    // Validate storyId
    if (!storyId || !mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({ message: 'Invalid story ID' });
    }

    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Check if stories array exists
    if (!agent.stories || agent.stories.length === 0) {
      return res.status(404).json({ message: 'No stories found' });
    }

    const originalStory = agent.stories.id(storyId);
    if (!originalStory) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const repostedStory = {
      isVideo: originalStory.isVideo,
      url: originalStory.url,
      insta_url: originalStory.insta_url,
      date: new Date()
    };

    agent.stories.push(repostedStory);
    await agent.save();

    // Get the reposted story
    const newStory = agent.stories[agent.stories.length - 1];

    res.json({
      message: 'Story reposted successfully',
      story: newStory
    });
  } catch (error) {
    console.error('Repost story error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get agent stories
exports.getStories = async (req, res) => {
  try {
    const agentId = req.params.id;

    const agent = await Agent.findById(agentId).select('stories');
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Ensure stories array exists, default to empty array
    const stories = agent.stories || [];

    // Sort stories by date (newest first)
    const sortedStories = stories.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ 
      stories: sortedStories,
      count: sortedStories.length
    });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get agent stories
exports.getAllStories = async (req, res) => {
  try {
    const agentId = req.params.id;

    const agent = await Agent.findById(agentId).select('stories');
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Ensure stories array exists, default to empty array
    const stories = agent.stories || [];

    // Sort stories by date (newest first)
    const sortedStories = stories.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ 
      stories: sortedStories,
      count: sortedStories.length
    });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};