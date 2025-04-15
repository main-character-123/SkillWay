
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
   const token = req.header('Authorization')?.replace('Bearer ', '');
   if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
   } catch (err) {
      res.status(401).json({ error: 'Token is not valid' });
   }
};

const allowedTo = (...roles) => {
   return (req, res, next) => {
      if (!req.user || !req.user.role) {
         return res.status(403).json({ error: 'no User Role Found' });
      }
      if (!roles.includes(req.user.role)) {
         return res.status(403).json({ error: `Forbidden , To acess This route you must be ${[roles]} not ${req.user.role}` });
      }

      next();
   }
}


module.exports = { authMiddleware, allowedTo };