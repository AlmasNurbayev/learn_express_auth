import { ToastOptions } from 'react-toastify';

export const backUrl = process.env.BACK_URL;
export const loginUrl = process.env.BACK_URL + '/auth/login';
export const registerUrl = process.env.BACK_URL + '/auth/register';
export const requestConfirmUrl = process.env.BACK_URL + '/auth/send_confirm';
export const sendConfirmUrl = process.env.BACK_URL + '/auth/confirm';
export const getMeUrl = process.env.BACK_URL + '/user/me';
export const GOOGLE_AUTH_CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID;
export const GOOGLE_AUTH_CLIENT_SECRET = process.env.GOOGLE_AUTH_CLIENT_SECRET;
export const GOOGLE_AUTH_URI = process.env.GOOGLE_AUTH_URI;
export const GOOGLE_AUTH_TOKEN = process.env.GOOGLE_AUTH_TOKEN;

export const toastDefaultConfig: ToastOptions = {
  position: 'top-center',
  autoClose: 4000,
  hideProgressBar: true,
};
