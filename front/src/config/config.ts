import { ToastOptions } from "react-toastify";

export const loginUrl = process.env.BACK_URL + '/auth/login';
export const registerUrl = process.env.BACK_URL + '/auth/register';
export const requestConfirmUrl = process.env.BACK_URL + '/auth/send_confirm';
export const sendConfirmUrl = process.env.BACK_URL + '/auth/confirm';
export const getMeUrl = process.env.BACK_URL + '/user/me';

export const toastDefaultConfig: ToastOptions = {
  position: 'top-center',
  autoClose: 4000,
  hideProgressBar: true,
};