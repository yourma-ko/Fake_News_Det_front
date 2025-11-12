# 🔌 Интеграция с Backend API

## Требования к Backend

Для корректной работы фронтенда Backend API должен предоставлять следующие endpoints:

### 1. Authentication Endpoints

#### POST `/api/auth/register`
Регистрация нового пользователя

**Request:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string | null",
  "phone": "string | null"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "string (JWT)",
  "email": "string",
  "name": "string | null"
}
```

**Error (400 Bad Request):**
```json
{
  "type": "string",
  "title": "string",
  "status": 400,
  "detail": "string",
  "instance": "string",
  "traceId": "string"
}
```

---

#### POST `/api/auth/login`
Аутентификация пользователя

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "string (JWT)",
  "email": "string",
  "name": "string | null"
}
```

**Error (401 Unauthorized):**
```json
{
  "type": "string",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Invalid credentials",
  "instance": "string",
  "traceId": "string"
}
```

---

#### GET `/api/auth/me`
Получение информации о текущем пользователе

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "email": "string",
  "name": "string | null",
  "role": "string"
}
```

**Error (401 Unauthorized):** Если токен невалиден или истёк

---

### 2. Verification Endpoints

#### POST `/api/verify/url`
Проверка новости по URL

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request:**
```json
{
  "url": "string"
}
```

**Response (200 OK):**
```json
{
  "newsId": "string (GUID)",
  "verdict": "credible | questionable | fake | insufficient",
  "score": 0.85,
  "siteRepScore": 0.90,
  "reusedFrom": "string | null",
  "evidence": [
    "string",
    "string"
  ],
  "checkedAt": "2025-10-24T12:34:56.789Z"
}
```

**Error (400 Bad Request):**
```json
{
  "type": "string",
  "title": "Validation Error",
  "status": 400,
  "detail": "Invalid URL format",
  "instance": "string",
  "traceId": "string"
}
```

---

#### POST `/api/verify/text`
Проверка текста новости

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request:**
```json
{
  "text": "string",
  "url": "string | null"
}
```

**Response (200 OK):**
```json
{
  "newsId": "string (GUID)",
  "verdict": "credible | questionable | fake | insufficient",
  "score": 0.65,
  "siteRepScore": null,
  "reusedFrom": null,
  "evidence": [
    "string",
    "string"
  ],
  "checkedAt": "2025-10-24T12:34:56.789Z"
}
```

---

## ⚙️ Настройка CORS

Добавьте в `Program.cs` вашего Backend:

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Добавьте CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Остальная конфигурация...
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Используйте CORS ДО других middleware
app.UseCors();

// Остальные middleware...
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

---

## 🔒 JWT Token Configuration

### Формат JWT токена

Фронтенд ожидает JWT токен в следующем формате:

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "user@example.com",
  "email": "user@example.com",
  "name": "User Name",
  "role": "User",
  "exp": 1735037696,  // Unix timestamp
  "iss": "FakeCheckAPI",
  "aud": "FakeCheckWeb"
}
```

### Важно!

- Поле `exp` (expiration) **обязательно** - фронтенд проверяет срок действия
- Токен отправляется в заголовке: `Authorization: Bearer <token>`
- После истечения токена пользователь автоматически выходит

---

## 🧪 Тестирование интеграции

### 1. Проверка подключения

```powershell
# Проверка регистрации
Invoke-RestMethod -Uri "https://localhost:5001/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@test.com","password":"Test123!"}'

# Проверка логина
Invoke-RestMethod -Uri "https://localhost:5001/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@test.com","password":"Test123!"}'
```

### 2. Проверка с JWT

```powershell
$token = "YOUR_JWT_TOKEN_HERE"

# Проверка /me
Invoke-RestMethod -Uri "https://localhost:5001/api/auth/me" `
  -Method GET `
  -Headers @{Authorization="Bearer $token"}

# Проверка verify/url
Invoke-RestMethod -Uri "https://localhost:5001/api/verify/url" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{Authorization="Bearer $token"} `
  -Body '{"url":"https://example.com/news"}'
```

---

## 🐛 Troubleshooting

### Ошибка CORS

**Проблема:** `Access-Control-Allow-Origin`

**Решение:**
1. Убедитесь что CORS настроен в `Program.cs`
2. `app.UseCors()` должен быть **ДО** `app.UseAuthorization()`
3. Проверьте что Frontend URL правильный (`http://localhost:4200`)

---

### Ошибка 401 Unauthorized

**Проблема:** Все запросы возвращают 401

**Решение:**
1. Проверьте что JWT токен правильно генерируется
2. Убедитесь что поле `exp` в токене корректное
3. Проверьте настройки JWT Authentication в Backend

---

### Ошибка SSL Certificate

**Проблема:** `SSL certificate problem`

**Решение (Development):**
1. Используйте HTTP вместо HTTPS в development
2. Или добавьте исключение для самоподписанного сертификата
3. В `environment.development.ts` укажите: `apiBaseUrl: 'http://localhost:5000'`

---

### Ошибка ProblemDetails не распознается

**Проблема:** Ошибки не отображаются корректно

**Решение:**
Backend должен возвращать ошибки в формате ProblemDetails (RFC 7807):

```csharp
// В контроллере
return Problem(
    statusCode: 400,
    title: "Validation Error",
    detail: "Email already exists",
    instance: HttpContext.Request.Path
);
```

---

## 📋 Checklist перед запуском

- [ ] Backend запущен и доступен
- [ ] CORS настроен для `http://localhost:4200`
- [ ] JWT Authentication настроен
- [ ] Все endpoints доступны:
  - [ ] POST `/api/auth/register`
  - [ ] POST `/api/auth/login`
  - [ ] GET `/api/auth/me`
  - [ ] POST `/api/verify/url`
  - [ ] POST `/api/verify/text`
- [ ] JWT токен содержит поле `exp`
- [ ] ProblemDetails используется для ошибок
- [ ] Swagger доступен (опционально)

---

## 📞 Поддержка

Если что-то не работает:

1. Откройте Developer Tools (F12) в браузере
2. Перейдите на вкладку Network
3. Попробуйте выполнить действие (login/verify)
4. Посмотрите на запрос и ответ
5. Проверьте Headers, Payload, Response

**Частые проблемы:**
- CORS не настроен → ошибка в консоли
- JWT невалиден → 401 Unauthorized
- Endpoint недоступен → 404 Not Found
- Неправильный формат данных → 400 Bad Request

---

**Готово! Backend готов к интеграции с фронтендом.** 🎉
