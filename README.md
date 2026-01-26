# MongoDB Atlas — Cursors + Aggregation

Це завдання є продовженням проєкту з інтеграцією **MongoDB Atlas**.  
Мета — оптимізувати роботу з даними за допомогою **курсорів** та додати **агрегаційний запит** для отримання статистики.

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

---

## Налаштування `.env`

```env
PORT=3000
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/DB_NAME?retryWrites=true&w=majority
```

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

## Нова функціональність

### 1) Cursor (перебір документів без збереження в масив)

Маршрут використовує **курсор** (`find().cursor()`), щоб перебирати документи по одному та не тримати весь набір в памʼяті.  
Відповідь повертається у форматі **NDJSON**: кожен документ — окремий рядок JSON.

#### GET `/articles/cursor`

Query параметри:

- `limit` — скільки документів віддати (за замовчуванням 100, максимум 5000)
- `fields` — projection полів, наприклад `title,createdAt`

Приклад:

```
GET /articles/cursor?limit=5&fields=title,createdAt
```

Очікувано:

- `200 OK`
- `Content-Type: application/x-ndjson`
- 5 рядків JSON (кожен документ окремо)

---

### 2) Aggregation (статистика по колекції)

Маршрут використовує **aggregation pipeline** для отримання статистики без ручної обробки даних у JavaScript.

#### GET `/articles/stats`

Повертає:

- `count` — кількість документів
- `avgTextLength` — середня довжина поля `text`
- `uniqueTitles` — кількість унікальних значень `title`
- `minCreatedAt`, `maxCreatedAt` — мінімальна та максимальна дата створення (якщо поле є)

Приклад:

```
GET /articles/stats
```

Очікувано (приклад):

```json
{
  "count": 12,
  "avgTextLength": 34.5,
  "uniqueTitles": 10,
  "minCreatedAt": "2026-01-01T10:00:00.000Z",
  "maxCreatedAt": "2026-01-23T12:00:00.000Z"
}
```

---

## Як це покращує роботу сервера

- **Cursor**: не завантажує всі документи в памʼять (краще для великих колекцій).
- **Aggregation**: обчислення статистики виконується на стороні MongoDB, а не в Node.js.

---

## Тестування (Postman)

### Cursor

1. Створи запит **GET**:
   `http://localhost:3000/articles/cursor?limit=5&fields=title,createdAt`
2. Перевір, що відповідь йде як NDJSON (кілька JSON-рядків).

### Stats

1. Створи запит **GET**:
   `http://localhost:3000/articles/stats`
2. Перевір, що повертається JSON зі статистикою.

---
