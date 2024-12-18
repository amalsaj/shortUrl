const router = require("express").Router();
const { redirectUrl } = require("../controller/redirectUrl");

/**
 * @swagger
 * /{customAlias}:
 *   get:
 *     summary: Redirect to the original URL
 *     description: Redirects to the original URL associated with the given custom alias.
 *     parameters:
 *       - in: path
 *         name: customAlias
 *         required: true
 *         description: The custom alias for the URL.
 *         schema:
 *           type: string
 *           example: "short123"
 *     responses:
 *       302:
 *         description: Redirects to the original URL.
 *       404:
 *         description: Custom alias not found.
 *       500:
 *         description: Server error.
 */
router.route("/:customAlias").get(redirectUrl);

module.exports = router;
