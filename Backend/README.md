# 🛠️ FixerHub Backend API Documentation

This document provides a comprehensive guide for interacting with the **FixerHub backend API**, designed to support a **React Native frontend** for user **authentication** and **ID verification**.

---

## 🔗 Base URLs

| Environment | URL |
|------------|-----|
| Local       | `http://localhost:3000` |
| Development (ngrok) | `https://5944-196-190-62-25.ngrok-free.app` |

All API endpoints are prefixed with `/api`.

---

## 📦 Prerequisites

- **HTTP Client:** Use `fetch` or `axios` in React Native.
- **Authentication:** JWT token required for protected endpoints (e.g., `/verify-id`).
- **Environment Variables:**

```env
EMAIL_USER=daniel.ayele@anbesg.com
EMAIL_PASS=lonjvqsuqrbdaled
JWT_SECRET=your-secret-key
```

- **Dependencies:**

```bash
npm install @supabase/supabase-js bcryptjs jsonwebtoken joi nodemailer tesseract.js
```

---

## 🗃️ Database Tables (SQL)

### `users`

```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'professional')),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_otp VARCHAR(6),
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### `professional_documents`

```sql
CREATE TABLE professional_documents (
  document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  national_id_document_url TEXT,
  verification_status VARCHAR(20) CHECK (verification_status IN ('pending', 'verified', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 Endpoints

### 1. **User Signup**

- **Method:** `POST`
- **Endpoint:** `/api/signup`
- **Description:** Register a new user and send an OTP via email.

#### 📨 Request Body
```json
{
  "username": "string (min 3, max 255)",
  "email": "string (valid email)",
  "phone_number": "string (optional)",
  "password": "string (min 6)",
  "role": "client or professional"
}
```

#### ✅ Example (React Native)

```js
fetch('https://5944-196-190-62-25.ngrok-free.app/api/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'Ayele',
    email: 'ayele@example.com',
    phone_number: '0940685349',
    password: 'password123',
    role: 'client'
  }),
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
```

#### 🔁 Responses

- `201 Created`:  
  ```json
  { "message": "Client registered. Verify your email." }
  ```
- `400 Bad Request`:  
  ```json
  { "error": "Validation error message" }
  ```

---

### 2. **Verify Email**

- **Method:** `POST`
- **Endpoint:** `/api/verify-email`
- **Description:** Confirm email using OTP.

#### 📨 Request Body
```json
{ "otp": "123456" }
```

#### ✅ Example

```js
fetch('https://5944-196-190-62-25.ngrok-free.app/api/verify-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ otp: '123456' })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
```

#### 🔁 Responses

- `200 OK`:
  ```json
  { "message": "Email verified successfully", "token": "jwt-token" }
  ```
- `400 Bad Request`:
  ```json
  { "error": "Invalid OTP" }
  ```

---

### 3. **User Login**

- **Method:** `POST`
- **Endpoint:** `/api/login`
- **Description:** Authenticate a user and return a JWT.

#### 📨 Request Body
```json
{
  "email": "ayele@example.com",
  "password": "password123"
}
```

#### ✅ Example

```js
fetch('https://5944-196-190-62-25.ngrok-free.app/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'ayele@example.com',
    password: 'password123'
  })
})
.then(res => res.json())
.then(data => {
  console.log(data);
  // Store token using AsyncStorage
})
.catch(console.error);
```

#### 🔁 Responses

- `200 OK`:  
  ```json
  { "token": "jwt-token", "redirect": "/verify-id" }
  ```
- `400 Bad Request`:  
  ```json
  { "error": "Invalid credentials" }
  ```

---

### 4. **Verify ID**

- **Method:** `POST`
- **Endpoint:** `/api/verify-id`
- **Description:** Upload and verify national ID using OCR. Requires token.

#### 📨 Request Body
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

#### ✅ Example (React Native)

```js
const base64Image = "your_base64_string_here";
fetch('https://5944-196-190-62-25.ngrok-free.app/api/verify-id', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${yourToken}`,
  },
  body: JSON.stringify({
    image: `data:image/jpeg;base64,${base64Image}`,
  })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
```

#### 🔁 Responses

- `200 OK`:  
  ```json
  { "message": "Verification Successful" }
  ```
- `400 Bad Request`:  
  ```json
  { "message": "Image and user ID are required" }
  ```
- `401 Unauthorized`:  
  ```json
  { "message": "Invalid token" }
  ```
- `500 Server Error`:  
  ```json
  { "message": "Error processing image" }
  ```

---

## 📌 Notes & Best Practices

- **Token Management:** Store JWT securely (e.g., using `AsyncStorage`).
- **Image Upload:** Use `react-native-image-picker` to get base64 image for upload.
- **Environment Config:** Use `.env` for sensitive keys and load with `dotenv`.
- **Error Handling:** Always catch and display user-friendly error messages in the frontend.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install @supabase/supabase-js bcryptjs jsonwebtoken joi nodemailer tesseract.js

# Run backend server
node server.js
```
