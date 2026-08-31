# Xipe Server

Express + Prisma + Postgres. Auth real con bcrypt + JWT (cookie httpOnly).

## Setup

```bash
# 1. instalar dependencias
cd server
npm install

# 2. copiar variables de entorno
cp .env.example .env
# edita .env y pega tu DATABASE_URL de Neon, y genera un JWT_SECRET:
#   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

# 3. crear las tablas en Postgres
npm run db:migrate -- --name init

# 4. cargar datos de prueba (Gerardo + admin + clientes/retiros/soporte)
npm run db:seed

# 5. correr el servidor
npm run dev      # http://localhost:4000
```

### Credenciales sembradas

| Rol     | Email              | Contraseña |
|---------|--------------------|------------|
| Cliente | gerardo@xipe.mx    | demo1234   |
| Admin   | admin@xipe.mx      | admin1234  |

## Endpoints principales

| Método | Ruta                              | Descripción                         |
|--------|-----------------------------------|-------------------------------------|
| POST   | /api/auth/register                | Crear cuenta                        |
| POST   | /api/auth/login                   | Iniciar sesión                      |
| POST   | /api/auth/logout                  | Cerrar sesión                       |
| GET    | /api/auth/me                      | Sesión actual                       |
| GET    | /api/me                           | Mi usuario + balance                |
| PATCH  | /api/me                           | Editar perfil                       |
| POST   | /api/me/password                  | Cambiar contraseña                  |
| POST   | /api/me/verify-identity           | Marcar identidad verificada         |
| POST   | /api/me/balance/add               | Agregar dinero (Stripe/Crypto)      |
| POST   | /api/me/send                      | Enviar dinero                       |
| POST   | /api/me/withdraw                  | Solicitar retiro                    |
| GET    | /api/me/transactions              | Historial                           |
| GET    | /api/me/notifications             | Notificaciones                      |
| GET    | /api/me/goals                     | Mis alcancías                       |
| POST   | /api/me/goals                     | Crear alcancía                      |
| POST   | /api/me/goals/:id/contribute      | Aportar                             |
| POST   | /api/me/goals/:id/break           | Romper                              |
| GET    | /api/admin/clients                | Clientes (admin)                    |
| GET    | /api/admin/clients/:id            | Detalle cliente + transacciones     |
| GET    | /api/admin/withdrawals            | Solicitudes de retiro               |
| PATCH  | /api/admin/withdrawals/:id        | Aprobar / rechazar                  |
| GET    | /api/admin/support                | Mensajes a soporte                  |
| PATCH  | /api/admin/support/:id            | Cerrar / responder                  |

## Despliegue

El servidor es un Node app estándar — sube `/server` a Render, Railway o Fly,
configura las variables de entorno y corre `npm run db:deploy` en el release
step para aplicar migraciones.

En Vercel solo se queda el frontend; apúntalo al servidor con `VITE_API_URL` en
los Project Settings.
