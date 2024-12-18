const url = require("../models/url");
const User = require("../models/user");

const getAnalytics = async (req, res) => {
  try {
    const { customAlias } = req.params;

    const currentUser = req.user;
    const user = await User.findById(currentUser._id);

    if (!user) {
      return res.status(401).json({ success: false, error: "User not found." });
    }

    const urlDocument = await url.findOne({
      customAlias,
      userId: currentUser._id.toString(),
    });
    
    if (!urlDocument) {
      return res
        .status(404)
        .json({ success: false, error: "Short URL not found." });
    }

    const today = new Date();
    const last7Days = urlDocument.clicksByDate.filter((click) => {
      const clickDate = new Date(click.date);
      return (
        today.getDate() - clickDate.getDate() <= 7 &&
        today.getMonth() === clickDate.getMonth() &&
        today.getFullYear() === clickDate.getFullYear()
      );
    });

    const analyticsData = {
      totalClicks: urlDocument.totalClicks,
      uniqueClicks: urlDocument.uniqueClicks,
      clicksByDate: last7Days,
      osType: urlDocument.osType,
      deviceType: urlDocument.deviceType,
    };

    return res.status(200).json({
      analyticsData,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Error retrieving analytics data." });
  }
};

module.exports = { getAnalytics };
