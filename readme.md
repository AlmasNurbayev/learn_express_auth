# Проект для тренировки методов аутентификации/авторизации

## Первоначальная настройка окружения
docker-compose, 3 контейенра - auth (backend), db (postgres), front

auth-стек:
- роутер: express
- валидация входных данных: zod
- подключение к базе: pg, Drizzle ORM
- аутентификация - passport, passport-jwt
- внешние API для подтверждения учетных данных - SMSC.ru, Nodemailer для smtp
- логгер - winston в консоль
- при логине выдается в теле ответа accessToken, refreshToken. Последний дублируется в куки 

front:
- react
- react-tostify для уведомлений (https://www.npmjs.com/package/react-toastify), axios для запросов
- zustand - хранение состояния (user, accessToken) 
- TODO - хранение некоторых данных перенести из localstorage в Zustand

db:
- стандартный контейнер Postrgres


