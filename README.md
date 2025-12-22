# Middlewares project

## Опис проєкту

Це навчальний сервер на **Node.js + Express.js**, доповнений **middleware** для:

- логування запитів
- обробки помилок (404 + global error handler)
- базової аутентифікації (для users)
- валідації даних (для users)
- перевірки прав доступу (для articles)

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

## Опис маршрутів сервера

---

### 1) Root

#### GET `/`

- **Призначення:** перевірка роботи сервера (головний маршрут).
- **Middleware:** `logRequests` (логування запитів).
- **Відповідь (200):** `Get root route`

---

### 2) Users

> Для всіх маршрутів `/users` та `/users/:userId` використовується **middleware аутентифікації**.  
> Потрібен заголовок: `Authorization: Bearer test`  
> Якщо заголовка немає → **401** `Access denied. No credentials sent.`

#### GET `/users`

- **Призначення:** отримати список користувачів.
- **Middleware:** `basicAuth`
- **Відповідь (200):** `Get users route` (або список користувачів, якщо реалізовано fake DB)

#### POST `/users`

- **Призначення:** створити нового користувача.
- **Middleware:** `basicAuth` + `validateUserBody`
- **Вимоги до Body (JSON):**
  ```json
  { "username": "john", "password": "123" }
  ```
- **Помилки:** 400 Missing required fields: username and password (якщо не передано поля)
- **Відповідь (201/200):** Post users route / User created: ...

#### GET `/users/:userId`

- **Призначення:** отримати користувача за userId.
- **Middleware:** basicAuth (+ validateIdParam за потреби)
- **Параметри:** userId — ідентифікатор користувача (з URL)
- **Помилки:** 404 User not found: {userId} (якщо користувача немає)
- **Відповідь (200):** Get user by Id route: {userId}

#### PUT `/users/:userId`

- **Призначення:** оновити користувача за userId.
- **Middleware:** basicAuth + validateUserBody (+ validateIdParam)
- **Параметри:** userId — ідентифікатор користувача (з URL)
- **Вимоги до Body (JSON):** { "username": "newname", "password": "newpass" }
- **Помилки:** 400 Missing required fields: username and password, 404 User not found: {userId} (якщо користувача немає)
- **Відповідь (200):** Put user by Id route: {userId}

#### DELETE `/users/:userId`

- **Призначення:** видалити користувача за userId.
- **Middleware:** basicAuth (+ validateIdParam)
- **Параметри:** userId — ідентифікатор користувача (з URL)
- **Помилки:** 404 User not found: {userId} (якщо користувача немає)
- **Відповідь (200):** Delete user by Id route: {userId}

### 3) Articles

> Для всіх маршрутів `/articles` та `/articles/:articleId` використовується middleware перевірки доступу.
> Потрібен заголовок: `X-ROLE: admin` або `X-ROLE: editor`
> Якщо роль не підходить → **403** `Forbidden. Not enough permissions to access articles.`

#### GET `/articles`

- **Призначення:** отримати список статей.
- **Middleware:** requireArticleAccess
- **Відповідь (200):** Get articles route

#### POST `/articles`

- **Призначення:** створити нову статтю.
- **Middleware:** requireArticleAccess
- **Відповідь (201/200):** Post articles route / Article created: ... (залежить від реалізації контролера)

#### GET `/articles/:articleId`

- **Призначення:** отримати статтю за articleId.
- **Middleware:** requireArticleAccess (+ validateIdParam)
- **Параметри:** articleId — ідентифікатор статті (з URL)
- **Помилки:** 404 Article not found: {articleId}
- **Відповідь (200):** Get article by Id route: {articleId}

#### PUT `/articles/:articleId`

- **Призначення:** оновити статтю за articleId.
- **Middleware:** requireArticleAccess (+ validateIdParam)
- **Параметри:** articleId — ідентифікатор статті (з URL)
- **Body (опційно):** { "title": "New title" }
- **Помилки:** 404 Article not found: {articleId}
- **Відповідь (200):** Put article by Id route: {articleId}

#### DELETE `/articles/:articleId`

- **Призначення:** видалити статтю за articleId.
- **Middleware:** requireArticleAccess (+ validateIdParam)
- **Параметри:** articleId — ідентифікатор статті (з URL)
- **Помилки:** 404 Article not found: {articleId}
- **Відповідь (200):** Delete article by Id route: {articleId}
