# Express + Passport + MongoDB Atlas (Read)

Це продовження проєкту з авторизацією через **Passport**. У цьому завданні додано підключення до **MongoDB Atlas** та реалізовано **операцію читання даних** з бази з відображенням на сторінці сервера.

---

## Технології

- Node.js
- Express.js
- Passport (LocalStrategy) + express-session (з попереднього завдання)
- MongoDB Atlas
- Mongoose (для роботи з MongoDB)
- Views: PUG / EJS

---

## Встановлення

```bash
npm install
```

Додатково переконайся, що встановлено:

```bash
npm i mongoose
```

---

## Налаштування MongoDB Atlas

### 1) Створи кластер в MongoDB Atlas

Atlas → Database → Create Cluster (Free tier підійде).

### 2) Створи Database User

Atlas → **Security → Database Access** → **Add New Database User**

- Username + Password
- Role: `Read and write to any database` (для навчальної роботи)

### 3) Додай доступ по IP

Atlas → **Security → Network Access** → **Add IP Address**

- Для тесту можна `0.0.0.0/0` (Allow access from anywhere)

### 4) Візьми connection string

Atlas → Database → Connect → **Drivers** → скопіюй URI виду:

```
mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>/<DB_NAME>?retryWrites=true&w=majority
```

---

## Файл `.env`

Створи `.env` у корені проєкту та додай змінні:

```env
PORT=3000

# Passport sessions (з попереднього завдання)
SESSION_SECRET=your_long_random_secret
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/DB_NAME?retryWrites=true&w=majority
```

> Якщо в паролі є символи `@ : / ? # & %` — краще зробити пароль без спецсимволів,
> або застосувати URL-encoding.

---

## Запуск

```bash
npm start
```

або

```bash
npm run dev
```

Сервер запуститься за адресою:

- `http://localhost:3000`

---

## Нова функціональність (читання з MongoDB)

### Маршрут читання та відображення даних

**GET `/db/articles`**

- робить запит до MongoDB Atlas (колекція `articles`)
- отримує список документів (приклад: останні 20)
- відображає їх на сторінці сервера (PUG view)

Відкрити в браузері:

- `http://localhost:3000/db/articles`

Якщо колекція порожня — сторінка покаже, що даних немає.

---

## Структура (ключові файли)

- `src/db/mongo.js` — підключення до MongoDB Atlas
- `src/models/Article.js` — модель `Article` (колекція `articles`)
- `src/controllers/db.controller.js` — логіка читання з MongoDB і передача у view
- `src/routes/db.routes.js` — маршрут `/db/articles`
- `src/views/db/articles.pug` — сторінка для відображення даних

---
