import jwt from 'jsonwebtoken';

export const signAccessToken = (user: any) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '15m' });
};

export const signRefreshToken = (user: any) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};
