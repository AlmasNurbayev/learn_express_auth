import './auth.css';
import {
  apiAuthLogin,
  apiAuthRegister,
  apiAuthRequestConfirm,
} from '../api/api.auth';
import { deleteUndefinedEmptyKeys, parseZodErrors } from '../common/utils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  RegisterRequest,
  loginRequest,
  loginTypeEnum,
} from '../interfaces/login.';
import { toastDefaultConfig } from '../config/config';
import { useState } from 'react';
import ConfirmForm from '../components/Auth/ConfirmForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/useAuth';
import Input from '../components/Input/Input';
import { FormError } from '../common/interfaces';
import Oauth from '../components/Auth/Oauth';

export default function AuthPage() {
  const [errors, setErrors] = useState<FormError[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [type, setType] = useState<loginTypeEnum>();
  const [sharedDataRegister, setSharedDataRegister] =
    useState<RegisterRequest>();
  const { setUser, setAccessToken } = useAuth();
  const navigate = useNavigate();

  // для передачи значения сюда из ConfirmForm
  const changeConfirm = async (value: boolean) => {
    setShowConfirm(value);
    if (!value) {
      console.log('changeConfirm 1');
      // если из формы конфирма вернулось ее скрытие, то пробуем заново зарегистрироваться
      if (sharedDataRegister) {
        await registerHandler(sharedDataRegister);
        await loginHandler(sharedDataRegister);
      }
    }
  };

  async function requestConfirmRegister(address: string, type: loginTypeEnum) {
    //setisDisableReply(false);
    return await apiAuthRequestConfirm(address, type);
  }

  async function loginHandler(data: loginRequest) {
    setErrors([]);
    const resultLogin = await apiAuthLogin(data);
    if (resultLogin?.status === 200) {
      //await login(resultLogin.data.data, resultLogin.data.accessToken);
      setUser(resultLogin.data.data);
      setAccessToken(resultLogin.data.accessToken);
      toast.success(
        `Добро пожаловать ${resultLogin.data.data.name}`,
        toastDefaultConfig
      );
      navigate('/');
    }
    if (resultLogin?.status !== 200) {
      if (resultLogin?.data.error) {
        toast.error(resultLogin?.data.error, toastDefaultConfig);
        return;
      }
      if (resultLogin?.data?.issues) {
        setErrors((prev) => [...prev, ...parseZodErrors(resultLogin)]);
      }
    }
  }

  async function registerHandler(data: RegisterRequest) {
    const result = await apiAuthRegister(data);
    setErrors([]);
    if (result?.status === 200) {
      toast.success(
        'Регистрация прошла успешно, производится вход',
        toastDefaultConfig
      );
      setShowConfirm(false);
      await loginHandler(data);
      return;
    }
    if (result?.status !== 200) {
      if (result?.data?.error?.includes('not confirmed')) {
        toast.warning(
          'На указанный email или телефон отправляется код подтверждения',
          toastDefaultConfig
        );
        setSharedDataRegister(data);
        if (data.email) {
          const resultConfirm = await requestConfirmRegister(
            data.email,
            loginTypeEnum.email
          );
          //startCountdown();
          //setisDisableReply(true);
          if (resultConfirm.data.transport?.email === 'success') {
            setAddress(data.email);
            setType(loginTypeEnum.email);
            setShowConfirm(true);
          } else {
            toast.error(
              'Не удалось отправить подтверждение на email ' + data.email,
              toastDefaultConfig
            );
          }
        } else if (data.phone) {
          const resultConfirm = await requestConfirmRegister(
            data.phone,
            loginTypeEnum.phone
          );
          if (resultConfirm.data.transport?.phone === 'success') {
            setAddress(data.phone);
            setType(loginTypeEnum.phone);
            setShowConfirm(true);
          } else {
            toast.error(
              'Не удалось отправить подтверждение на телефон ' + data.phone,
              toastDefaultConfig
            );
          }
        }
      }
      if (result?.data?.issues) {
        setErrors((prev) => [...prev, ...parseZodErrors(result)]);
      }
      console.log('resultRegister', result);
    }
  }

  async function loginRegisterHandler(
    event: React.FormEvent<HTMLFormElement>,
    mode: string
  ) {
    event.preventDefault();
    const data = deleteUndefinedEmptyKeys({
      email: event.currentTarget.email.value,
      phone: event.currentTarget.phone.value,
      password: event.currentTarget.password.value,
      name: event.currentTarget.name?.value
        ? event.currentTarget.name.value
        : undefined,
    });
    if (data.phone) {
      // оставляем только цифры
      data.phone = data.phone.replaceAll(/[\D]/g, '');
    }

    if (mode === 'login') {
      await loginHandler(data);
    }
    if (mode === 'register') {
      await registerHandler(data);
      event.currentTarget.reset();
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="main_container">
        <div className="tab-nav">
          <a className="tab-link" href="#login">
            Вход
          </a>
          <a className="tab-link" href="#register">
            Регистрация
          </a>
        </div>
        <div className="auth_container">
          <form
            className="form_container tab-none"
            id="login"
            onSubmit={(e) => loginRegisterHandler(e, 'login')}
          >
            <span className="form_title">Вход</span>
            <Input
              type="email"
              placeholder="почтовый адрес"
              name="email"
              error={errors}
              mainfontsize={16}
              secondfontsize={12}
            />
            <Input
              type="tel"
              placeholder="7 000 0000000"
              name="phone"
              label="номер телефона"
              error={errors}
              mainfontsize={16}
              secondfontsize={12}
            />
            <Input
              type="password"
              placeholder="пароль"
              name="password"
              error={errors}
              mainfontsize={16}
              secondfontsize={12}
              required
            />
            <button className="button" type="submit">
              Войти
            </button>
            <span>или</span>
            <Oauth />
          </form>

          <form
            className="form_container tab-none"
            id="register"
            onSubmit={(e) => loginRegisterHandler(e, 'register')}
          >
            <span className="form_title">Регистрация</span>
            <Input
              type="text"
              placeholder="имя"
              name="name"
              mainfontsize={16}
              secondfontsize={12}
              error={errors}
              required
            />
            <Input
              type="email"
              placeholder="почтовый адрес"
              name="email"
              mainfontsize={16}
              secondfontsize={12}
              error={errors}
            />
            или
            <Input
              type="text"
              placeholder="7 000 0000000"
              label="телефон"
              name="phone"
              mainfontsize={16}
              secondfontsize={12}
              error={errors}
            />
            <Input
              type="password"
              placeholder="пароль"
              name="password"
              mainfontsize={16}
              secondfontsize={12}
              required
              error={errors}
            />
            <button className="button" type="submit">
              Зарегистрироваться
            </button>
          </form>
        </div>
        <div className="confirm_container">
          {showConfirm && type ? (
            <ConfirmForm
              changeConfirm={changeConfirm}
              address={address}
              type={type}
            />
          ) : (
            ''
          )}
        </div>
      </div>

      {/* <div className='confirm_container' ></div> */}
    </>
  );
}
