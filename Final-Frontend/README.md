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
-- Table: users
CREATE TABLE users (
  user_id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('client', 'professional') NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: professional_documents
CREATE TABLE professional_documents (
  document_id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  national_id_document_url VARCHAR(255),
  work_clearance_document_url VARCHAR(255),
  verification_status ENUM('pending', 'verified', 'failed') DEFAULT 'pending',
  verification_otp VARCHAR(6),
  verified_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Table: categories
CREATE TABLE categories (
  category_id VARCHAR(255) PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: sub_categories
CREATE TABLE sub_categories (
  sub_category_id VARCHAR(255) PRIMARY KEY,
  category_id VARCHAR(255),
  sub_category_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Table: professional_jobs
CREATE TABLE professional_jobs (
  job_id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  category_id VARCHAR(255),
  category_price DECIMAL(10, 2),
  location VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Table: job_sub_category_pricing
CREATE TABLE job_sub_category_pricing (
  id VARCHAR(255) PRIMARY KEY,
  job_id VARCHAR(255),
  sub_category_id VARCHAR(255),
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES professional_jobs(job_id) ON DELETE CASCADE,
  FOREIGN KEY (sub_category_id) REFERENCES sub_categories(sub_category_id) ON DELETE CASCADE
);

-- Table: messages
CREATE TABLE messages (
  message_id VARCHAR(255) PRIMARY KEY,
  sender_id VARCHAR(255),
  receiver_id VARCHAR(255),
  message_text TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Table: reviews
CREATE TABLE reviews (
  review_id VARCHAR(255) PRIMARY KEY,
  client_id VARCHAR(255),
  professional_id VARCHAR(255),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (professional_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Table: email_verifications
CREATE TABLE email_verifications (
  email VARCHAR(255) PRIMARY KEY,
  otp VARCHAR(6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

