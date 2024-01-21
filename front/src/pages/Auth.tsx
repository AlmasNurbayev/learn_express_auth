import Header from '../components/Header';

import './auth.css';
import {
  apiAuthLogin,
  apiAuthRegister,
  apiAuthRequestConfirm,
  apiAuthSendConfirm,
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
import { useCountdown } from 'usehooks-ts';

export default function Auth() {
  const [isDisableReply, setisDisableReply] = useState(true);
  const [showConfirm, setShowConfirm] = useState('none');

  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 60,
    intervalMs: 1000,
  });

  if (count === 0) {
    resetCountdown();
    setisDisableReply(false);
  }

  async function confirmAndRegisterContinue(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    event.preventDefault();
    if (event.target.value.length === 5) {
      if (isDisableReply) {
        return;
      }
      const resultConfirm = await apiAuthSendConfirm(
        localStorage.getItem('address') || '',
        loginTypeEnum[
          localStorage.getItem('type') as keyof typeof loginTypeEnum
        ],
        event.target.value
      );
      event.target.value = '';
      if (resultConfirm?.status !== 200) {
        if (resultConfirm?.data.error === 'not correct data') {
          toast.error(
            'Неправильный код или адрес, повторите отправку кода через минуту',
            toastDefaultConfig
          );
          return;
        } else {
          toast.error(
            'Ошибка при отправке кода, повторите попытку через минуту',
            toastDefaultConfig
          );
          return;
        }
      } else {
        const data: RegisterRequest = {
          password: localStorage.getItem('password') || '',
          name: localStorage.getItem('name') || '',
        };
        const type = localStorage.getItem('type') as keyof typeof loginTypeEnum;
        if (type === loginTypeEnum.email) {
          data.email = localStorage.getItem('address') || '';
        } else if (type === loginTypeEnum.phone) {
          data.phone = localStorage.getItem('address') || '';
        }

        registerHandler(data);
      }
      console.log('resultConfirm', resultConfirm);
    }
  }

  async function requestConfirmRegister(address: string, type: loginTypeEnum) {
    setisDisableReply(false);
    return await apiAuthRequestConfirm(address, type);
  }

  async function loginHandler(data: loginRequest) {
    const resultLogin = await apiAuthLogin(data);
    if (resultLogin?.status === 200) {
      localStorage.setItem('isAuth', 'true');
      localStorage.setItem('userId', resultLogin.data.data.id);
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
        'Регистрация прошла успешно, можете произвести вход',
        toastDefaultConfig
      );
      setShowConfirm('none');
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

        if (data.email) {
          const resultConfirm = await requestConfirmRegister(
            data.email,
            loginTypeEnum.email
          );
          startCountdown();
          setisDisableReply(true);
          if (resultConfirm.data.transport?.email === 'success') {
            localStorage.setItem('address', data.email);
            localStorage.setItem('password', data.password);
            localStorage.setItem('name', data.name);
            localStorage.setItem('type', loginTypeEnum.email);
            setShowConfirm('block');
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
            localStorage.setItem('address', data.phone);
            localStorage.setItem('password', data.password);
            localStorage.setItem('name', data.name);
            localStorage.setItem('type', loginTypeEnum.phone);
            setShowConfirm('block');
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
    console.log(data);

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
      ///
    }
    if (mode === 'register') {
      //
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
            <button type="submit">login</button>
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
            <div className="confirm_container" style={{ display: showConfirm }}>
              На ваш адрес {localStorage.getItem('address')} был отправлен код
              подтверждения. Введите его в поле ниже:
              <br />
              <input
                className="confirm_input"
                type="text"
                onChange={(event) => confirmAndRegisterContinue(event)}
                placeholder='введите код'
                maxLength={5}
                size={5}
              />
              <br />
              {isDisableReply && `Если к вам не пришел код, то повторите отправку кода через ${count} секунд`}

              <button
                className="button"
                disabled={isDisableReply}
                type="submit"
              >
                Отправить повторно
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* <div className='confirm_container' ></div> */}
    </>
  );
}
