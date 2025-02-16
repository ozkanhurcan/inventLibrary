# Book Management System

A robust API service for managing books, user borrowing, and library operations.

## Features

- Book management (add, update, delete, search)
- User management
- Book borrowing system
- Input validation
- Comprehensive test coverage

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ozkanhurcan/inventLibrary.git
cd inventLibrary
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

4. Setup database:

```bash
npm run migration:run
```

## Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

## Testing

```bash
npm test
```
