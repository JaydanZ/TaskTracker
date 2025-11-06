export const config = {
  jwtSecret: process.env.JWT_SECRET || '6bc6cd1e22ac812f4d3cc481b22fecee',
  jwtExpiresIn: '3d',
  port: process.env.PORT || 3001,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}
