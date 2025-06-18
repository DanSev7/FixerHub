-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop the table if it exists to ensure clean state
DROP TABLE IF EXISTS users;

-- Create the users table with the correct schema
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'professional')),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_otp VARCHAR(6),
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_otp ON users(verification_otp);
CREATE INDEX idx_users_is_verified ON users(is_verified);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 