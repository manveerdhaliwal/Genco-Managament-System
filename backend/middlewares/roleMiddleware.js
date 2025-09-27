// middleware to check user role
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied! Not authorized.",
      });
    }
    next();
  };
};

module.exports = checkRole;
