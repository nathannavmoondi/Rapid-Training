-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  topics JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  CustomerID SERIAL PRIMARY KEY,
  CompanyName VARCHAR(100) NOT NULL,
  ContactName VARCHAR(100),
  ContactTitle VARCHAR(100),
  Address VARCHAR(200),
  City VARCHAR(100),
  Region VARCHAR(100),
  PostalCode VARCHAR(20),
  Country VARCHAR(100),
  Phone VARCHAR(50),
  Fax VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON skills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO skills (title, category, topics) VALUES 
('JavaScript', 'Programming', '["ES6+", "Async/Await", "DOM", "Event Loop"]'),
('React', 'Frontend', '["Hooks", "Components", "State Management", "Router"]'),
('SQL', 'Database', '["Queries", "Joins", "Indexes", "Transactions"]')
ON CONFLICT (title) DO NOTHING;

-- Insert sample data
INSERT INTO customers (CompanyName, ContactName, ContactTitle, City, Country, Phone) VALUES 
('Alfreds Futterkiste', 'Maria Anders', 'Sales Representative', 'Berlin', 'Germany', '030-0074321'),
('Ana Trujillo Emparedados', 'Ana Trujillo', 'Owner', 'México D.F.', 'Mexico', '(5) 555-4729'),
('Antonio Moreno Taquería', 'Antonio Moreno', 'Owner', 'México D.F.', 'Mexico', '(5) 555-3932')
ON CONFLICT (CustomerID) DO NOTHING;
