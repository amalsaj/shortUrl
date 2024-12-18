
const rateLimit = require("express-rate-limit");

const urlCreationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message:
    "Too many URL creation requests, please try again later.",
});

const analyticsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: "Too many analytics requests, please try again later.",
});

module.exports = {
  urlCreationLimiter,
  analyticsLimiter,
};
