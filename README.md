# Node.js Express Backend Boilerplate

This is a modular and secure backend boilerplate built with Node.js and Express.js, designed for scalability and ease of use. It includes features like configuration management, logging, JWT authentication, input sanitization, rate limiting, and support for PostgreSQL or MongoDB.

## Features

- **Configuration Management**: Using `convict` for environment variable handling and validation.
- **Logging**: Powered by `winston` with console and daily rotating file logs.
- **Security**:
  - Helmet for security headers.
  - CORS support.
  - Rate limiting with `express-rate-limit`.
  - Input sanitization using `sanitize-html`.
- **Authentication**: JWT-based with refresh tokens and role-based access control.
- **Database Support**: PostgreSQL (default) or MongoDB, with connection pooling and setup script.
- **Email Service**: SMTP integration with `nodemailer`.
- **Testing**: Configured with Jest.
- **Deployment**: Docker support with `Dockerfile`, `docker-compose.yml`, and Nginx reverse proxy.
- **Health Check**: Endpoint at `/health`.

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables: Copy `.env.example` to `.env` and fill in your values (if available, or create based on config/index.js).

4. (Optional) Set up database:
   - For PostgreSQL: `npm run setup-db`
   - For MongoDB: Ensure MongoDB is running and update `MONGO_URI` in `.env`.

5. Start the server:
   ```bash
   npm start
   ```

## Configuration

The boilerplate uses a `.env` file for configuration. Key variables include:

- `NODE_ENV`: development/production/test
- `PORT`: Server port (default 3000)
- `ENABLE_LOGGER`: Enable logging (true/false)
- `USE_POSTGRES` / `USE_MONGO`: Choose database
- JWT secrets, SMTP settings, etc.

See `config/index.js` for all configurable options.

## Folder Structure

- `config/`: Configuration files
- `controllers/`: Route handlers
- `middlewares/`: Custom middlewares (e.g., auth)
- `models/`: Database models
- `routes/`: API routes
- `services/`: Business logic
- `utils/`: Utilities (logger, db, smtp)

## Docker

Build and run with Docker:
```bash
docker-compose up
```

This sets up the backend, PostgreSQL, and Nginx.

## Testing

Run tests with:
```bash
npm test
```

## Contributing

Feel free to fork and submit pull requests!

## License

MIT License