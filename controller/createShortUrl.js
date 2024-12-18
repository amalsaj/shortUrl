// controllers/urlController.js
const shortid = require("shortid");
const validUrl = require("valid-url");
const Url = require("../models/url");
const User = require("../models/user");
const {redisClient} = require("../config/redis");

const createShortUrl = async (req, res) => {
  const { longUrl, customAlias, topic } = req.body;
  const base = process.env.BASE;


  if (!longUrl || !validUrl.isUri(longUrl)) {
    return res.status(400).json({
      success: false,
      error: longUrl ? "Invalid URL." : "longUrl is required.",
    });
  }

  const alias = customAlias || shortid.generate();
  const shortUrl = `${base}/${alias}`;

  try {
    const currentUser = req.user;
    const user = await User.findById(currentUser._id);
    if (!user) {
      return res.status(401).json({ success: false, error: "User not found." });
    }

    const existingAlias = await Url.findOne({
      customAlias: alias,
      userId: currentUser._id,
    });

    if (existingAlias) {
      return res.status(400).json({
        success: false,
        error: "Custom alias already in use.",
      });
    }

    const cachedAlias = await redisClient.get(`shorturl:${alias}`);
    if (cachedAlias) {
      return res.status(400).json({
        success: false,
        error: "Custom alias already stored in catche.",
      });
    }


    const newUrl = new Url({
      userId: user._id,
      longUrl,
      shortUrl,
      customAlias: alias,
      topic: topic || null,
    });

    await newUrl.save();

    await redisClient.set(`shorturl:${alias}`, longUrl, { EX: 3600 });

    return res.status(201).json({
      success: true,
      message: "Short URL created successfully.",
      shortUrl: newUrl.shortUrl,
      createdAt: newUrl.createdAt,
    });

  } catch (error) {
    console.error("Error creating short URL:", error);
    return res.status(500).json({
      success: false,
      error: "An error occurred while processing your request.",
    });
  }
};

module.exports = { createShortUrl };
