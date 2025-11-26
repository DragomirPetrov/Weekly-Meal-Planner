/**
 * User type from Supabase Auth
 * @typedef {Object} User
 * @property {string} id - User UUID
 * @property {string} email - User email
 * @property {string} created_at - Creation timestamp
 */

/**
 * Session type from Supabase Auth
 * @typedef {Object} Session
 * @property {User} user - User object
 * @property {string} access_token - JWT access token
 * @property {string} refresh_token - Refresh token
 */

export const AuthTypes = {};
