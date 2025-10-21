const Agency = require("../models/Agency");
const User = require("../models/User");
const PropertyDetail = require("../models/PropertyDetail");
const mongoose = require("mongoose");

// GET /api/agencies
exports.listAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find().populate('user').sort({ createdAt: -1 });
    res.json(agencies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/agencies/:id
exports.getAgency = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id).populate('user');
    if (!agency) return res.status(404).json({ message: "Agency not found" });
    res.json(agency);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/agencies/
exports.createAgency = async (req, res) => {
  try {
    const agency = await Agency.create(req.body);
    res.status(201).json(agency);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/agencies/:id
exports.updateAgency = async (req, res) => {
  try {
    const agency = await Agency.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!agency) return res.status(404).json({ message: "Agency not found" });
    res.json(agency);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/agencies/:id
exports.deleteAgency = async (req, res) => {
  try {
    const agency = await Agency.findByIdAndDelete(req.params.id);
    if (!agency) return res.status(404).json({ message: "Agency not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// find agency by user ID
exports.findAgency = async (req, res) => {
  try {
    const agency = await Agency.findOne({ user: req.params.id }).populate('user');
    if (!agency) return res.status(404).json({ message: "Agency not found" });
    res.status(200).json(agency);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// verify agency
exports.verifyAgency = async (req, res) => {
  try {
    const agency = await Agency.findByIdAndUpdate(
      req.params.id,
      { verify: req.body.verify },
      { new: true }
    );
    if (!agency) return res.status(404).json({ message: "Agency not found" });
    res.json(agency);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Updated getAgencyProperties function with debugging
exports.getAgencyProperties = async (req, res) => {
  try {
    const {
      agency,
      propertyType,
      state,
      status,
      type,
      beds,
      baths,
      developer,
      offPlan,
      currentStatus,
      page = 1,
      limit = 10
    } = req.query;

    console.log('Query parameters:', req.query);

    let query = {};

    // Agency filter - check if agency ID is properly referenced
    if (agency) {
      console.log('Agency ID from query:', agency);
      query['regulatoryInfo.agency'] = new mongoose.Types.ObjectId(agency);
    } else {
      return res.status(400).json({ message: "Agency ID is required" });
    }

    // Property type filter - handle case sensitivity
    if (propertyType && propertyType !== 'all' && propertyType !== 'others') {
      // Convert to proper case for matching
      const propertyTypeMap = {
        'apartments': 'Apartment',
        'villas': 'Villa',
        'townhouse': 'Townhouse'
      };

      query.propertyType = propertyTypeMap[propertyType] || propertyType;
      console.log('Property type filter:', query.propertyType);
    } else if (propertyType === 'others') {
      query.propertyType = { $nin: ['Apartment', 'Villa', 'Townhouse'] };
    }

    // State filter - make case insensitive
    if (state && state !== 'all') {
      query.state = new RegExp(state, 'i'); // 'i' for case insensitive
      console.log('State filter:', query.state);
    }

    // Verification status filter
    if (status && status !== 'all') {
      if (status === 'verified') {
        query['propertyInfo.truCheck'] = true;
      } else if (status === 'unverified') {
        query['propertyInfo.truCheck'] = false;
      }
    }

    // Purpose filter
    if (type && type !== 'all') {
      query['propertyInfo.purpose'] = type.charAt(0).toUpperCase() + type.slice(1);
    }

    // Add other filters as needed...

    console.log('Final query:', JSON.stringify(query, null, 2));

    // Get total count for pagination
    const total = await PropertyDetail.countDocuments(query);
    console.log('Total properties found:', total);

    // Get properties with pagination
    const properties = await PropertyDetail.find(query)
      .populate('regulatoryInfo.agency')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    console.log('Properties returned:', properties.length);

    res.json({
      properties,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProperties: total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching agency properties:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get agency dashboard statistics
exports.getAgencyStats = async (req, res) => {
  try {
    const { agencyId } = req.params;

    if (!agencyId) {
      return res.status(400).json({ message: "Agency ID is required" });
    }

    const stats = await PropertyDetail.aggregate([
      {
        $match: {
          'regulatoryInfo.agency': new mongoose.Types.ObjectId(agencyId)
        }
      },
      {
        $group: {
          _id: null,
          totalProperties: { $sum: 1 },
          totalForSale: {
            $sum: {
              $cond: [{ $eq: ['$propertyInfo.purpose', 'Sale'] }, 1, 0]
            }
          },
          totalForRent: {
            $sum: {
              $cond: [{ $eq: ['$propertyInfo.purpose', 'Rent'] }, 1, 0]
            }
          },
          availableProperties: {
            $sum: {
              $cond: [{ $eq: ['$propertyInfo.currentStatus', 'Available'] }, 1, 0]
            }
          },
          soldProperties: {
            $sum: {
              $cond: [{ $eq: ['$propertyInfo.currentStatus', 'Sold'] }, 1, 0]
            }
          },
          rentedProperties: {
            $sum: {
              $cond: [{ $eq: ['$propertyInfo.currentStatus', 'Rented'] }, 1, 0]
            }
          },
          verifiedProperties: {
            $sum: {
              $cond: ['$propertyInfo.truCheck', 1, 0]
            }
          },
          offPlanProperties: {
            $sum: {
              $cond: ['$isOffPlan', 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalProperties: 1,
          totalForSale: 1,
          totalForRent: 1,
          availableProperties: 1,
          soldProperties: 1,
          rentedProperties: 1,
          verifiedProperties: 1,
          unverifiedProperties: {
            $subtract: ['$totalProperties', '$verifiedProperties']
          },
          offPlanProperties: 1
        }
      }
    ]);

    // Property type distribution
    const typeDistribution = await PropertyDetail.aggregate([
      {
        $match: {
          'regulatoryInfo.agency': new mongoose.Types.ObjectId(agencyId)
        }
      },
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // State distribution
    const stateDistribution = await PropertyDetail.aggregate([
      {
        $match: {
          'regulatoryInfo.agency': new mongoose.Types.ObjectId(agencyId)
        }
      },
      {
        $group: {
          _id: '$state',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          state: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    const result = {
      overview: stats[0] || {
        totalProperties: 0,
        totalForSale: 0,
        totalForRent: 0,
        availableProperties: 0,
        soldProperties: 0,
        rentedProperties: 0,
        verifiedProperties: 0,
        unverifiedProperties: 0,
        offPlanProperties: 0
      },
      typeDistribution,
      stateDistribution
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching agency stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get property counts by section for sidebar
exports.getPropertyCounts = async (req, res) => {
  try {
    const { agencyId } = req.params;

    if (!agencyId) {
      return res.status(400).json({ message: "Agency ID is required" });
    }

    const counts = await PropertyDetail.aggregate([
      {
        $match: {
          'regulatoryInfo.agency': new mongoose.Types.ObjectId(agencyId)
        }
      },
      {
        $facet: {
          // Property type counts
          apartments: [
            { $match: { propertyType: 'Apartment' } },
            { $count: 'count' }
          ],
          villas: [
            { $match: { propertyType: 'Villa' } },
            { $count: 'count' }
          ],
          townhouse: [
            { $match: { propertyType: 'Townhouse' } },
            { $count: 'count' }
          ],
          others: [
            { $match: { propertyType: { $nin: ['Apartment', 'Villa', 'Townhouse'] } } },
            { $count: 'count' }
          ],
          // State counts
          dubai: [
            { $match: { state: /dubai/i } },
            { $count: 'count' }
          ],
          abuDhabi: [
            { $match: { state: /abu dhabi/i } },
            { $count: 'count' }
          ],
          sharjah: [
            { $match: { state: /sharjah/i } },
            { $count: 'count' }
          ],
          ajman: [
            { $match: { state: /ajman/i } },
            { $count: 'count' }
          ],
          rasAlKhaimah: [
            { $match: { state: /ras al khaimah/i } },
            { $count: 'count' }
          ],
          fujairah: [
            { $match: { state: /fujairah/i } },
            { $count: 'count' }
          ],
          ummAlQuwain: [
            { $match: { state: /umm al quwain/i } },
            { $count: 'count' }
          ],
          // Status counts
          verified: [
            { $match: { 'propertyInfo.truCheck': true } },
            { $count: 'count' }
          ],
          unverified: [
            { $match: { 'propertyInfo.truCheck': false } },
            { $count: 'count' }
          ]
        }
      }
    ]);

    const result = {
      types: {
        apartments: counts[0].apartments[0]?.count || 0,
        villas: counts[0].villas[0]?.count || 0,
        townhouse: counts[0].townhouse[0]?.count || 0,
        others: counts[0].others[0]?.count || 0
      },
      states: {
        dubai: counts[0].dubai[0]?.count || 0,
        abuDhabi: counts[0].abuDhabi[0]?.count || 0,
        sharjah: counts[0].sharjah[0]?.count || 0,
        ajman: counts[0].ajman[0]?.count || 0,
        rasAlKhaimah: counts[0].rasAlKhaimah[0]?.count || 0,
        fujairah: counts[0].fujairah[0]?.count || 0,
        ummAlQuwain: counts[0].ummAlQuwain[0]?.count || 0
      },
      status: {
        verified: counts[0].verified[0]?.count || 0,
        unverified: counts[0].unverified[0]?.count || 0
      }
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching property counts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};