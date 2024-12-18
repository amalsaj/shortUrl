const Url = require("../models/url");
const User = require("../models/user");

const overAllAnalytics = async (req, res) => {
  try {
    const currentUser = req.user;
    const user = await User.findById(currentUser._id);

    if (!user) {
      return res.status(401).json({ success: false, error: "User not found." });
    }

    const [osType, deviceType, clicks] = await Promise.all([
      Url.aggregate([
        { $match: { userId: currentUser._id.toString() } },
        { $unwind: "$osType" },
        {
          $group: {
            _id: "$osType.osName",
            uniqueClicks: { $sum: "$osType.uniqueClicks" },
            uniqueUsers: { $addToSet: "$osType.users.ipAddress" },
          },
        },
        {
          $project: {
            osName: "$_id",
            uniqueClicks: 1,
            uniqueUsers: { $size: "$uniqueUsers" },
          },
        },
        { $sort: { osName: 1 } },
      ]),

      Url.aggregate([
        { $match: { userId: currentUser._id.toString() } },
        { $unwind: "$deviceType" },
        {
          $group: {
            _id: "$deviceType.deviceName",
            uniqueClicks: { $sum: "$deviceType.uniqueClicks" },
            uniqueUsers: { $addToSet: "$deviceType.users.ipAddress" },
          },
        },
        {
          $project: {
            deviceName: "$_id",
            uniqueClicks: 1,
            uniqueUsers: { $size: "$uniqueUsers" },
          },
        },
        { $sort: { deviceName: 1 } },
      ]),

      Url.aggregate([
        { $match: { userId: currentUser._id.toString() } },
        {
          $facet: {
            totalUrls: [{ $count: "count" }],
            totalClicks: [
              { $group: { _id: null, total: { $sum: "$totalClicks" } } },
            ],
            uniqueUsers: [
              { $unwind: "$uniqueUsers" },
              {
                $group: {
                  _id: {
                    ipAddress: "$uniqueUsers.ipAddress",
                    userAgent: "$uniqueUsers.userAgent",
                  },
                },
              },
              { $count: "count" },
            ],
            clicksByDate: [
              { $unwind: "$clicksByDate" },
              {
                $group: {
                  _id: "$clicksByDate.date",
                  total: { $sum: "$clicksByDate.clickCount" },
                },
              },
              { $sort: { _id: 1 } },
            ],
          },
        },
        {
          $project: {
            totalUrls: { $arrayElemAt: ["$totalUrls.count", 0] },
            totalClicks: { $arrayElemAt: ["$totalClicks.total", 0] },
            uniqueClicks: { $arrayElemAt: ["$uniqueUsers.count", 0] }, // Updated uniqueClicks
            clicksByDate: "$clicksByDate",
          },
        },
      ]),
    ]);

    const response = {
      totalUrls: clicks[0].totalUrls,
      totalClicks: clicks[0].totalClicks,
      uniqueClicks: clicks[0].uniqueClicks,
      clicksByDate: clicks[0].clicksByDate,
      osType: osType,
      deviceType: deviceType,
    };

    return res.status(200).json({ data: response });
  } catch (error) {
    console.error("Error in analytics:", error);
    return res
      .status(500)
      .json({ success: false, error: "Error processing the request." });
  }
};

module.exports = { overAllAnalytics };
