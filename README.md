[FRONTEND_README.md](https://github.com/user-attachments/files/21677927/FRONTEND_README.md)
# Frontend — Tour Reservation Management System

Interfaz web para gestionar **Clientes**, **Tours** y **Reservaciones** de una agencia de tours. Construida con **React + Vite**, **Material UI**, **Axios** y **Framer Motion**. Autenticación vía **JWT** (token almacenado en `localStorage`) y **rutas protegidas** con React Router.

> Repositorio: `AdrielSolano/Frontend-TourReservationSystem`  
> Backend de referencia: `https://backend-tour-reservation-system.vercel.app/api` (ajusta en `.env` con `VITE_API_URL`).

---

## 🚀 Features
- **Login / Register** (consume API de backend).
- **CRUD Clientes** con paginación.
- **CRUD Tours** con **fechas disponibles** y estado `isActive`.
- **CRUD Reservaciones** con cálculo automático de `totalPrice` (`tour.price * people`) y selección de fecha según tour.
- **Rutas protegidas** (Customers, Tours, Reservations) — requieren estar logueado.
- **UI** con Material UI y **animaciones** (Framer Motion).
- **Manejo de errores** con `Snackbar/Alert`.
- **Validaciones** en formularios.
- **Modal de detalle** (Customers y Tours) y **formularios** para crear/editar.

---

## 🛠️ Stack
- **React** + **Vite**
- **Material UI** (MUI) + **@mui/x-date-pickers** + **dayjs**
- **Axios** (interceptor con JWT)
- **React Router**
- **Framer Motion**
- **ESLint** (opcional)

---

## 🔧 Requisitos previos
- Node.js 18+
- Backend corriendo y accesible (`/api/auth`, `/api/customers`, `/api/tours`, `/api/reservations`)

---

## ⚙️ Variables de entorno
Crea un archivo **.env** en la raíz del proyecto con:

```bash
VITE_API_URL=http://localhost:5000/api
# Ejemplo producción:
# VITE_API_URL=https://backend-tour-reservation-system.vercel.app/api
```

> **Importante:** El backend debe permitir CORS para el origin del frontend (localhost:5173 o tu dominio de Vercel).

---

## ▶️ Scripts
```bash
npm install       # instalar dependencias
npm run dev       # modo desarrollo (http://localhost:5173)
npm run build     # compilar para producción (carpeta dist/)
npm run preview   # previsualizar build local
```

---

## 🧭 Estructura del proyecto (resumen)
```
src/
├─ api/
│  └─ index.js             # axios instance + interceptors (Bearer token)
├─ components/
│  ├─ CustomerDetailModal.jsx
│  ├─ CustomerForm.jsx
│  ├─ TourDetailModal.jsx
│  ├─ TourForm.jsx
│  └─ ReservationDetailModal.jsx
├─ context/
│  └─ AuthContext.jsx      # login/logout, user state, token storage
├─ pages/
│  ├─ HomePage.jsx
│  ├─ LoginPage.jsx
│  ├─ CustomersPage.jsx
│  ├─ ToursPage.jsx
│  └─ ReservationsPage.jsx
├─ routes/
│  └─ ProtectedRoute.jsx   # wrapper para rutas protegidas
├─ App.jsx
└─ main.jsx
```

**Puntos clave ya implementados en tu proyecto:**
- `AuthContext` guarda el token en `localStorage` y expone `user`, `login`, `logout`.
- `api/index.js` agrega `Authorization: Bearer <token>` si existe.
- `ReservationsPage` usa paginación (`page`, `limit`) y muestra `totalPrice`.
- `TourForm` maneja `availableDates: [Date]`; `TourDetailModal` muestra/gestiona fechas.
- Estilo consistente con MUI (sombreado, bordes redondeados, etc.).

---

## 🔐 Autenticación
- Tras `login`, se guarda el token en `localStorage`.
- Las páginas **Customers**, **Tours** y **Reservations** están protegidas con `ProtectedRoute`.
- El interceptor de Axios agrega el token automáticamente a cada request saliente.

---

## 🌐 Configurar el cliente Axios
`src/api/index.js` (ejemplo):
```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 🧪 Flujo sugerido de pruebas
1. **Register/Login** con un usuario de prueba.
2. Crear 1–2 **Customers** y validar paginación/listado.
3. Crear 1–2 **Tours** con `availableDates` y `isActive=true`.
4. Crear **Reservation**: seleccionar **tour**, **fecha** (del tour) y **people** → validar `totalPrice`.
5. Editar/Eliminar en cada módulo y verificar feedback visual (Snackbars).

---

## ☁️ Despliegue en Vercel
1. Importa el repositorio en Vercel.
2. **Build Command:** `vite build`  
   **Output Directory:** `dist`
3. Variables de entorno → `VITE_API_URL=https://<tu-backend>.vercel.app/api`
4. Redeploy. Verifica CORS en el backend para tu dominio Vercel.

> Si la pantalla sale en blanco en producción: suele ser por `VITE_API_URL` incorrecta o CORS.

---

## 🧰 Troubleshooting
- **CORS bloqueado**: agrega el dominio del frontend al `origin` del backend (`cors()`).
- **Token no agregado**: revisa el interceptor y `localStorage.getItem("token")`.
- **DatePickers no renderizan**: asegúrate de envolver con `LocalizationProvider` y `AdapterDayjs`.
- **Pantalla en blanco (Vercel)**: revisa consola → network → `VITE_API_URL` y 404/500 del backend.
- **401 Unauthorized**: el token expiró o no se envió; vuelve a iniciar sesión.

---

## 🗺️ Roadmap (ideas)
- Refresh token y expiración silenciosa.
- Búsqueda/filtrado por nombre/fecha/precio.
- Skeleton loaders y estado offline.
- Internacionalización (i18n).

---

## 📄 Licencia
MIT

# Frontend env example
# Desarrollo
VITE_API_URL=http://localhost:5000/api

# Producción
# VITE_API_URL=https://backend-tour-reservation-system.vercel.app/api
