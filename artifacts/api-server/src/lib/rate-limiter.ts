import rateLimit from "express-rate-limit";

// Strict limiter for public form endpoints: 10 submissions per hour
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions, please try again in an hour." },
});
