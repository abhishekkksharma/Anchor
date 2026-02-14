const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  let token;

  //check for token in header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  //check for toekn in body
  if (!token && req.body && req.body.token) {
    token = req.body.token;
  }
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch(error) {
    // console.log(error);  
    
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
