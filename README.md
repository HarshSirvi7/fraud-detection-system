# ClearPay transfer risk demo

A React frontend and Java Spring Boot API for checking a recipient before a sender records a transfer. Risk uses recipient verification, previous transfer count, fraud reports, and transfer amount. A recipient with any fraud reports is marked **FRAUDULENT** and the transfer endpoint blocks it. The database starts empty; the app does not seed sample recipients or transactions.

## Requirements

- Java 17+
- Node.js 18 or newer

## Run locally

In one terminal:

```powershell
cd fraud-api
.\mvnw spring-boot:run
```

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:8080/api`; H2 stores recipients and transfers in `fraud-api/data/clearpay.mv.db`. H2 console: `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:file:./data/clearpay`, username `sa`, blank password).

## Frontend structure

```text
frontend/src/
  app/                 route definitions and shared backend data context
  components/
    activity/          transaction table
    common/            shared headers, notices, badges, and statistic cards
    layout/            app shell and navigation
    transfer/          recipient risk result
  pages/               overview, send, activity, recipients, and 404 routes
  services/            API client and formatting helpers
  styles/              global responsive design system
  main.jsx             React and router entry point
```

Routes: `/overview`, `/send`, `/activity`, and `/recipients`. Unknown paths show a not-found page.

## Add real records

Add a recipient in the recipient directory. Record a fraud report for a recipient when needed. The send form then checks the recipient's saved fraud reports and transfers from the API before allowing a transfer record.

An account ID not in the recipient directory is treated as unverified. Risk scores are illustrative demo rules, not a production fraud model. Set `VITE_API_URL` at build time if the API is hosted elsewhere.
