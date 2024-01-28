import { FormEventHandler, useState } from 'react';
import { toast } from 'react-toastify';
import { useCountdown } from 'usehooks-ts';
import { toastDefaultConfig } from '../../config/config';
import { loginTypeEnum } from '../../interfaces/login.';
import { apiAuthSendConfirm } from '../../api/api.auth';
import './ConfirmForm.css';
import { FormError } from '../../common/interfaces';
import { parseZodErrors } from '../../common/utils';
import Input from '../Input/Input';

export default function ConfirmForm({
  address,
  type,
  changeConfirm,
}: {
  address: string;
  type: loginTypeEnum;
  changeConfirm: (value: boolean) => void;
}) {
  const [isDisableReply, setisDisableReply] = useState(false);
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 60,
    intervalMs: 1000,
  });
  const [errors, setErrors] = useState<FormError[]>([]);

  if (count === 0) {
    resetCountdown();
    setisDisableReply(false);
  }

  type TFormFields = {
    code: HTMLInputElement;
  };

  const confirmAndRegisterContinue: FormEventHandler<
    HTMLFormElement & TFormFields
  > = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const code = form.code.value;

    if (isDisableReply) {
      return;
    }
    setErrors([]);
    const resultConfirm = await apiAuthSendConfirm(address, type, code);

    form.code.value = '';
    if (resultConfirm?.status !== 200) {
      setisDisableReply(true);
      startCountdown();
      if (resultConfirm?.data?.issues) {
        setErrors((prev) => [...prev, ...parseZodErrors(resultConfirm)]);
      } else {
        toast.error(
          'Ошибка при отправке кода, повторите попытку через минуту',
          toastDefaultConfig
        );
        return;
      }
    } else {
      toast.success('Код подтвержден', toastDefaultConfig);
      changeConfirm(false);
      // const data: RegisterRequest = {
      //   password: localStorage.getItem('password') || '',
      //   name: localStorage.getItem('name') || '',
      // };
      // const type = localStorage.getItem('type') as keyof typeof loginTypeEnum;
      // if (type === loginTypeEnum.email) {
      //   data.email = localStorage.getItem('address') || '';
      // } else if (type === loginTypeEnum.phone) {
      //   data.phone = localStorage.getItem('address') || '';
      // }

      //registerHandler(data);
    }
    console.log('resultConfirm', resultConfirm);
  };

  return (
    <>
      <form onSubmit={confirmAndRegisterContinue}>
        <div className="confirm_container">
          На ваш адрес {localStorage.getItem('address')} был отправлен код
          подтверждения. Введите его в поле ниже:
          <Input
            name="code"
            type="text"
            placeholder="введите код"
            error={errors}
            maxLength={5}
            size={5}
            mainfontsize={26}
            secondfontsize={10}
            style={{border: 'solid 1px black'}}
          />
          {isDisableReply &&
            `Если вам не пришел код, то повторите отправку кода через ${count} секунд`}
          <br />
          <button type="submit" className="button" disabled={isDisableReply}>
            Отправить код
          </button>
        </div>
      </form>
    </>
  );
}
