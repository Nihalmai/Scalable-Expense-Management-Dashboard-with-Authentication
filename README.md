# Scalable Expense Management Dashboard

A full stack expense tracking web application with secure authentication and a protected user dashboard.

## Tech Stack
Frontend: React.js  
Backend: Node.js, Express.js  
Database: MongoDB  
Authentication: JWT  

## Features
- User signup & login with JWT authentication
- Protected dashboard routes
- Add, edit, delete expenses
- User specific data storage
- Search and filter expenses
- User profile display
- Secure password hashing
- RESTful API integration

## How to Run Locally

Backend:
cd backend   
npm run dev  

Frontend:
cd frontend   
npm start  

## Security Features
- JWT based authentication
- Password hashing (bcrypt)
- Protected routes
- User specific expense isolation

## How I Would Scale This for Production
- Deploy frontend on Vercel and backend on AWS
- Use Redis caching for faster API response
- Implement refresh tokens for better auth security
- Add Docker containerization
- Use load balancer for handling high traffic
