# Passport (Local) + Sessions + /protected

Цей проєкт показує авторизацію в **Node.js + Express.js** через **Passport** (LocalStrategy: email + password) та **сесії** (`express-session`).
Після входу користувача створюється сесія, а її id зберігається в cookie (`connect.sid`) з налаштуванням **httpOnly** та **secure** (у production).

---

## Встановлення

```bash
npm install
```

---

## Налаштування `.env`

Створи файл **.env** в корені проєкту:

```env
PORT=3000
SESSION_SECRET=your_long_random_secret
NODE_ENV=development
```

Як згенерувати секрет:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> Якщо поставити `NODE_ENV=production`, то cookie буде `secure=true` і працюватиме лише на HTTPS.

---

## Запуск

```bash
npm start
```

або

```bash
npm run dev
```

Сервер: `http://localhost:3000`

---

## Як працює

- Passport LocalStrategy перевіряє **email + password**.
- Пароль зберігається **хешовано** (bcryptjs), не у відкритому вигляді.
- `serializeUser` зберігає в сесії **user.id**.
- `deserializeUser` відновлює користувача і додає його в `req.user`.
- Захищений маршрут `/protected` доступний тільки якщо `req.isAuthenticated()` = true.

---

## Маршрути

### Авторизація

**POST `/auth/register`** — реєстрація + автоматичний логін (створюється сесія)

Body (JSON):

```json
{ "email": "test@test.com", "password": "123" }
```

**POST `/auth/login`** — вхід через Passport

Body (JSON):

```json
{ "email": "test@test.com", "password": "123" }
```

**POST `/auth/logout`** — вихід (сесія видаляється, cookie очищується)

**GET `/auth/me`** — повертає поточного користувача (якщо авторизований)

---

### Захищений маршрут

**GET `/protected`**

- без сесії → `401 Unauthorized`
- після login/register → `200 OK`

---

## Перевірка через Postman (швидко)

1. POST `/auth/register` або POST `/auth/login`
2. GET `/protected` → має бути 200
3. POST `/auth/logout`
4. GET `/protected` → має бути 401

> Postman сам зберігає cookies для `localhost`.
