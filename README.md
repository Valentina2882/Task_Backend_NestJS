# Task Management Backend (NestJS)

Este es el backend de la aplicación de gestión de tareas, desarrollado por **[Tu Nombre]** usando **NestJS** y **TypeORM**.

## Características principales
- Registro y login de usuarios (JWT)
- Gestión de tareas (CRUD)
- Filtros y estados de tareas
- Seguridad y validación

## Instalación y configuración

1. **Clona el repositorio:**
   ```bash
   git clone <repo-url>
   cd Task-Management
   ```

2. **Instala dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   - Crea un archivo `.env` en la raíz con el siguiente contenido:
     ```env
     DB_HOST=localhost
     DB_PORT=5432
     DB_USERNAME=postgres
     DB_PASSWORD=postgres
     DB_DATABASE=tasks
     JWT_SECRET=supersecret
     JWT_EXPIRES_IN=3600s
     ```
   - Ajusta los valores según tu entorno.

4. **Inicia el servidor:**
   ```bash
   npm run start:dev
   ```

## Endpoints principales

### Autenticación
- **POST** `/auth/signup` — Registro de usuario
- **POST** `/auth/signin` — Login de usuario
- **GET** `/auth/verify` — Verifica el token JWT

### Tareas (protegido por JWT)
- **GET** `/tasks` — Lista tareas del usuario
- **POST** `/tasks` — Crea una nueva tarea
- **PATCH** `/tasks/:id/status` — Cambia el estado de una tarea
- **DELETE** `/tasks/:id` — Elimina una tarea

## Despliegue
- El backend está desplegado en **Railway**.

## Documentación de la API
- La documentación interactiva de la API está disponible en **Swagger** (por ejemplo, `/api` o `/docs`).

---

**Autor:** Valentina2882.

