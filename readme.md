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

front:
- react
- react-tostify для уведомлений (https://www.npmjs.com/package/react-toastify), axios для запросов 
- TODO - хранение некоторых данных перенести из localstorage в Zustand

db:
- стандартный контейнер Postrgres


