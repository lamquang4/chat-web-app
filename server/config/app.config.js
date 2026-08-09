module.exports = {
  port: process.env.PORT || 3000,

  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI,
  },

  // MySQL
  mysql: {
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT) || 10,
  },

  // Nodemailer
  nodemailer: {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_SECURE === "true",
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  },

  // JWT
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || "7d",
    sessionExpiration: process.env.SESSION_EXPIRATION || "7d",
  },

  // Bcrypt
  bcryptSaltRounds: 10,

  secret: {
    otpHashSecret: process.env.OTP_HASH_SECRET,
    refreshTokenHashSecret: process.env.REFRESH_TOKEN_HASH_SECRET,
  },

  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  // CORS
  cors: {
    allowedOrigins: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://chat-web-app-1rj9.onrender.com",
    ],
  },
};
