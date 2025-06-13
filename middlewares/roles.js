module.exports = function (requiredRole) {
  return function (req, res, next) {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "ingen användare inloggad" });
    }
    if (req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: "Åtkomst nekad - otillräcklig behörighet" });
    }
    next();
  };
};
