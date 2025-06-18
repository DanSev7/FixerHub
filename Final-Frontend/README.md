# Final Frontend Using Typescript Final code.

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd FixerHub-Backend
```

2. Install dependencies:
```bash
npm install
```

3. Run
```bash
npm run dev
```
or
```bash
npx expo start
```
## add the following in the .env file

```bash
EXPO_PUBLIC_SUPABASE_ANON_KEY= "your-anon-key"
EXPO_PUBLIC_SUPABASE_URL ="your-supabase-url"
```

## Sql 
```bash
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables (if needed, backup data first)
DROP TABLE IF EXISTS reviews, messages, job_sub_category_pricing, professional_jobs, professional_documents, sub_categories, categories, email_verifications, users CASCADE;

-- Table: users
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'professional')),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_otp VARCHAR(6),
    password_hash VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: email_verifications
CREATE TABLE email_verifications (
    email VARCHAR(255) PRIMARY KEY,
    otp VARCHAR(6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: categories
CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(255) NOT NULL UNIQUE, -- Added UNIQUE constraint
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: sub_categories
CREATE TABLE sub_categories (
    sub_category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL,
    sub_category_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Table: professional_jobs
CREATE TABLE professional_jobs (
    job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    category_id UUID NOT NULL,
    category_price DECIMAL(10, 2) NOT NULL,
    location TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_updated_at
BEFORE UPDATE ON professional_jobs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Table: job_sub_category_pricing
CREATE TABLE job_sub_category_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL,
    sub_category_id UUID NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES professional_jobs(job_id) ON DELETE CASCADE,
    FOREIGN KEY (sub_category_id) REFERENCES sub_categories(sub_category_id) ON DELETE CASCADE
);

-- Table: messages
CREATE TABLE messages (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    message_text TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Table: reviews
CREATE TABLE reviews (
    review_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    professional_id UUID NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (professional_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Table: professional_documents
CREATE TABLE professional_documents (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    national_id_document_url TEXT,
    verification_status VARCHAR(20) CHECK (verification_status IN ('pending', 'verified', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Insert default categories
INSERT INTO categories (category_id, category_name)
SELECT uuid_generate_v4(), category_name
FROM (VALUES
    ('Plumbing'),
    ('Electrical'),
    ('Carpentry'),
    ('Painting'),
    ('Cleaning'),
    ('Gardening'),
    ('HVAC'),
    ('Roofing'),
    ('Masonry'),
    ('Appliance Repair')
) AS categories(category_name)
ON CONFLICT (category_name) DO NOTHING;

```

## Integrate the DATABASE using the above code. 


## Build 

1. Step 1 add package.json

   
```bash
{
  "scripts": {
    "start": "expo start",
    "build": "expo build:web",       
    "android": "expo run:android",
    "ios": "expo run:ios"
  }
}
```
2. Running the Build Command

```bash
npm run build
```
or Using Expo Build Commands

1. Build for Web:

```bash
expo build:web
```

2. Build APK (Android) or IPA (iOS) — older Expo CLI:

```bash
expo build:android
expo build:ios
```

3. Build using EAS Build

   1. Install EAS CLI globally if not installed:
  
 ```bash
npm install -g eas-cli
```

  2. Log in to your Expo account:

```bash
eas login
```

  3. Build for Android:

```bash
eas build -p android
```

  4. Build for iOS:

```bash
eas build -p ios
```

