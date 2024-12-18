const router = require("express").Router();
const authMiddleware = require("../utils/auth");
const { createShortUrl } = require("../controller/createShortUrl");
const { redirectUrl } = require("../controller/redirectUrl");
const { urlCreationLimiter } = require("../utils/rateLimiter");

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a new short URL
 *     description: Generates a shortened URL based on a long URL provided by the user. Optional custom alias and topic can be provided.
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 description: The original URL to be shortened.
 *                 example: "https://www.google.com"
 *               customAlias:
 *                 type: string
 *                 description: An optional custom alias for the shortened URL. If not provided, a unique alias will be generated.
 *                 example: "mycustomalias"
 *               topic:
 *                 type: string
 *                 description: An optional category under which the short URL is grouped (e.g., acquisition, activation, retention).
 *                 example: "marketing"
 *     responses:
 *       201:
 *         description: Short URL created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The generated short URL.
 *                   example: "https://short.ly/mycustomalias"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp of the URL creation.
 *                   example: "2024-12-18T12:00:00Z"
 *       400:
 *         description: Invalid input or URL.
 *       401:
 *         description: Unauthorized. Invalid or missing authentication token.
 *       429:
 *         description: Rate limit exceeded. Too many requests in a given time frame.
 *       500:
 *         description: Server error.
 */
router.route("/shorten").post(authMiddleware, urlCreationLimiter, createShortUrl);
module.exports = router;
