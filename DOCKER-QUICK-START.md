# 🚀 Docker Quick Start - Port 5002

## One Command Deployment

```bash
docker-compose up --build -d
```

That's it! Your application will be running on **port 5002**.

---

## Access

- **URL:** http://localhost:5002 (or http://your-server-ip:5002)
- **Moderator Login:**
  - Username: `admin`
  - Password: `admin123`

---

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop application
docker-compose down

# Restart application
docker-compose restart

# Check status
docker-compose ps

# Rebuild and restart
docker-compose up --build -d
```

---

## What Gets Built

✅ React frontend (production build)  
✅ Node.js backend with JWT authentication  
✅ SQLite database  
✅ All running in a single container on port 5002

---

## For More Details

- **Local Development:** See [HOW-TO-RUN.md](HOW-TO-RUN.md)
- **Production Deployment:** See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Project Overview:** See [README.md](README.md)

---

Made with ❤️ by Shubhranshu Pandey
