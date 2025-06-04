# Acutix Company Website

A **full-stack web application** for Acutix Soft LLP built with a React + Vite front-end and an Express/Node back-end.  This README walks you through local development **and** production deployment using:

* **Vercel** – static hosting / Serverless Functions for the **frontend**
* **Render** – containerised web service for the **backend API**
* **Google Domains** – points `your-company.com` and `api.your-company.com` to the two hosts

---

## 1. Repository structure

```
├── frontend/            # React-Vite SPA (contains pages/ and components/ folders)
│   ├── pages/
│   ├── components/
│   ├── assets/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── vite.config.js
│   └── ...
└── backend/             # Express + Nodemailer REST API
    ├── src/
    ├── package.json
    └── ...
```

> **Tip**  Keep the two apps fully isolated so each host can build only its own subtree.

---

## 2. Prerequisites

| Tool       | Version  | Notes                   |
| ---------- | -------- | ----------------------- |
| Node.js    | ≥ 20.0   | LTS recommended         |
| npm        | ≥ 10     | ships with Node ≥ 20    |
| Git        | any      | GitHub account required |
| Vercel CLI | optional | `npm i -g vercel`       |
| Render CLI | optional | `npm i -g render-cli`   |

---

## 3. Local development

### 3.1 Clone and install

```bash
# 1 clone
$ git clone https://github.com/<your-org>/<repo>.git acutix-website
$ cd acutix-website

# 2 install root-level tooling (optional)
$ corepack enable                        # if you prefer pnpm/yarn

# 3 frontend
$ cd frontend
$ npm install
$ npm run dev     # ↗ http://localhost:5173

# 4 backend (in new terminal)
$ cd ../backend
$ npm install
$ npm run dev     # ↗ http://localhost:8000/api/health
```

### 3.2 Environment variables

Create `.env` files modelled on the examples:

```bash
# backend/.env.example ➜ backend/.env
PORT=8000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/acutix
EMAIL_USER=<gmail-user>
EMAIL_PASS=<gmail-app-password>

# frontend/.env.example ➜ frontend/.env
VITE_API_URL=https://api.your-company.com
```

> **Never commit real secrets** – `.env*` is already in `.gitignore`.

---

## 4. Deployment

### 4.1 Frontend → Vercel

1. **Push to GitHub** – ensure the `frontend/` directory lives in the root of the repo (monorepo supported).
2. **New Project** → **Import Git Repository** on [https://vercel.com](https://vercel.com).
3. **Framework preset**: **Vite** (react-ts/js).  Vercel auto-detects and sets:

   * Build Command → `npm run build`
   * Output Dir → `dist`
4. **Root Directory** → `frontend`.
5. **Environment Variables** – add any that start with `VITE_`.
6. **Deploy** – first build takes \~1 min; subsequent pushes auto-deploy.

#### Custom domain (root)

* Project Settings → **Domains** → **Add** → `your-company.com`
* Choose **Nameserver** method → copy Vercel NS (ns1, ns2)\*\*
* In **Google Domains → DNS** set *Custom nameservers* to those values.
* Wait for DNS propagation (few minutes to 24 h).

Vercel now serves `https://your-company.com` and `https://www.your-company.com` with automatic HTTPS.

---

### 4.2 Backend API → Render

1. **New + Web Service** on [https://dashboard.render.com](https://dashboard.render.com)
2. **Connect GitHub** → pick the same repo → branch `main`.
3. **Root Directory** → `backend`.
4. Build & Start commands:

   ```bash
   Build:  npm install
   Start:  node src/index.js     # or npm start / ts-node
   ```
5. **Environment Variables** – mirror backend `.env` keys.
6. **Instance type** – free tier is fine for dev, upgrade for prod.
7. **Create Web Service** → wait for container build & health-check.

#### Custom domain (`api.` subdomain)

1. Service Settings → **Custom Domains** → **Add** → `api.your-company.com`.
2. Render shows **A records** (IPv4) **or** a **CNAME** target.
3. In **Google Domains → DNS** add:

   * **Type**: `A` (or `CNAME`), **Name**: `api`, **Data**: <value Render shows>
4. Click **Verify** in Render once DNS is live.

The API is now reachable at `https://api.your-company.com` and consumed by the Vercel-hosted SPA.

---

## 5. CI / CD matrix

| Service | Trigger                 | Action                                  |
| ------- | ----------------------- | --------------------------------------- |
| GitHub  | `push` / `pull_request` | Webhook to Vercel → redeploy `frontend` |
| GitHub  | `push` / `pull_request` | Webhook to Render → redeploy `backend`  |

---

## 6. Quick scripts

Package .json shortcuts (workspaces friendly):

```jsonc
{
  "scripts": {
    "dev": "concurrently \"npm --prefix frontend run dev\" \"npm --prefix backend run dev\"",
    "build": "npm --prefix frontend run build && npm --prefix backend run build",
    "lint": "eslint \"{frontend,backend}/**/*.{js,jsx,ts,tsx}\""
  }
}
```

---

## 7. Troubleshooting

| Symptom                  | Likely Cause             | Fix                                             |
| ------------------------ | ------------------------ | ----------------------------------------------- |
| Vercel build fails       | Missing `vite.config.js` | Ensure Vite config is present in `frontend/`.   |
| `CORS` errors in browser | API URL mismatch         | Confirm `VITE_API_URL` points to Render domain. |
| Render deploy hangs      | Wrong start command      | Check `node` entry point & listening port.      |

---

## 8. License

Distributed under the MIT License © 2025 Acutix Soft LLP.

---

