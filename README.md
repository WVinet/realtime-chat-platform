# Realtime Chat Platform

Proyecto Full Stack desarrollado como desafío de 5 días, que permite la comunicación en tiempo real entre una aplicación web y una aplicación móvil Android, incorporando autenticación segura y un chatbot integrado.

## Objetivo

Desarrollar una plataforma de mensajería en tiempo real donde usuarios autenticados puedan intercambiar mensajes entre una aplicación web y una aplicación móvil, utilizando WebSockets para comunicación instantánea.

## Tecnologías

### Backend

* NestJS
* TypeScript
* Socket.IO
* JWT Authentication
* PostgreSQL
* Prisma ORM (o TypeORM)
* Swagger
* Docker

### Frontend Web

* React
* TypeScript
* Vite
* Axios
* Socket.IO Client

### Aplicación Móvil

* Android
* Kotlin
* Retrofit
* WebSocket Client
* MVVM

### Base de Datos

* PostgreSQL

## Funcionalidades

### Autenticación

* Registro de usuarios
* Inicio de sesión
* JWT Authentication
* Protección de rutas

### Chat en Tiempo Real

* Comunicación Web ↔ Web
* Comunicación Web ↔ Android
* Comunicación Android ↔ Android
* Mensajes instantáneos mediante WebSockets

### Chatbot

* Respuestas automáticas
* Detección de comandos básicos
* Integración con el sistema de chat

### Historial

* Persistencia de mensajes
* Consulta de conversaciones anteriores

## Arquitectura

```text
┌─────────────────┐
│ React Frontend  │
└────────┬────────┘
         │
         │ HTTP / WebSocket
         │
┌────────▼────────┐
│     NestJS      │
│     Backend     │
└────────┬────────┘
         │
 ┌───────┼────────┐
 │       │        │
 │ Auth  │ Chat   │
 │ JWT   │ Socket │
 │       │ Bot    │
 └───────┼────────┘
         │
         ▼
   PostgreSQL
         ▲
         │
         │ HTTP / WebSocket
         │
┌────────┴────────┐
│ Android Kotlin  │
└─────────────────┘
```

## Estructura del Proyecto

```text
realtime-chat-platform/
│
├── backend/
│   ├── src/
│   ├── test/
│   └── package.json
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── mobile/
│
├── docs/
│
├── docker-compose.yml
│
└── README.md
```

## Instalación

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Android

Abrir la carpeta del proyecto móvil utilizando Android Studio.

## Estado del Proyecto

### Día 1

* [ ] Configuración del repositorio
* [ ] Configuración Backend NestJS
* [ ] Configuración Frontend React
* [ ] Configuración Android Kotlin
* [ ] Configuración PostgreSQL

### Día 2

* [ ] Registro de usuarios
* [ ] Login
* [ ] JWT

### Día 3

* [ ] Chat en tiempo real

### Día 4

* [ ] Persistencia de mensajes
* [ ] Chatbot

### Día 5

* [ ] Pruebas
* [ ] Documentación
* [ ] Deploy local con Docker

## Autor

Wilfred Vinet
Ingeniería en Informática
Proyecto académico y de portafolio.
