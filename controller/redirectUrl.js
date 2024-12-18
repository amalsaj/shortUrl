const useragent = require("useragent");
const Url = require("../models/url");
const { redisClient } = require("../config/redis");

const redirectUrl = async (req, res) => {
  try {
    const { customAlias } = req.params;
    const userAgentString = req.headers["user-agent"] || "Unknown";
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || "Unknown";
    const agent = useragent.parse(userAgentString);
    const osName = agent.os.family || "Unknown OS";
    const deviceType = /Mobile|Android|iPhone|iPad/.test(userAgentString)
      ? "mobile"
      : "desktop";

    const urlDocument = await Url.findOne({ customAlias });

    if (!urlDocument) {
      return res
        .status(404)
        .json({ success: false, error: "Short URL not found." });
    }

    urlDocument.totalClicks += 1;
    const uniqueUser = urlDocument.uniqueUsers.some(
      (user) =>
        user.ipAddress === ipAddress && user.userAgent === userAgentString
    );

    if (!uniqueUser) {
      urlDocument.uniqueClicks += 1;
      urlDocument.uniqueUsers.push({ ipAddress, userAgent: userAgentString });
    }

    const currentDate = new Date();
    const existingClick = urlDocument.clicksByDate.find(
      (click) => click.date.toDateString() === currentDate.toDateString()
    );
    if (existingClick) {
      existingClick.clickCount += 1;
    } else {
      urlDocument.clicksByDate.push({ date: currentDate, clickCount: 1 });
    }

    // Handle OS tracking with unique users
    let os = urlDocument.osType.find((entry) => entry.osName === osName);
    if (!os) {
      os = { osName, uniqueClicks: 1, uniqueUsers: 1, users: [{ ipAddress, userAgent: userAgentString }] };
      urlDocument.osType.push(os);
    } else {
      os.uniqueClicks += uniqueUser ? 0 : 1;
      os.uniqueUsers += uniqueUser ? 0 : 1;
      if (!uniqueUser) {
        os.users.push({ ipAddress, userAgent: userAgentString });
      }
    }

    // Handle Device tracking with unique users
    let device = urlDocument.deviceType.find(
      (entry) => entry.deviceName === deviceType
    );
    if (!device) {
      device = { deviceName: deviceType, uniqueClicks: 1, uniqueUsers: 1, users: [{ ipAddress, userAgent: userAgentString }] };
      urlDocument.deviceType.push(device);
    } else {
      device.uniqueClicks += uniqueUser ? 0 : 1;
      device.uniqueUsers += uniqueUser ? 0 : 1;
      if (!uniqueUser) {
        device.users.push({ ipAddress, userAgent: userAgentString });
      }
    }

    await urlDocument.save();

    const cachedUrl = await redisClient.get(`shorturl:${customAlias}`);
    if (cachedUrl) {
      console.log(`Redirecting to cached URL: ${cachedUrl}`);
      return res.redirect(cachedUrl);
    }

    redisClient.setEx(`shorturl:${customAlias}`, 3600, urlDocument.longUrl);
    return res.redirect(urlDocument.longUrl);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Error processing the request." });
  }
};


module.exports = { redirectUrl };
