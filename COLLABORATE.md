# 🏪 TindaTrack — Collaboration Guide
## Para sa mga Classmates

---

## What You Need to Install (ONE THING ONLY)

👉 **Docker Desktop** — [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

- Download for Windows
- Install (Next, Next, Next)
- Restart your PC
- Open Docker Desktop — make sure it's running (whale icon sa taskbar 🐳)

**That's it! No need to install PHP, PostgreSQL, Node.js, or Laragon.**

---

## Step 1 — Clone the Project

Open **Git Bash** or **CMD** and run:

```bash
git clone https://github.com/louiepisos/TindaTrack.git
cd TindaTrack
```

---

## Step 2 — Copy the Environment File

```bash
cp .env.example .env
```

> On Windows CMD (not Git Bash):
> ```cmd
> copy .env.example .env
> ```

---

## Step 3 — Start TindaTrack (ONE COMMAND)

```bash
docker-compose up --build
```

This will automatically:
- ✅ Install PHP dependencies (composer install)
- ✅ Install Node dependencies (npm install)
- ✅ Build React frontend (npm run build)
- ✅ Start PostgreSQL database
- ✅ Run migrations (create all tables)
- ✅ Run seeders (load sample Filipino store data)
- ✅ Start the web server

**First time will take 3-5 minutes** (downloading everything).
Next time will be much faster!

---

## Step 4 — Open TindaTrack

Once you see:
```
✅ TindaTrack is ready! Visit http://localhost:8000
```

Open your browser and go to:
```
http://localhost:8000
```

---

## Login Credentials

| Account | Email | Password |
|---|---|---|
| Admin | admin@tindatrack.ph | password |
| Demo | demo@tindatrack.ph | password |

---

## How to Stop TindaTrack

Press `Ctrl + C` in the terminal, then run:
```bash
docker-compose down
```

---

## How to Start Again (Next Time)

No need to rebuild — just run:
```bash
docker-compose up
```

---

## How to Pull Latest Changes from GitHub

```bash
git pull
docker-compose up --build
```

The `--build` flag rebuilds the app with your latest changes.

---

## Database GUI (Optional)

Want to view the database visually? Open:
```
http://localhost:5050
```

Login with:
- Email: `admin@tindatrack.ph`
- Password: `tindatrack123`

Then connect to server:
- Host: `postgres`
- Port: `5432`
- Database: `tindatrack`
- Username: `postgres`
- Password: `tindatrack123`

---

## Adding New Features

1. Make your changes in the code
2. If you added migrations: `docker-compose exec app php artisan migrate`
3. If you added seeders: `docker-compose exec app php artisan db:seed`
4. Push your changes: `git add . && git commit -m "your message" && git push`

---

## Common Issues

**Problem: Port 8000 already in use**
```bash
# Change the port in docker-compose.yml
# ports: "8080:80"  # use 8080 instead
```
Then visit `http://localhost:8080`

**Problem: Docker not running**
- Open Docker Desktop
- Wait for "Engine running" at the bottom
- Try again

**Problem: Database connection error**
```bash
docker-compose down
docker-compose up --build
```

---

## Questions?

Contact: louiepisos on GitHub 🏪
