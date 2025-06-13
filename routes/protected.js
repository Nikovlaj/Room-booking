const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

router.get("/protected", auth, (req, res) => {
  res.json({
    message: "du har åtkomst till en skyddad rutt",
    user: req.user,
  });
});

module.exports = router;
