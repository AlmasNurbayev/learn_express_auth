import Header from '../components/Header';

import './auth.css';
import {
  apiAuthLogin,
  apiAuthRegister,
  apiAuthRequestConfirm,
} from '../api/api.auth';
import { deleteUndefinedEmptyKeys } from '../common/utils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  RegisterRequest,
  loginRequest,
  loginTypeEnum,
} from '../interfaces/login.';
import { toastDefaultConfig } from '../config/config';
import { useState } from 'react';
import { login } from '../common/AuthProvider';
import ConfirmForm from '../components/Auth/ConfirmForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/useAuth';

export default function Auth() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [type, setType] = useState<loginTypeEnum>();
  const [sharedDataRegister, setSharedDataRegister ] = useState<RegisterRequest>();
  const {setUser, setAccessToken}  = useAuth();
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
    const resultLogin = await apiAuthLogin(data);
    if (resultLogin?.status === 200) {
      //await login(resultLogin.data.data, resultLogin.data.accessToken);
      setUser(resultLogin.data.data);
      setAccessToken(resultLogin.data.accessToken);
      toast.success(`Добро пожаловать ${resultLogin.data.data.name}`, toastDefaultConfig);
      navigate('/');
    }
    if (resultLogin?.status !== 200) {
      if (resultLogin?.data.error === 'not correct login data') {
        toast.error('Неправильные учетные данные', toastDefaultConfig);
        return;
      }
      if (resultLogin?.data?.issues[0]?.path[1] === 'email') {
        toast.error('Некорректный email', toastDefaultConfig);
        return;
      }
    }
  }

  async function registerHandler(data: RegisterRequest) {
    const result = await apiAuthRegister(data);
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
      if (result?.data?.error?.includes('duplicate')) {
        toast.error('Email или телефон уже существуют', toastDefaultConfig);
        return;
      }
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
        result?.data?.issues.map((item: { path: string[] }) => {
          if (item.path[1] === 'password') {
            toast.error(
              'Пароль должен быть заполнен и не менее 8 символов',
              toastDefaultConfig
            );
          }
          if (item.path[1] === 'name') {
            toast.error('Имя должно быть заполнено', toastDefaultConfig);
          }
        });
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
      name: event.currentTarget.name_register?.value
        ? event.currentTarget.name_register.value
        : undefined,
    });
    //console.log(data);

    if (!data.email && !data.phone) {
      toast.error(
        'Введите либо почтовый адрес либо номер телефона',
        toastDefaultConfig
      );
      return;
    }
    if (data.email && data.phone) {
      toast.error(
        'Введите что-то одно: либо почтовый адрес либо номер телефона',
        toastDefaultConfig
      );
      return;
    }
    if (mode === 'login') {
      await loginHandler(data);
    }
    if (mode === 'register') {
      await registerHandler(data);
    }
  }

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="login_container">
        <div>
          <form onSubmit={(e) => loginRegisterHandler(e, 'login')}>
            Login
            <input type="text" placeholder="email" name="email" />
            <input type="text" placeholder="phone" name="phone" />
            <input type="text" placeholder="password" name="password" />
            <button className="button" type="submit">login</button>
          </form>
        </div>
        <div>
          <form onSubmit={(e) => loginRegisterHandler(e, 'register')}>
            Register
            <input type="text" placeholder="name" name="name_register" />
            <input type="text" placeholder="email" name="email" />
            <input type="text" placeholder="phone" name="phone" />
            <input type="text" placeholder="password" name="password" />
            <button className="button" type="submit">
              register
            </button>
          </form>
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
