# Проект для тренировки методов аутентификации/авторизации

## Первоначальная настройка окружения
docker-compose, 3 контейенра - auth (backend), db (postgres), front

auth-стек:
- роутер: express
- валидация входных данных: zod
- подключение к базе: pg, Drizzle ORM
- аутентификация - passport, passport-jwt, passport-oauth
- внешние API для подтверждения учетных данных - SMSC.ru, Nodemailer для smtp
- логгер - winston в консоль
- при логине выдается в теле ответа accessToken, refreshToken. Последний дублируется в куки 
- refresh - выдает новую пару accessToken, refreshToken
- Oauth - при логине проверяется наличие пользователя в нашей таблице, если нет - создается с пуcтым паролем. Если уже есть наш пользователь - выдаются токены и кука. 

front:
- react
- react-tostify для уведомлений (https://www.npmjs.com/package/react-toastify), axios для запросов
- zustand - хранение состояния (user, accessToken) 
- Oauth - реализовано google, yandex
- Oauth - также при логине идет перенаправление на профиль (запрос /me), чтобы сработал интерсептор на 401 и после refresh мы получили валидный токен
- интерсептор axios - на каждый запрос axios добавляется header authorization bearer с accessToken, который лежит в zustand
- интерсептор axios - если любой запрос возвращает 401, то выполняется refresh токенов и повтор исходного запроса

db:
- стандартный контейнер Postrgres


