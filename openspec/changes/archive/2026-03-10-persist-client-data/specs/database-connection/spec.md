## ADDED Requirements

### Requirement: MongoDB connection utility
The system SHALL provide a reusable connection utility at `src/lib/db/mongodb.ts` that establishes and maintains a connection to a MongoDB Atlas cluster using the `MONGODB_URI` environment variable.

#### Scenario: Successful connection on first request
- **WHEN** a Server Action or API route invokes the connection utility for the first time
- **THEN** the utility SHALL establish a new connection to MongoDB Atlas and cache the connection instance for reuse

#### Scenario: Connection reuse across hot reloads in development
- **WHEN** the Next.js development server performs a hot-reload
- **THEN** the utility SHALL reuse the cached connection instead of creating a new one, preventing connection pool exhaustion

#### Scenario: Missing environment variable
- **WHEN** the `MONGODB_URI` environment variable is not set
- **THEN** the utility SHALL throw a descriptive error indicating the missing configuration

### Requirement: Mongoose ODM configuration
The system SHALL use Mongoose as the Object Data Modeling library for all database interactions.

#### Scenario: Mongoose integration with Next.js
- **WHEN** the application starts
- **THEN** Mongoose SHALL be configured to work within the Next.js App Router environment, using the cached connection utility

### Requirement: Environment variable configuration
The system SHALL require a `MONGODB_URI` environment variable pointing to the MongoDB Atlas cluster connection string.

#### Scenario: Environment variable documented
- **WHEN** a developer sets up the project
- **THEN** the `MONGODB_URI` variable SHALL be documented in `.env.example` with a placeholder value
