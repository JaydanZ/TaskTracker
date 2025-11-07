# TaskTracker
A task tracker WebApp where users can create, update, and visualize tasks

## Live Site
Live site can be found here: https://tasktrackerfrontend.onrender.com

## Endpoints
- `/tasks`: all task related tasks
- `/stats`: returns all stats related to user
- `/login`: login user
- `/register`: register user
- `/logout`: logout user
- `/me`: user data

## Credentials
- Feel free to create a new user or use the provided one down below:
`User ID: jaydantest`
`Password: test123`

## Architechture
- Front-end: Vite, React.js, Typescript, Tanstack Router, Tanstack Query, pnpm
- Back-end: Node.js, Express.js, Typescript, supabase
- Hosted on render
- Containerized using docker

## Setup
In case project needs to be run locally:

### Reminder
The back-end uses Supabase (Postgres DB), so you will need to either use my created supabase DB (credentials provided in email) or create a supabase account > create project > SQL Editor > Run the following SQL code along with supplying the `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY` ENV variables

Users Table:
```
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  tasksArray TEXT array,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
-- Drop old policies
DROP POLICY IF EXISTS "Service role has full access to users" ON users;

-- Create separate policies for each operation
CREATE POLICY "Enable insert for service role"
  ON users FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Enable read for service role"
  ON users FOR SELECT TO service_role
  USING (true);

CREATE POLICY "Enable update for service role"
  ON users FOR UPDATE TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for service role"
  ON users FOR DELETE TO service_role
  USING (true);

```

Tasks Table:
```
-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable insert for service role" ON tasks;
DROP POLICY IF EXISTS "Enable read for service role" ON tasks;
DROP POLICY IF EXISTS "Enable update for service role" ON tasks;
DROP POLICY IF EXISTS "Enable delete for service role" ON tasks;

-- Create policies for service role
CREATE POLICY "Enable insert for service role"
  ON tasks FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Enable read for service role"
  ON tasks FOR SELECT TO service_role
  USING (true);

CREATE POLICY "Enable update for service role"
  ON tasks FOR UPDATE TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for service role"
  ON tasks FOR DELETE TO service_role
  USING (true);
```

### Steps
- Clone repo onto computer
- In root directory of project, create a .env file with these fields:
```
JWT_SECRET={YOUR PROVIDED JWT SECRET KEY}
SUPABASE_URL={URL TO YOUR SUPABASE DB OR USE MY PROVIDED URL FROM EMAIL}
SUPABASE_SERVICE_ROLE_KEY={KEY TO SUPABASE DB OR USE MY PROVIDED URL FROM EMAIL}
```
- Open terminal in root dir, run `docker-compose build --no-cache`
- Then run `docker-compose up`
