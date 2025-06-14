# Frontend Using Typescript.

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
## add the following in the.env file

```bash
EXPO_PUBLIC_SUPABASE_ANON_KEY= "your super base anon key
EXPO_PUBLIC_SUPABASE_URL ="your superbase url"
```

## Sql 
```bash
/*
  # Initial FixerHub Database Schema

  1. New Tables
    - `users` - User profiles for both clients and professionals
    - `categories` - Service categories (Electrical, Plumbing, etc.)
    - `sub_categories` - Specific services within categories
    - `professional_documents` - Document verification for professionals
    - `professional_jobs` - Services offered by professionals
    - `job_sub_category_pricing` - Pricing for specific sub-services
    - `messages` - Communication between users
    - `reviews` - Client reviews for professionals

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure users can only access their own data

  3. Features
    - User authentication with roles (client/professional)
    - Email verification system
    - Document verification for professionals
    - Hierarchical service categories with pricing
    - Geolocation support for location-based services
    - Messaging system between clients and professionals
    - Review and rating system
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username text NOT NULL,
  email text UNIQUE NOT NULL,
  phone_number text NOT NULL,
  role text CHECK (role IN ('client', 'professional')) DEFAULT 'client',
  is_verified boolean DEFAULT false,
  location jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Sub-categories table
CREATE TABLE IF NOT EXISTS sub_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Professional documents table
CREATE TABLE IF NOT EXISTS professional_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  national_id_document_url text,
  work_clearance_document_url text,
  verification_status text CHECK (verification_status IN ('pending', 'verified', 'failed')) DEFAULT 'pending',
  verification_otp text,
  verified_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Professional jobs table
CREATE TABLE IF NOT EXISTS professional_jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  category_price decimal(10,2) DEFAULT 0,
  location jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Job sub-category pricing table
CREATE TABLE IF NOT EXISTS job_sub_category_pricing (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid REFERENCES professional_jobs(id) ON DELETE CASCADE,
  sub_category_id uuid REFERENCES sub_categories(id) ON DELETE CASCADE,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES users(id) ON DELETE CASCADE,
  message_text text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid REFERENCES users(id) ON DELETE CASCADE,
  professional_id uuid REFERENCES users(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_sub_category_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can read professional profiles" ON users
  FOR SELECT USING (role = 'professional' AND is_verified = true);

-- Categories policies (public read)
CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read sub-categories" ON sub_categories
  FOR SELECT USING (true);

-- Professional documents policies
CREATE POLICY "Professionals can manage own documents" ON professional_documents
  FOR ALL USING (auth.uid() = user_id);

-- Professional jobs policies
CREATE POLICY "Professionals can manage own jobs" ON professional_jobs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read active professional jobs" ON professional_jobs
  FOR SELECT USING (true);

-- Job sub-category pricing policies
CREATE POLICY "Professionals can manage own job pricing" ON job_sub_category_pricing
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM professional_jobs 
      WHERE professional_jobs.id = job_sub_category_pricing.job_id 
      AND professional_jobs.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can read job pricing" ON job_sub_category_pricing
  FOR SELECT USING (true);

-- Messages policies
CREATE POLICY "Users can read own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Reviews policies
CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Clients can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = client_id);

-- Insert default categories
INSERT INTO categories (name, description, icon) VALUES
  ('Electrical', 'Electrical repairs and installations', 'zap'),
  ('Plumbing', 'Plumbing services and repairs', 'droplets'),
  ('Repair', 'General repair services', 'wrench'),
  ('Beauty', 'Beauty and personal care services', 'scissors'),
  ('Cleaning', 'Cleaning and maintenance services', 'sparkles'),
  ('Home', 'Home improvement and maintenance', 'home'),
  ('Automotive', 'Car repair and maintenance', 'car'),
  ('Technology', 'Tech support and device repair', 'smartphone')
ON CONFLICT DO NOTHING;

-- Insert default sub-categories for Electrical
DO $$
DECLARE
  electrical_id uuid;
  plumbing_id uuid;
  repair_id uuid;
BEGIN
  SELECT id INTO electrical_id FROM categories WHERE name = 'Electrical';
  SELECT id INTO plumbing_id FROM categories WHERE name = 'Plumbing';
  SELECT id INTO repair_id FROM categories WHERE name = 'Repair';

  -- Electrical sub-categories
  INSERT INTO sub_categories (category_id, name, description) VALUES
    (electrical_id, 'Fix Light Switch', 'Repair or replace light switches'),
    (electrical_id, 'Install Ceiling Fan', 'Install new ceiling fans'),
    (electrical_id, 'Electrical Outlet Repair', 'Fix or install electrical outlets'),
    (electrical_id, 'Wiring Installation', 'New electrical wiring installation'),
    (electrical_id, 'Circuit Breaker Repair', 'Fix circuit breaker issues');

  -- Plumbing sub-categories
  INSERT INTO sub_categories (category_id, name, description) VALUES
    (plumbing_id, 'Leak Repair', 'Fix water leaks'),
    (plumbing_id, 'Drain Cleaning', 'Clean blocked drains'),
    (plumbing_id, 'Toilet Installation', 'Install new toilets'),
    (plumbing_id, 'Pipe Installation', 'Install new plumbing pipes'),
    (plumbing_id, 'Water Heater Repair', 'Fix water heater issues');

  -- Repair sub-categories
  INSERT INTO sub_categories (category_id, name, description) VALUES
    (repair_id, 'Appliance Repair', 'Fix household appliances'),
    (repair_id, 'Furniture Repair', 'Repair damaged furniture'),
    (repair_id, 'Door Repair', 'Fix doors and locks'),
    (repair_id, 'Window Repair', 'Repair windows and frames'),
    (repair_id, 'General Maintenance', 'General household maintenance');
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_documents_updated_at BEFORE UPDATE ON professional_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_jobs_updated_at BEFORE UPDATE ON professional_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```
