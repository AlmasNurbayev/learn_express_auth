import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import { apiAuthRegister, apiAuthSendConfirm } from '../api/api.auth';
import { loginTypeEnum } from '../interfaces/login.';
import { toastDefaultConfig } from '../config/config';

export default function Confirm() {
  const [searchParams] = useSearchParams();
  // const [code, setCode] = useState('');
  const [isDisableReply, setisDisableReply] = useState(true);
  const navigate = useNavigate();
  const address = String(searchParams.get('address'));
  const password = String(searchParams.get('password'));
  const type = loginTypeEnum[searchParams.get('type') as keyof typeof loginTypeEnum];

  async function sendConfirm(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    
    //setCode(event.target.value);
    if (event.target.value.length === 5) {
      const resultConfirm = await apiAuthSendConfirm(address, type, event.target.value);
      if (resultConfirm?.status !== 200) {
        if (resultConfirm?.data.error === 'not correct data') {
          toast.error('Неправильный код или адрес, повторите отправку кода через минуту', toastDefaultConfig);
          return;
        }
      } else {
        const data = {
          email: type === loginTypeEnum.email ? address : undefined,
          phone: type === loginTypeEnum.phone ? address : undefined,
          password,
        };

        const resultRegister = await apiAuthRegister(data);
        toast.success('Код подтвержден, теперь вы можете войти', toastDefaultConfig);
        navigate(
          `/auth`
        );
      }
      console.log('resultConfirm', resultConfirm);
    }
    // } else if (event.target.value.length > 5) {
    //   event.target.value = event.target.value.slice(0, 5);
    // }
  }

  return (
    <div>
      <Header />
      <ToastContainer />
      На ваш адрес {searchParams.get('address')} был отправлен код
      подтверждения. Введите его в поле ниже. Если к вам не пришел код, то
      нажмите "Отправить код повторно" через 1 минуту
      <form>
        <input
          type="text"
          onChange={(event) => sendConfirm(event)}
          placeholder="код..."
          maxLength={5}
          size={5}
        />
      </form>
      <button disabled={isDisableReply}>Отправить повторно</button>
    </div>
  );
}
