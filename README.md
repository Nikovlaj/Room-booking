# 🏢 Bokningsplattform för Coworking Space

Detta projekt är en backend byggd i **Node.js** och **Express.js** för att hantera bokningar av arbetsplatser och konferensrum. Systemet hanterar användare med olika roller, rumsbokningar, realtidsnotifieringar och datavalidering.

---

## 🚀 Funktioner

### 👥 Användarroller

- **User**

  - Registrera och logga in
  - Skapa, uppdatera och ta bort sina egna bokningar
  - Se sina egna bokningar

- **Admin**
  - Full åtkomst till allt ovan
  - Skapa, uppdatera och ta bort rum
  - Se alla användare och bokningar
  - Ta bort användare

### 🧩 Funktionalitet

- JWT-baserad autentisering och auktorisering
- Rollbaserad åtkomstkontroll (RBAC)
- Realtidsnotifieringar via WebSocket (Socket.io)
- Kontroll för dubbelbokning av rum
- Felhantering och loggning
- Caching av ofta använda data (t.ex. rum)

---

## 🛠️ Teknikstack

- **Node.js** & **Express.js** – Backend
- **MongoDB** & **Mongoose** – Databas
- **JWT & bcrypt** – Autentisering
- **Socket.io** – Realtidsnotifieringar
- **node-cache** – Caching
- **dotenv** – Miljövariabler

---

## 📦 Installation

1. **Klona projektet**
   ```bash
   git clone https://github.com/Nikovlaj/Room-booking
   cd ditt-repo
   ```
2. **Installera beroenden**
   npm install

3. **Skapa en env.-fil**
   PORT=5000
   DB_URL=mongodb://localhost:27017/booking
   JWT_secret=dinhemliganyckel

4. **Starta Projektet**

```bash
  npm run dev
```

## 📑 API Endpoints

### 🔐 Autentisering

| Metod | Endpoint        | Beskrivning               | Skyddad |
| ----- | --------------- | ------------------------- | ------- |
| POST  | `/api/register` | Registrera ny användare   | ❌      |
| POST  | `/api/login`    | Logga in och få JWT-token | ❌      |

---

### 🏠 Rumshantering (endast Admin)

| Metod  | Endpoint         | Beskrivning        | Skyddad | Roller      |
| ------ | ---------------- | ------------------ | ------- | ----------- |
| POST   | `/api/rooms`     | Skapa ett nytt rum | ✅      | Admin       |
| GET    | `/api/rooms`     | Hämta alla rum     | ✅      | User, Admin |
| PUT    | `/api/rooms/:id` | Uppdatera ett rum  | ✅      | Admin       |
| DELETE | `/api/rooms/:id` | Ta bort ett rum    | ✅      | Admin       |

---

### 📅 Bokningar

| Metod  | Endpoint            | Beskrivning                                    | Skyddad | Roller      |
| ------ | ------------------- | ---------------------------------------------- | ------- | ----------- |
| POST   | `/api/bookings`     | Skapa en ny bokning                            | ✅      | User, Admin |
| GET    | `/api/bookings`     | Hämta egna bokningar (User) eller alla (Admin) | ✅      | User, Admin |
| PUT    | `/api/bookings/:id` | Uppdatera bokning (skaparen eller Admin)       | ✅      | User, Admin |
| DELETE | `/api/bookings/:id` | Ta bort bokning (skaparen eller Admin)         | ✅      | User, Admin |

---

### 📡 Notifieringar

Realtidsnotifieringar sker via **WebSocket (Socket.io)**:

- När en bokning skapas
- När en bokning uppdateras
- När en bokning tas bort

👨‍💻 Skapare
Nikola Vlajkovic
https://github.com/Nikovlaj
