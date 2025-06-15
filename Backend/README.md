FixerHub Backend API Documentation
This document provides a comprehensive guide to the HTTP requests required to interact with the FixerHub backend API. The API is designed to support a React Native frontend for user authentication and ID verification. All endpoints are prefixed with /api.
Prerequisites

Base URL: https://193e-196-190-62-54.ngrok-free.app  || http://localhost:3000 (or your deployed server URL)
HTTP Client: Use Fetch API or Axios in React Native
Authentication: JWT tokens are required for protected endpoints (e.g., /verify-id)
Dependencies: Ensure supabase, bcryptjs, jsonwebtoken, joi, nodemailer, and tesseract.js are installed

## Update Tables

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

CREATE TABLE professional_documents (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    national_id_document_url TEXT,
    verification_status VARCHAR(20) CHECK (verification_status IN ('pending', 'verified', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

### Environment Variable (.env)
EMAIL_USER=daniel.ayele@anbesg.com
EMAIL_PASS=lonjvqsuqrbdaled
JWT_SECRET=your-secret-key



Endpoints
1. User Signup

Method: POST
Endpoint: /api/signup
Description: Registers a new user (client or professional) and sends a verification OTP via email.
Request Body:{
  "username": "string (min 3, max 255)",
  "email": "string (valid email)",
  "phone_number": "string (10 digits, optional)",
  "password": "string (min 6)",
  "role": "string (client or professional)"
}


Example Request (Fetch in React Native):fetch('https://193e-196-190-62-54.ngrok-free.app/api/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'Ayele',
    email: 'ayele@example.com',
    phone_number: '0940685349',
    password: 'password123',
    role: 'client',
  }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));


Response:
Success (201): {"message": "Client registered. Verify your email."}
Error (400): {"error": "Validation error message"}



2. Verify Email

Method: POST
Endpoint: /api/verify-email
Description: Verifies the user's email using the OTP sent during signup.
Request Body:{
  "otp": "string (6 digits)"
}


Example Request (Fetch in React Native):fetch('https://193e-196-190-62-54.ngrok-free.app/api/verify-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    otp: '123456',
  }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));


Response:
Success (200): {"message": "Email verified successfully", "token": "jwt-token"}
Error (400): {"error": "Invalid OTP"}



3. User Login

Method: POST
Endpoint: /api/login
Description: Authenticates a user and returns a JWT token.
Request Body:{
  "email": "string (valid email)",
  "password": "string (min 6)"
}


Example Request (Fetch in React Native):fetch('https://193e-196-190-62-54.ngrok-free.app/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'ayele@example.com',
    password: 'password123',
  }),
})
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Store token securely (e.g., AsyncStorage)
  })
  .catch(error => console.error('Error:', error));


Response:
Success (200): {"token": "jwt-token", "redirect": "/verify-id"}
Error (400): {"error": "Invalid credentials"}



4. Verify ID

Method: POST
Endpoint: /api/verify-id
Description: Verifies the user's ID document by comparing extracted text with their username. Requires a valid JWT token in the Authorization header.
Request Body:{
  "image": "string (base64-encoded image, add your base64 image here)"
}


Example Request (Fetch in React Native):// Assume image is converted to base64 (e.g., using react-native-image-picker)
const base64Image = 'add your base64 image here'; // Replace with actual base64
fetch('https://193e-196-190-62-54.ngrok-free.app/api/verify-id', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${yourToken}`, // Replace with stored token
  },
  body: JSON.stringify({
    image: `data:image/jpeg;base64,${base64Image}`,
  }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));


Response:
Success (200): {"message": "Verification Successful"} or {"message": "Verification Failed"}
Error (400): {"message": "Image and user ID are required"}
Error (401): {"message": "Invalid token"}
Error (500): {"message": "Error processing image"}



Notes

Token Management: Store the JWT token securely using AsyncStorage in React Native after login or email verification. Include it in the Authorization header as Bearer ${token} for protected endpoints.
Image Handling: Use a library like react-native-image-picker to convert images to base64 before sending to /verify-id.
Environment Variables: In production, set JWT_SECRET, EMAIL_USER, and EMAIL_PASS in a .env file and use dotenv to load them.
Error Handling: Implement robust error handling in React Native to display user-friendly messages.

Setup

Install dependencies: npm install @supabase/supabase-js bcryptjs jsonwebtoken joi nodemailer tesseract.js
Configure Supabase with the provided URL and key.
Set up email service (e.g., Gmail) with the credentials in .env.
Run the server: node server.js

