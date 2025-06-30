# NGO Project Backend

## Setup

1. Clone the repo
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your values
4. Start the server: `npm start`

## Environment Variables
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT
- `PORT`: Port to run the server (default 5000)

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT
- `GET /api/auth/theme` — Get user theme preference (auth required)
- `PUT /api/auth/theme` — Update user theme preference (auth required)

### Dashboard
- `GET /api/summary` — Get account summary (auth required, query: month, year)

### Transactions
- `GET /api/transactions` — List/filter transactions (auth required, query: startDate, endDate, category, description, page, limit)
- `POST /api/transactions` — Add a transaction (auth required)
- `PUT /api/transactions/:id` — Update a transaction (auth required)
- `DELETE /api/transactions/:id` — Delete a transaction (auth required)
- `GET /api/transactions/export/csv` — Export transactions as CSV (auth required)

### Analytics
- `GET /api/transactions/analytics/category-summary` — Get totals per category (auth required, query: month, year)

## Security
- Input validation via express-validator
- XSS/NoSQL injection protection
- Secure HTTP headers with helmet
- CORS enabled

## Optional Features
- Pagination for transactions
- Export transactions as CSV
- User theme preference

---

Feel free to extend this backend as needed! 