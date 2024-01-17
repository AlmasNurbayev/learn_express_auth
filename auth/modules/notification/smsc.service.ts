import axios, { AxiosRequestConfig } from 'axios';
import { smallint } from 'drizzle-orm/mysql-core';

export class SmscService {
  private config: { host: string; user: string; password: string };
  constructor() {
    this.config = {
      host: String(process.env.SMSC_HOST) + 'rest/send/',
      user: String(process.env.SMSC_USER),
      password: String(process.env.SMSC_PASS),
    };
  }

  async sendSms(phone: string, text: string) {
    try {
      const sms = await axios.post(this.config.host, {
        login: this.config.user,
        psw: this.config.password,
        phones: phone,
        mes: text,
      });
      if (!sms.data.error) {
        return { data: sms.data };
      } else {
        return { error: sms.data.error };
      }
    } catch (error) {
      console.error(error);
      return { error: error };
    }
  }
}
