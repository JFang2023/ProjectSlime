import jwt from 'jsonwebtoken';

const generateToken = (res, userId, saveCookie) => {
  let expiresIn = 'session'; // Default to session cookie

  if (saveCookie) {
    expiresIn = '30d'; // Set expiration to 30 days if user wants to save the cookie
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn,
  });

  // Set JWT as an HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: saveCookie ? 30 * 24 * 60 * 60 * 1000: 0, // If else save cookie
  });
};

export default generateToken;
