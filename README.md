# Static Favicon + Cookies (Theme) + JWT Auth

Проєкт на **Node.js + Express.js**, який демонструє:

- роботу зі **статичними файлами** (favicon),
- збереження налаштувань користувача через **cookies** (улюблена тема),
- **авторизацію через JWT** з токеном у **httpOnly cookies**,

---

## Технології

- Node.js, Express.js
- Шаблони: **PUG** (users) + **EJS** (articles)
- Cookies: `cookie-parser`
- JWT: `jsonwebtoken`
- Env: `dotenv`

---

## Встановлення та запуск

### 1) Клонування та встановлення

```bash
npm install
```

### 2) Налаштування `.env`

Створи файл `.env` в корені проєкту:

```env
PORT=3000
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=2h
```

> **JWT_SECRET** має бути довгим випадковим рядком.
> Приклад генерації:
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 3) Запуск

```bash
npm start
```

або (якщо є dev-скрипт)

```bash
npm run dev
```

Після запуску сервер доступний за адресою:

- `http://localhost:3000`

---

## Статичні файли (favicon)

### Де лежить favicon

Файл іконки:

- `public/favicon.ico`

### Як працює

Express налаштований на видачу статичних файлів через `express.static(...)`,
тому favicon автоматично доступний за URL:

- `GET /favicon.ico`

### Додавання favicon у PUG та EJS

Оскільки у проєкті **немає `layout.pug` / `layout.ejs`**, тег favicon додається **в кожен шаблон окремо**:

**PUG (в `<head>`):**

```pug
link(rel="icon", href="/favicon.ico")
```

**EJS (в `<head>`):**

```html
<link rel="icon" href="/favicon.ico" />
```

---

## Cookies (збереження теми)

### Мета

Користувач може обрати тему (`light` або `dark`), і вона зберігається в cookie `theme`.

### Як застосовується тема

Під час рендеру сторінок сервер читає cookie:

- `req.cookies.theme || "light"`
  і передає `theme` у шаблон, щоб додати клас до `<body>`:

**PUG:**

```pug
body(class=theme)
```

**EJS:**

```ejs
<body class="<%= theme %>">
```

---

## JWT Авторизація (httpOnly cookie)

### Мета

- `POST /auth/register` — реєстрація, створення JWT
- `POST /auth/login` — логін, створення JWT
- токен зберігається у cookie **`token`** з прапорцем **httpOnly**
- `GET /protected` — приклад захищеного маршруту (доступ лише з валідним JWT)

> `httpOnly` означає, що JavaScript у браузері не може прочитати токен напряму (`document.cookie`), що підвищує безпеку.

---

## Маршрути

> Нижче наведено типову карту маршрутів. Назви можуть відрізнятися, якщо в проєкті роутери підключені інакше, але логіка та вимоги — саме такі.

### 1) Сторінки (PUG / EJS)

#### Users (PUG)

- `GET /users` — сторінка зі списком користувачів (PUG)
- `GET /users/:id` — деталі користувача (PUG)

#### Articles (EJS)

- `GET /articles` — сторінка зі списком статей (EJS)
- `GET /articles/:articleId` — деталі статті (EJS)

---

### 2) Theme (cookies)

#### Встановити тему

- **POST `/theme`**
- Body (JSON):

```json
{ "theme": "dark" }
```

Очікувано:

- `200 OK`
- у Response Headers буде `Set-Cookie: theme=dark; ...`

#### Отримати поточну тему

- **GET `/theme`**
- Response:

```json
{ "theme": "dark" }
```

---

### 3) Auth (JWT)

#### Реєстрація

- **POST `/auth/register`**
- Body (JSON):

```json
{ "email": "test@test.com", "password": "123" }
```

Очікувано:

- `201/200`
- `Set-Cookie: token=...; HttpOnly; ...`

#### Логін

- **POST `/auth/login`**
- Body (JSON):

```json
{ "email": "test@test.com", "password": "123" }
```

Очікувано:

- `200`
- `Set-Cookie: token=...; HttpOnly; ...`

#### Вихід (очистка cookie)

- **POST `/auth/logout`**
  Очікувано:
- `200`
- cookie `token` очищується

---

### 4) Protected (JWT middleware)

#### Захищений маршрут

- **GET `/protected`**
  Очікувано:
- без cookie `token` → `401 Unauthorized`
- з валідним cookie `token` → `200 OK`

Приклад відповіді:

```json
{
  "message": "Protected OK",
  "user": { "id": 1, "email": "test@test.com" }
}
```

---

## Перевірка через Postman (коротко)

1. **POST** `http://localhost:3000/auth/register` (або `/auth/login`)  
   Body → raw → JSON:

   ```json
   { "email": "test@test.com", "password": "123" }
   ```

   Перевірити у **Response Headers**: `Set-Cookie: token=...; HttpOnly`

2. Postman автоматично збереже cookie для `localhost`.  
   Далі **GET** `http://localhost:3000/protected` → має бути `200 OK`.

> Не додавай `Set-Cookie` вручну в Headers запиту — це заголовок відповіді сервера.

---

## Примітки

- `.env` **не можна пушити** у GitHub. Додай його в `.gitignore`.
- Для продакшна `secure: true` для cookies вмикається лише на HTTPS.
- Якщо favicon “не видно” у вкладці браузера — зроби `Ctrl+Shift+R` (hard reload) або додай `?v=2` до `href` (щоб пробити кеш).

---

