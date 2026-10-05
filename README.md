# OtaWay Frontend

Aplicación web y cliente Capacitor de OtaWay para explorar turismo, gastronomía y cultura de Otavalo. Construido con Next.js 16, React 19 y TypeScript.

## Ejecutar

```bash
npm ci
npm run dev
```

Abre `http://localhost:3000`. Las llamadas bajo `/api/*` se reescriben al backend independiente en `http://localhost:3001`.

Clona `otaway-backend` en una carpeta hermana, configura su `.env` y levanta sus servicios antes de probar autenticación o datos:

```bash
cd ../otaway-backend
cp .env.example .env
docker compose up -d
yarn dev --port 3001
```

El CRUD de lugares requiere que las migraciones pendientes hayan sido revisadas y aplicadas, y que el permiso `tourist-places.manage` esté concedido a la cuenta administradora. No ejecutes migraciones a ciegas en una base con datos.

## Comandos

```bash
npm run typecheck
npm run lint
npm run build
npm run start
```

## Android con emulador

OtaWay conserva el servidor Next.js: `pages/api` y las reescrituras al backend no son compatibles con exportación estática. Capacitor carga el frontend desde el servidor de desarrollo y `webDir: out` no se genera ni se copia en este modo.

1. En una terminal, desde `frontend/`, inicia Next en una dirección accesible para el emulador:

	```bash
	npm run dev:android
	```

2. Abre el proyecto Android en Android Studio:

	```bash
	npx cap open android
	```

En este modo no ejecutes `npx cap sync`: los cambios de Next.js se sirven desde el servidor remoto en `3000` y no existe una exportación estática en `out`. El diagnóstico de Capacitor puede advertir que falta `index.html` en los assets locales; es esperado mientras `server.url` apunte al servidor remoto.

El emulador Android usa `http://10.0.2.2:3000` para llegar al servidor del equipo. Next reescribe `/api/*` a `http://localhost:3001`, así que el backend debe ejecutarse en el equipo en ese puerto para probar autenticación. En un dispositivo físico, apunta `server.url` en `android/app/src/main/assets/capacitor.config.json` a la IP LAN del equipo y el puerto `3000`; restaura `http://10.0.2.2:3000` al volver al emulador. La configuración actual del emulador no se modificó.

Esta configuración HTTP remota es solo de desarrollo. No genera una app autónoma ni de producción; OtaWay necesita un servidor Next porque su API y sus rewrites no se pueden empaquetar como exportación estática. Android Studio requiere Android SDK Platform-Tools (`adb`) y una imagen de sistema de emulador instalados desde SDK Manager.

## Rutas principales

- `/`: inicio y contenido destacado.
- `/lugares` y `/lugares/[id]`: catálogo y detalle consultados desde PostgreSQL por la API.
- `/gastronomia`: platos y bebidas tradicionales.
- `/eventos`: referencias culturales, no agenda vigente.
- `/favoritos`: lugares guardados en el navegador.
- `/login` y `/register`: formularios conectados a las rutas existentes del backend.
- `/admin/tourist-places`: CRUD conectado a PostgreSQL; las escrituras requieren sesión Bearer y permiso `tourist-places.manage`.

Los lugares turísticos se consultan al backend y no usan datos de respaldo. Gastronomía y celebraciones son contenido editorial local; los favoritos guardan IDs de lugares en el navegador.

El frontend no necesita variables de entorno para desarrollo. No subas `.env`, credenciales Android ni artefactos de build. Capacitor utiliza el servidor Next de desarrollo; consulta la sección Android antes de ejecutar el cliente móvil.

## Estructura

```text
src/pages/       Rutas web
src/features/    Catálogo turístico y autenticación
src/layouts/     Layouts compartidos
src/styles/      Estilos responsive
public/images/   Imágenes turísticas locales
```
