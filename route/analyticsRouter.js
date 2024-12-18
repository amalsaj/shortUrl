const router = require("express").Router();
const authMiddleware = require("../utils/auth");
const { overAllAnalytics } = require("../controller/overallAnalytics");
const { getAnalytics } = require("../controller/analyticsController");
const { getAnalyticsByTopic } = require("../controller/topicAnalytics");
const { analyticsLimiter } = require("../utils/rateLimiter");

/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics
 *     description: Retrieve overall analytics for all short URLs created by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved overall analytics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUrls:
 *                       type: number
 *                       example: 2
 *                     totalClicks:
 *                       type: number
 *                       example: 6
 *                     uniqueClicks:
 *                       type: number
 *                       example: 4
 *                     clicksByDate:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "2024-12-17T14:38:21.521Z"
 *                           total:
 *                             type: number
 *                             example: 2
 *                     osType:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "Windows"
 *                           uniqueClicks:
 *                             type: number
 *                             example: 2
 *                           osName:
 *                             type: string
 *                             example: "Windows"
 *                           uniqueUsers:
 *                             type: number
 *                             example: 1
 *                     deviceType:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "desktop"
 *                           uniqueClicks:
 *                             type: number
 *                             example: 3
 *                           deviceName:
 *                             type: string
 *                             example: "desktop"
 *                           uniqueUsers:
 *                             type: number
 *                             example: 2
 */

router
  .route("/overall")
  .get(authMiddleware, analyticsLimiter, overAllAnalytics);

/**
 * @swagger
 * /api/analytics/{customAlias}:
 *   get:
 *     summary: Get analytics by alias
 *     description: Retrieve detailed analytics for a specific short URL.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: customAlias
 *         in: path
 *         required: true
 *         description: The custom alias for the short URL.
 *         schema:
 *           type: string
 *           example: "myAlias123"
 *     responses:
 *       200:
 *         description: Successfully retrieved analytics for the short URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 analyticsData:
 *                   type: object
 *                   properties:
 *                     totalClicks:
 *                       type: number
 *                       example: 5
 *                     uniqueClicks:
 *                       type: number
 *                       example: 4
 *                     clicksByDate:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             example: "2024-12-17T14:38:21.521Z"
 *                           clickCount:
 *                             type: number
 *                             example: 2
 *                     osType:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           osName:
 *                             type: string
 *                             example: "Windows"
 *                           uniqueClicks:
 *                             type: number
 *                             example: 1
 *                           uniqueUsers:
 *                             type: number
 *                             example: 1
 *                           users:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 ipAddress:
 *                                   type: string
 *                                   example: "::1"
 *                                 userAgent:
 *                                   type: string
 *                                   example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
 *                                 _id:
 *                                   type: string
 *                                   example: "67618cdd817439984916f4b1"
 *                     deviceType:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           deviceName:
 *                             type: string
 *                             example: "desktop"
 *                           uniqueClicks:
 *                             type: number
 *                             example: 2
 *                           uniqueUsers:
 *                             type: number
 *                             example: 2
 *                           users:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 ipAddress:
 *                                   type: string
 *                                   example: "::1"
 *                                 userAgent:
 *                                   type: string
 *                                   example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
 *                                 _id:
 *                                   type: string
 *                                   example: "67618cdd817439984916f4b3"
 */

router
  .route("/:customAlias")
  .get(authMiddleware, analyticsLimiter, getAnalytics);

/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get analytics by topic
 *     description: Retrieve analytics for all short URLs grouped under a specific topic.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: topic
 *         in: path
 *         required: true
 *         description: The topic name for the analytics.
 *         schema:
 *           type: string
 *           example: "marketing"
 *     responses:
 *       200:
 *         description: Successfully retrieved topic-based analytics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalClicks:
 *                       type: number
 *                       example: 6
 *                     uniqueClicks:
 *                       type: number
 *                       example: 4
 *                     clicksByDate:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           clickCount:
 *                             type: number
 *                             example: 2
 *                           date:
 *                             type: string
 *                             example: "2024-12-17T14:38:21.521Z"
 *                     urls:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           shortUrl:
 *                             type: string
 *                             example: "http://localhost:5000/custom"
 *                           totalClicks:
 *                             type: number
 *                             example: 5
 *                           uniqueClicks:
 *                             type: number
 *                             example: 4
 */

router
  .route("/topic/:topic")
  .get(authMiddleware, analyticsLimiter, getAnalyticsByTopic);

module.exports = router;
