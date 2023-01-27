import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import * as validate from '../util/validation/authValidations.js';
import { pool } from '../config/connectDb.js';
import { userQueries } from '../database/queries/userQueries.js';
import { sendEmail } from '../util/sebdEmail.js';
import { replaceChar } from '../util/replace.js';

// @desc register user
// @route POST /auth/register
// @access Private
export const register = asyncHandler(async (req, res) => {
  const { fname, lname, email, password } = req.body;

  const { isValid, errors } = await validate.register(req.body);

  if (!isValid) {
    res.status(422).json(errors);
  }

  const existingUser = await pool.query(userQueries.getByEmail, [email]);

  if (existingUser.rowCount > 0) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const data = await pool.query(userQueries.create, [fname, lname, email, hashPassword]);

  const user = data.rows[0];

  if (data.rowCount === 0) {
    return res.status(400).json({ message: 'could not register user, try again later' });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } //15m
  );
  const confiramtionLink = `${process.env.CLIENT_URL}/confirm-email/${user.id}/${replaceChar(
    token,
    '.',
    '@'
  )}`;
  //http://localhost:5173/confirm-email/23/tgdgd5545sdf94s1g1sg9sg19sg

  const { sent } = await sendEmail(user.email, 'Email confirmation', confiramtionLink);

  if (!sent) return res.status(400).json({ message: 'could not send confirmation email ' });

  res.json(user);
});

// @desc login user
// @route POST /auth/login
// @access Private
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { isValid, errors } = await validate.login(req.body);

  if (!isValid) {
    res.status(422).json(errors);
  }

  const data = await pool.query(userQueries.getByEmail, [email]);

  if (data.rowCount === 0) {
    return res.status(400).json({ message: 'Wrong email or password' });
  }

  const existingUser = data.rows[0];

  if (!(await bcrypt.compare(password, existingUser.password))) {
    return res.status(400).json({ message: 'Wrong email or password' });
  }

  if (!existingUser.confirmed) {
    return res.status(400).json({ message: 'Confirm your email address before continuing' });
  }

  const token = jwt.sign(
    {
      id: existingUser.id,
      fname: existingUser.fname,
      lname: existingUser.lname,
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  res.json({ token });
});

// @desc email confirmation
// @route GET /auth/confirm-email
// @access Private
export const confirmEmail = asyncHandler(async (req, res) => {
  const { id, token } = req.params;

  try {
    const data = await pool.query(userQueries.getById, [id]);
    if (data.rowCount === 0) throw new Error();
  } catch (error) {
    return res.status(400).json({ message: 'User Not Found' });
  }

  try {
    const verify = jwt.verify(replaceChar(token, '@', '.'), process.env.JWT_SECRET);
    const updated = await pool.query(userQueries.updateConfirmed, [verify.id, verify.email]);
    if (updated.rowCount === 0) throw new Error();
    res.status(200).json({ message: 'Email Verified Successfully' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Failed to Verify Email' });
  }
});

// @desc forgot password
// @route POST /auth/forgot-password
// @access Private
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const { isValid, errors } = await validate.forgotPassword(req.body);

  if (!isValid) {
    res.status(422).json(errors);
  }

  const data = await pool.query(userQueries.getByEmail, [email]);

  if (data.rowCount === 0) {
    return res.status(400).json({ message: 'Wrong email' });
  }

  const user = data.rows[0];

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } //15m
  );

  const confiramtionLink = `${process.env.CLIENT_URL}/update-password/${user.id}/${replaceChar(
    token,
    '.',
    '@'
  )}`;
  //http://localhost:5173/update-password/45/tgdgd5545sdf94s1g1sg9sg19sg5g

  const { sent } = await sendEmail(user.email, 'Reset Password', confiramtionLink);

  if (!sent) return res.status(400).json({ message: 'could not send confirmation email ' });

  res.json({ message: 'Check your email to reset your password' });
});

// @desc check forgot password token & id
// @route POST /auth/forgot-password-check/:id/:token
// @access Private
export const checkForgotPassword = asyncHandler(async (req, res) => {
  const { id, token } = req.params;

  try {
    const data = await pool.query(userQueries.getById, [id]);
    if (data.rowCount === 0) throw new Error();
  } catch (error) {
    return res.status(400).json({ message: 'User Not Found' });
  }

  try {
    const verify = jwt.verify(replaceChar(token, '@', '.'), process.env.JWT_SECRET);
    const updated = await pool.query(userQueries.updateConfirmed, [verify.id, verify.email]);
    if (updated.rowCount === 0) throw new Error();
    res.status(200).json({ verified: true });
  } catch (error) {
    res.status(400).json({ message: 'Failed to Reset Password' });
  }
});
//'Check your email to reset your password'

// @desc update password
// @route PUT /update-password
// @access Private
export const updatePassword = asyncHandler(async (req, res) => {
  const { id, password } = req.body;

  const { isValid, errors } = await validate.updatePassword(req.body);

  if (!isValid) {
    res.status(422).json(errors);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const data = await pool.query(userQueries.updatePassword, [hashPassword, id]);

  if (data.rowCount === 0) {
    return res.status(400).json({ message: 'Could not update password try again' });
  }

  res.json({ message: 'Password updated successfully' });
});
