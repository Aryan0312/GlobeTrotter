import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../../config/db";
import { createSession } from "../../services/authService";

export async function handleUserLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    /* ---------- validation ---------- */
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    /* ---------- fetch user ---------- */
    const userQuery = `
      SELECT id, email, password_hash
      FROM users
      WHERE email = $1
    `;

    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = userResult.rows[0];

    /* ---------- password check ---------- */
    const isValidPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
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
      roles
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

