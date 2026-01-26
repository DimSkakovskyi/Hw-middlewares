# Docker + Docker Compose (Express + MongoDB)

Мета: запустити Express-додаток у Docker контейнері та підключити його до MongoDB через Docker Compose. Також налаштувати `volumes`, щоб зміни в коді підхоплювались без ручного перезапуску контейнера.

---

## Вимоги

- Docker Desktop (або Docker Engine)
- Docker Compose (вбудований у Docker Desktop)

---

## Файли

У проєкті додані:

- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`

---

## Dockerfile (коротко)

- Використовується образ `node:lts`
- Робоча директорія: `/app`
- Встановлення залежностей через `npm install`
- Відкритий порт `3000`
- Запуск: `npm run dev` (nodemon)

---

## docker-compose.yml (коротко)

Є 2 сервіси:

- `app` — Express
- `mongo` — MongoDB (офіційний образ)

Основні налаштування:

- Порт додатку: `3000:3000`
- MongoDB: `mongo:27017`
- Змінна середовища для підключення:
  - `MONGODB_URI=mongodb://mongo:27017/appdb`
- `depends_on`: додаток залежить від MongoDB
- `volumes`: синхронізація коду з контейнером

---

## Як запустити

У корені проєкту:

```bash
docker compose up --build
```

Перевірка в браузері:

- http://localhost:3000  
  Очікувано: вітальне повідомлення (наприклад `Get root route`).

---

## Hot reload (оновлення коду без перезапуску контейнера)

На Windows/macOS nodemon інколи не бачить зміни у файлах через Docker volumes.  
Рішення: увімкнути **legacy watch / polling**.

### 1) package.json

Онови `dev`-скрипт:

```json
"dev": "nodemon -L src/server.js"
```

### 2) docker-compose.yml (додатково, якщо треба)

Додай змінні в сервіс `app`:

```yaml
environment:
  - NODE_ENV=development
  - CHOKIDAR_USEPOLLING=true
  - CHOKIDAR_INTERVAL=1000
  - NODEMON_LEGACY_WATCH=1
```

Після змін перезапусти контейнери:

```bash
docker compose down
docker compose up --build
```

### Перевірка hot reload

1. Зміни текст у root route (наприклад у `src/routes/root.routes.js`)
2. Збережи файл
3. У логах `docker compose` має бути перезапуск nodemon
4. Онови сторінку в браузері — зміни мають відобразитись

---

## Перевірка MongoDB

MongoDB запускається як окремий сервіс `mongo`.  
Додаток підключається через:

```
mongodb://mongo:27017/appdb
```

Якщо потрібна перевірка вручну:

```bash
docker compose exec mongo mongosh
```

---

## Команди для тестування

- Запуск:

```bash
docker compose up --build
```

- Зупинка:

```bash
docker compose down
```

- Перевірити логи:

```bash
docker compose logs -f app
```

---
