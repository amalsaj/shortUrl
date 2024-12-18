const Url = require("../models/url");
const User = require("../models/user");

const getAnalyticsByTopic = async (req, res) => {
  try {
    const { topic } = req.params;

    const currentUser = req.user;
    const user = await User.findById(currentUser._id);

    if (!user) {
      return res.status(401).json({ success: false, error: "User not found." });
    }

    const urls = await Url.find({ topic, userId: currentUser._id.toString() });

    if (!urls || urls.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No URLs found under the topic: ${topic}`,
      });
    }

    const allUniqueUsers = urls
      .flatMap((url) => url.uniqueUsers)
      .reduce((acc, user) => {
        const uniqueKey = `${user.ipAddress}-${user.userAgent}`;
        if (!acc.has(uniqueKey)) {
          acc.set(uniqueKey, user);
        }
        return acc;
      }, new Map());

    const uniqueClicks = allUniqueUsers.size;

    const result = await Url.aggregate([
      { $match: { topic, userId: currentUser._id.toString() } },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: "$totalClicks" },
          clicksByDate: { $push: "$clicksByDate" },
          urls: {
            $push: {
              shortUrl: "$shortUrl",
              totalClicks: "$totalClicks",
              uniqueClicks: "$uniqueClicks",
            },
          },
        },
      },
      {
        $project: {
          totalClicks: 1,
          clicksByDate: {
            $reduce: {
              input: { $concatArrays: "$clicksByDate" },
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
          urls: 1,
        },
      },
      {
        $unwind: "$clicksByDate",
      },
      {
        $group: {
          _id: "$clicksByDate.date",
          clickCount: { $sum: "$clicksByDate.clickCount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: "$_id",
          clickCount: 1,
          _id: 0,
        },
      },
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No click data found for topic: ${topic}`,
      });
    }

    const aggregatedData = result;

    return res.status(200).json({
      data: {
        totalClicks:
          result.length > 0
            ? result.reduce((acc, item) => acc + item.clickCount, 0)
            : 0,
        uniqueClicks,
        clicksByDate: aggregatedData,
        urls: urls.map((url) => ({
          shortUrl: url.shortUrl,
          totalClicks: url.totalClicks,
          uniqueClicks: url.uniqueClicks,
        })),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Error processing the request.",
    });
  }
};

module.exports = { getAnalyticsByTopic };
