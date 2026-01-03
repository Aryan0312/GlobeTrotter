import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../../config/db";
import { createSession } from "../../services/authService";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { trimName, validateEmail, validatePhone, validateCity, validateCountry } from "../../utils/validators";

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - identifier
 *         - password
 *       properties:
 *         identifier:
 *           type: string
 *           description: Email or phone number
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           description: User password
 *           example: "password123"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Login successful"
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           example: ["USER"]
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - phone
 *         - password
 *       properties:
 *         first_name:
 *           type: string
 *           example: "John"
 *         last_name:
 *           type: string
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         password:
 *           type: string
 *           minLength: 6
 *           example: "password123"
 *         city:
 *           type: string
 *           example: "New York"
 *         country:
 *           type: string
 *           example: "USA"
 *         additionalInfo:
 *           type: string
 *           example: "Travel enthusiast"
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "User created successfully"
 *         user:
 *           $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email/phone and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid credentials or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const handleUserLogin = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  

  /* ---------- validation ---------- */
  if (!identifier || !password) {
    throw new ApiError(400, "Email/phone and password are required");
  }

  /* ---------- fetch user ---------- */
  const userQuery = `
    SELECT id, email, password_hash, first_name , last_name
    FROM users
    WHERE email = $1 OR phone = $1
  `;

  const userResult = await pool.query(userQuery, [identifier]);

  if (userResult.rowCount === 0) {
    throw new ApiError(400, "Invalid credentials");
  }
 
  const user = userResult.rows[0];

  /* ---------- password check ---------- */
  const isValidPassword = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!isValidPassword) {
    throw new ApiError(401, "Invalid credentials");
  }

  /* ---------- fetch roles ---------- */
  const roleQuery = `
    SELECT r.name
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = $1
  `;

  const roleResult = await pool.query(roleQuery, [user.id]);
  const roles = roleResult.rows.map(r => r.name);

  /* ---------- create session ---------- */
  createSession(
    {
      userId: user.id,
      email: user.email,
      roles
    },
    req
  );

  /* ---------- response ---------- */
  return res.status(200).json({
    success: true,
    message: "Login successful",
    first_name: user.first_name,
    last_name: user.last_name,
    roles
  });
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user with personal information
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Validation error or invalid input format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: User already exists with this email or phone
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const handleUserSignup = asyncHandler(async (req: Request, res: Response) => {
  const { first_name, last_name, email, phone, password, city, country, additionalInfo } = req.body;

  /* ---------- validation ---------- */
  if (!first_name || !last_name || !email || !phone || !password) {
    throw new ApiError(400, "First name, last name, email, phone, and password are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  /* ---------- validate and trim inputs ---------- */
  const trimmedFirstName = trimName(first_name);
  const trimmedLastName = trimName(last_name);
  
  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (!validatePhone(phone)) {
    throw new ApiError(400, "Invalid phone number format");
  }

  if (city && !validateCity(city)) {
    throw new ApiError(400, "Invalid city format");
  }

  if (country && !validateCountry(country)) {
    throw new ApiError(400, "Invalid country format");
  }

  /* ---------- check if user exists ---------- */
  const existingUserQuery = `SELECT id FROM users WHERE email = $1 OR phone = $2`;
  const existingUser = await pool.query(existingUserQuery, [email, phone]);

  if (existingUser.rowCount && existingUser.rowCount > 0) {
    throw new ApiError(409, "User already exists with this email or phone");
  }

  /* ---------- hash password ---------- */
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  /* ---------- create user ---------- */
  const insertUserQuery = `
    INSERT INTO users (first_name, last_name, email, phone, password_hash, city, country, additional_info)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, first_name, last_name, email, phone, city, country
  `;

  const userResult = await pool.query(insertUserQuery, [
    trimmedFirstName, trimmedLastName, email, phone, hashedPassword, city, country, additionalInfo
  ]);
  const newUser = userResult.rows[0];

  /* ---------- assign default role ---------- */
  const defaultRoleQuery = `SELECT id FROM roles WHERE name = 'USER'`;
  const roleResult = await pool.query(defaultRoleQuery);

  if (roleResult.rowCount && roleResult.rowCount > 0) {
    const roleId = roleResult.rows[0].id;
    const assignRoleQuery = `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`;
    await pool.query(assignRoleQuery, [newUser.id, roleId]);
  }

  /* ---------- response ---------- */
  return res.status(201).json({
    success: true,
    message: "User created successfully",
    user: newUser
  });
});

