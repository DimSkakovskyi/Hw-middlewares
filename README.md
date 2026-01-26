# MongoDB Atlas CRUD for Articles (Express + Node.js)

Це завдання є продовженням проєкту, де вже реалізовано підключення **MongoDB Atlas** та читання даних.  
У цьому оновленні додано повний набір CRUD-операцій для колекції **articles**:

- **Створення**: insertOne, insertMany
- **Оновлення**: updateOne, updateMany, replaceOne
- **Видалення**: deleteOne, deleteMany
- **Розширене читання**: find + projection

---

## Технології

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

---

## Встановлення

```bash
npm install
```

Переконайся, що встановлено Mongoose:

```bash
npm i mongoose
```

---

## Налаштування `.env`

Створи файл `.env` у корені проєкту:

```env
PORT=3000
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/DB_NAME?retryWrites=true&w=majority
```

> Якщо в паролі є спецсимволи (`@ : / ? # & %`) — краще зробити пароль без спецсимволів або закодувати його (URL-encoding).

---

## Запуск

```bash
npm start
```

або

```bash
npm run dev
```

---

## Колекція

Проєкт працює з колекцією:

- `articles`

Типовий документ:

```json
{
  "_id": "ObjectId(...)",
  "title": "Article title",
  "text": "Some text",
  "createdAt": "2026-01-23T...",
  "updatedAt": "2026-01-23T..."
}
```

---

## Маршрути CRUD (Articles)

> Для маршрутів зміни даних (POST / PATCH / PUT / DELETE) у проєкті використовується middleware доступу.
> Якщо у вас стоїть `requireArticleAccess`, то потрібно додати header:
>
> `x-role: admin` або `x-role: editor`

---

### 1) READ — find + projection

#### GET `/articles`

Повертає список статей (find).

**Query параметри:**

- `limit` — кількість документів (наприклад `?limit=5`)
- `fields` — projection полів (наприклад `?fields=title,text,createdAt`)

**Приклад:**

```
GET /articles?limit=5&fields=title,createdAt
```

Очікувано: список документів, де повертаються лише обрані поля.

---

#### GET `/articles/:articleId`

Повертає одну статтю по `_id` (Mongo ObjectId).

**Приклад:**

```
GET /articles/65b1c2d3e4f5a6b7c8d9e0f1
```

---

### 2) CREATE — insertOne / insertMany

#### POST `/articles` (insertOne)

Створює один документ.

Headers:

- `Content-Type: application/json`
- `x-role: admin` (або `editor`)

Body:

```json
{
  "title": "New article",
  "text": "Hello!"
}
```

Очікувано:

- `201 Created`
- JSON з створеним документом

---

#### POST `/articles/bulk` (insertMany)

Створює багато документів.

Headers:

- `Content-Type: application/json`
- `x-role: admin` (або `editor`)

Body:

```json
{
  "items": [
    { "title": "A1", "text": "t1" },
    { "title": "A2", "text": "t2" }
  ]
}
```

Очікувано:

- `201 Created`
- `{ count: N, items: [...] }`

---

### 3) UPDATE — updateOne / updateMany / replaceOne

#### PATCH `/articles/:articleId` (updateOne)

Оновлює один документ частково.

Headers:

- `Content-Type: application/json`
- `x-role: admin` (або `editor`)

Body:

```json
{
  "set": { "title": "Updated title" }
}
```

Очікувано:

- `200 OK`
- result з `matchedCount` / `modifiedCount`

---

#### PATCH `/articles` (updateMany)

Оновлює багато документів за фільтром.

Headers:

- `Content-Type: application/json`
- `x-role: admin` (або `editor`)

Body:

```json
{
  "filter": { "title": "A1" },
  "set": { "text": "Updated many" }
}
```

Очікувано:

- `200 OK`
- result з `matchedCount` / `modifiedCount`

---

#### PUT `/articles/:articleId` (replaceOne)

Повна заміна документа (окрім `_id`).

Headers:

- `Content-Type: application/json`
- `x-role: admin` (або `editor`)

Body:

```json
{
  "title": "Replaced article",
  "text": "Full document replacement"
}
```

Очікувано:

- `200 OK`
- result з `matchedCount`

---

### 4) DELETE — deleteOne / deleteMany

#### DELETE `/articles/:articleId` (deleteOne)

Видаляє один документ по `_id`.

Headers:

- `x-role: admin` (або `editor`)

Очікувано:

- `200 OK`
- `{ deletedCount: 1 }`

---

#### DELETE `/articles` (deleteMany)

Видаляє багато документів за фільтром.

Headers:

- `Content-Type: application/json`
- `x-role: admin` (або `editor`)

Body:

```json
{
  "filter": { "title": "A2" }
}
```

Очікувано:

- `200 OK`
- `{ deletedCount: N }`

---

## Примітки по ObjectId

`articleId` у URL має бути валідним Mongo ObjectId (24 hex символи), наприклад:

```
65b1c2d3e4f5a6b7c8d9e0f1
```

---

## Перевірка (швидкий сценарій)

1. Створити статтю:

- POST `/articles` + `x-role: admin`

2. Отримати список:

- GET `/articles?limit=5&fields=title,createdAt`

3. Оновити:

- PATCH `/articles/{{articleId}}` + `x-role: admin`

4. Замінити:

- PUT `/articles/{{articleId}}` + `x-role: admin`

5. Видалити:

- DELETE `/articles/{{articleId}}` + `x-role: admin`

---
