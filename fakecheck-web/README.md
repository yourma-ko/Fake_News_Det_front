# FakeCheck Web - Angular Frontend# FakecheckWeb



Полнофункциональный Angular 19+ фронтенд для системы проверки достоверности новостей FakeCheck с JWT-аутентификацией и интеграцией с ASP.NET Core 8 Web API.This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.7.



## 🚀 Технологии## Development server



- **Angular 19.2** (Standalone Components)To start a local development server, run:

- **TypeScript 5+**

- **Angular Material 19+**```bash

- **RxJS** для реактивного программированияng serve

- **JWT** аутентификация```

- **SCSS** для стилей

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## 📋 Структура проекта

## Code scaffolding

```

fakecheck-web/Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

├── src/

│   ├── app/```bash

│   │   ├── core/                    # Singleton сервисыng generate component component-name

│   │   │   ├── guards/```

│   │   │   │   └── auth.guard.ts    # Защита маршрутов

│   │   │   ├── interceptors/For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

│   │   │   │   └── auth.interceptor.ts  # JWT interceptor

│   │   │   └── services/```bash

│   │   │       ├── auth.service.ts      # Аутентификацияng generate --help

│   │   │       ├── verify.service.ts    # API проверки```

│   │   │       └── storage.service.ts   # LocalStorage

│   │   ├── features/                # Feature модули## Building

│   │   │   ├── auth/

│   │   │   │   ├── login/           # ВходTo build the project run:

│   │   │   │   └── register/        # Регистрация

│   │   │   ├── landing/             # Главная страница```bash

│   │   │   └── dashboard/ng build

│   │   │       ├── dashboard-layout/  # Layout```

│   │   │       ├── verify/          # Проверка новостей

│   │   │       └── history/         # История проверокThis will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

│   │   ├── models/

│   │   │   └── api.models.ts        # TypeScript модели## Running unit tests

│   │   ├── app.routes.ts            # Маршруты

│   │   └── app.config.ts            # КонфигурацияTo execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

│   ├── environments/

│   │   ├── environment.ts           # Production```bash

│   │   └── environment.development.ts  # Developmentng test

│   └── styles.scss                  # Глобальные стили```

```

## Running end-to-end tests

## ⚙️ Настройка

For end-to-end (e2e) testing, run:

### 1. Установка зависимостей

```bash

```powershellng e2e

npm install```

```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

### 2. Настройка Backend URL

## Additional Resources

Откройте `src/environments/environment.development.ts` и укажите URL вашего Backend API:

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:5001', // Замените на ваш Backend URL
  swaggerUrl: 'https://localhost:5001/swagger/v1/swagger.json'
};
```

## 🎯 Запуск приложения

### Development режим

```powershell
ng serve
```

Приложение будет доступно по адресу: `http://localhost:4200`

### Production сборка

```powershell
ng build
```

Собранные файлы будут в папке `dist/fakecheck-web/`

## 🔐 Функциональность

### Аутентификация

- **Регистрация**: `/register` - Создание нового аккаунта
- **Вход**: `/login` - Аутентификация пользователя
- **JWT токены**: Автоматическое добавление в заголовки запросов
- **Guard защита**: Защита маршрутов `/app/*`

### Проверка новостей

- **По URL**: Вставьте ссылку на новость для проверки
- **По тексту**: Введите текст новости для анализа
- **Результат**: Вердикт, оценка достоверности, обоснование

### История

- **Локальное хранение**: История проверок сохраняется в localStorage
- **Таблица**: Просмотр всех выполненных проверок
- **Фильтрация**: По дате, типу, вердикту

## 📡 API Endpoints

Приложение использует следующие endpoints Backend API:

### Authentication (Анонимные)
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход

### Authentication (JWT требуется)
- `GET /api/auth/me` - Получить текущего пользователя

### Verification (JWT требуется)
- `POST /api/verify/url` - Проверка по URL
- `POST /api/verify/text` - Проверка текста

## 🛠️ Разработка

### Создание нового компонента

```powershell
ng generate component features/my-feature --standalone
```

### Создание нового сервиса

```powershell
ng generate service core/services/my-service
```

## 🎨 Стилизация

Проект использует Angular Material с кастомной темой:

- **Primary**: Violet
- **Tertiary**: Blue
- **Theme Type**: Light

Для изменения темы отредактируйте `src/styles.scss`.

## 🔒 Безопасность

- JWT токены хранятся в localStorage
- Автоматическая проверка срока действия токена
- 401 ошибки обрабатываются interceptor'ом
- Редирект на login при истечении сессии

## 📝 Модели данных

Все TypeScript интерфейсы находятся в `src/app/models/api.models.ts`:

- `RegisterRequest`, `LoginRequest`, `AuthResponse`
- `VerifyUrlRequest`, `VerifyTextRequest`, `VerifyResponse`
- `UserInfo`, `HealthResponse`, `ProblemDetails`

## ✅ Acceptance Criteria

- ✅ Регистрация работает
- ✅ Логин работает с JWT
- ✅ AuthGuard защищает маршруты
- ✅ Interceptor добавляет Bearer токен
- ✅ Проверка по URL работает
- ✅ Проверка по тексту работает
- ✅ Результаты отображаются корректно
- ✅ История сохраняется в localStorage
- ✅ 401 ошибки обрабатываются
- ✅ Проект собирается без ошибок

## 🐛 Отладка

### Проблемы с CORS

Если Backend API блокирует запросы из-за CORS, добавьте в Backend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

### SSL сертификаты

Если Backend использует самоподписанный SSL сертификат, добавьте исключение в браузере или используйте HTTP для development.

## 📚 Дополнительно

### OpenAPI генерация типов

Если доступен Swagger endpoint, можно автоматически сгенерировать типы:

```powershell
npm install -g @openapitools/openapi-generator-cli
openapi-generator-cli generate -i https://localhost:5001/swagger/v1/swagger.json -g typescript-angular -o src/app/generated
```

## 📄 License

MIT License

---

**Приложение готово к использованию!** 🎉
