const { signUp, login } = require("../controller/authController");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

/**
 * @swagger
 * /api/auth/signUp:
 *   post:
 *     summary: User sign-up
 *     description: Allows a user to create an account by providing required information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Successfully created user.
 *       400:
 *         description: Bad request, validation failed.
 */
router.route("/signUp").post(signUp);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Allows a user to log in by providing valid credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successfully logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64e4b7d3..."
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *       401:
 *         description: Unauthorized, invalid credentials.
 */
router.route("/login").post(login);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Google authentication
 *     description: Redirects the user to authenticate using Google.
 *     responses:
 *       302:
 *         description: Redirect to Google authentication page.
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google callback
 *     description: Handles the callback from Google after authentication.
 *     responses:
 *       200:
 *         description: Successfully authenticated, returns a token and user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64e4b7d3..."
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *       302:
 *         description: Redirect on failure.
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, user });
  }
);

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: User logout
 *     description: Logs out the user and redirects to the home page.
 *     responses:
 *       302:
 *         description: Redirect to home after logout.
 */
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
