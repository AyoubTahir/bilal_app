import yup from 'yup';
import { validate } from './validation.js';

const registerSchema = yup.object().shape({
  fname: yup.string().required().min(3).max(50),
  lname: yup.string().required().min(3).max(50),
  email: yup.string().required().email().max(100),
  password: yup.string().required().max(100),
});

export const register = async (body) => await validate(registerSchema, body);

const loginSchema = yup.object().shape({
  email: yup.string().required().email().max(100),
  password: yup.string().required().max(100),
});

export const login = async (body) => await validate(loginSchema, body);

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().required().email().max(100),
});

export const forgotPassword = async (body) => await validate(forgotPasswordSchema, body);

const updatePasswordSchema = yup.object().shape({
  password: yup.string().required().max(100),
  cpassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Your passwords do not match.'),
});

export const updatePassword = async (body) => await validate(updatePasswordSchema, body);
