# PUG + EJS

Навчальний сервер на **Node.js + Express.js** p шаблонізаторами:

- **PUG** для сторінок користувачів: `/users`, `/users/:userId`
- **EJS** для сторінок статей: `/articles`, `/articles/:articleId`
- Статичні файли (CSS) через `express.static`

Сервер слухає порт **3000** (або `process.env.PORT`, якщо заданий).

## Запуск проєкту

### 1) Встановлення залежностей

```bash
   npm install
```

### 2) Запуск сервера

```bash
npm start
```

### 3) Запуск у dev-режимі (якщо є nodemon)

```bash
npm run dev
```

Після запуску сервер доступний за адресою:
http://localhost:3000

## 1) Users pages (PUG)

### 1.1 `GET /users`

- **Призначення:** відобразити список користувачів у вигляді HTML сторінки.
- **Template engine:** PUG
- **View:** `src/views/users/index.pug`
- **Controller:** `getUsers`
- **Render:**

```js
return res.status(200).render("users/index.pug", {
  title: "Users",
  users,
});
```

**Що бачить користувач у браузері:**

- заголовок Users
- список користувачів (username + id)
- посилання на сторінку деталей /users/:userId
- **Приклад URL:** http://localhost:3000/users

### 1.2 GET `/users/:userId`

- **Призначення:** відобразити деталі конкретного користувача.
- **Template engine:** PUG
- **View:** src/views/users/details.pug
- **Controller:** getUserById
- **Render:**

```js
return res.status(200).render("users/details.pug", {
  title: `User #${userId}`,
  user,
});
```

- **Умови:**якщо користувач з таким userId не знайдений -> повертається текст: 404 User not found: {userId}
- **Приклад URL:** http://localhost:3000/users/1

## 2) Articles pages (EJS)

### 2.1 GET /articles

- **Призначення:** відобразити список статей у вигляді HTML сторінки.
- **Template engine:** EJS
- **View:** src/views/articles/index.ejs
- **Controller:** getArticles
- **Render:**

```js
return res.status(200).render("articles/index.ejs", {
  title: "Articles",
  articles,
});
```

- **Що бачить користувач у браузері:**
- заголовок Articles
- список статей (title + id)
- посилання на деталі /articles/:articleId
- **Приклад URL:** http://localhost:3000/articles

### 2.2 GET /articles/:articleId

- **Призначення:** відобразити деталі конкретної статті.
- **Template engine:** EJS
- **View:** src/views/articles/details.ejs
- **Controller:** getArticleById
- **Render:**

```js
return res.status(200).render("articles/details.ejs", {
  title: `Article #${articleId}`,
  article,
});
```

- _Умови:_ якщо стаття з таким articleId не знайдена -> повертається текст: 404 Article not found: {articleId}
- **Приклад URL:** http://localhost:3000/articles/1
