import { ToastOptions } from 'react-toastify';

export const backUrl = process.env.BACK_URL;
export const loginUrl = process.env.BACK_URL + '/auth/login';
export const registerUrl = process.env.BACK_URL + '/auth/register';
export const requestConfirmUrl = process.env.BACK_URL + '/auth/send_confirm';
export const sendConfirmUrl = process.env.BACK_URL + '/auth/confirm';
export const getMeUrl = process.env.BACK_URL + '/user/me';
export const googleLoginUrl = process.env.BACK_URL + '/oauth/google';
export const vkLoginUrl = process.env.BACK_URL + '/oauth/vk';
export const yandexLoginUrl = process.env.BACK_URL + '/oauth/yandex';

export const toastDefaultConfig: ToastOptions = {
  position: 'top-center',
  autoClose: 4000,
  hideProgressBar: true,
};
