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
- refresh - принимает куку с refreshToken и выдает новую пару accessToken, refreshToken
- Oauth - при логине проверяется наличие пользователя в нашей таблице, если нет - создается с пуcтым паролем. Если уже есть наш пользователь - выдается кука с refreshToken.  
- Oauth - также при логине идет перенаправление на главную страницу фронта, чтобы сработал любой запрос на защищенный роут и сработал интерсептор на 401, который используя куку делает refresh и мы получаем новый accessToken

front:
- react
- react-tostify для уведомлений (https://www.npmjs.com/package/react-toastify), axios для запросов
- zustand - хранение состояния (user, accessToken) 
- Oauth - реализовано google, yandex
- интерсептор axios - на каждый запрос axios добавляется header authorization bearer с accessToken, который лежит в zustand
- интерсептор axios - если любой запрос возвращает 401, то выполняется refresh accessToken и повтор исходного запроса с новым

db:
- стандартный контейнер Postrgres


