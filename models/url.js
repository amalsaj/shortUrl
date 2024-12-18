const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    customAlias: { type: String, unique: true },
    topic: { type: String },
    totalClicks: { type: Number, default: 0 },
    uniqueClicks: { type: Number, default: 0 },
    clicksByDate: [
      {
        date: { type: Date },
        clickCount: { type: Number, default: 0 },
      },
    ],
    osType: [
      {
        osName: { type: String },
        uniqueClicks: { type: Number, default: 0 },
        uniqueUsers: { type: Number, default: 0 },
        users: [
          {
            ipAddress: { type: String, required: true },
            userAgent: { type: String, required: true },
          },
        ],
      },
    ],
    deviceType: [
      {
        deviceName: { type: String },
        uniqueClicks: { type: Number, default: 0 },
        uniqueUsers: { type: Number, default: 0 },
        users: [
          {
            ipAddress: { type: String, required: true },
            userAgent: { type: String, required: true },
          },
        ],
      },
    ],
    uniqueUsers: [
      {
        ipAddress: { type: String, required: true },
        userAgent: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const url = mongoose.model("shortUrl", urlSchema);

module.exports = url;
