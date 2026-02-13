# Deployment Guide - Lost & Found Portal

## Deploy with Docker on Port 5002

### Prerequisites

- Docker installed on your server
- Docker Compose installed
- Port 5002 available

---

## Quick Deployment

### 1. Clone/Upload Project to Server

```bash
# Upload your project to the server
# Or clone from git repository
cd /path/to/Lost-and-Found
```

### 2. Build and Run with Docker Compose

```bash
docker-compose up --build -d
```

That's it! Your application will be running on port 5002.

---

## Access the Application

- **URL:** `http://your-server-ip:5002`
- **Moderator Login:**
  - Username: `admin`
  - Password: `admin123`

---

## Docker Commands

### Start the Application

```bash
docker-compose up -d
```

### Stop the Application

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f
```

### Rebuild and Restart

```bash
docker-compose up --build -d
```

### Check Status

```bash
docker-compose ps
```

### Remove Everything (including volumes)

```bash
docker-compose down -v
```

---

## Environment Variables

Create a `.env` file in the project root for custom configuration:

```env
PORT=5002
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

Then update docker-compose.yml to use the .env file:

```yaml
env_file:
  - .env
```

---

## Production Checklist

- [ ] Change JWT_SECRET in docker-compose.yml or .env file
- [ ] Change default moderator password after first login
- [ ] Set up firewall rules to allow port 5002
- [ ] Configure reverse proxy (nginx) if needed
- [ ] Set up SSL/HTTPS certificate
- [ ] Configure backup for lostfound.db
- [ ] Set up monitoring and logging

---

## Nginx Reverse Proxy (Optional)

If you want to use a domain name with SSL:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Troubleshooting

### Port Already in Use

```bash
# Check what's using port 5002
sudo lsof -i :5002

# Or use netstat
sudo netstat -tulpn | grep 5002

# Kill the process
sudo kill -9 <PID>
```

### Container Won't Start

```bash
# Check logs
docker-compose logs

# Check container status
docker ps -a

# Remove and rebuild
docker-compose down
docker-compose up --build
```

### Database Issues

```bash
# Stop containers
docker-compose down

# Remove database file
rm lostfound.db

# Restart (new database will be created)
docker-compose up -d
```

### Permission Issues

```bash
# Fix file permissions
sudo chown -R $USER:$USER .
chmod -R 755 .
```

---

## Architecture

```
┌─────────────────────────────────────┐
│         Docker Container            │
│  ┌───────────────────────────────┐  │
│  │   Node.js Server (Port 5002)  │  │
│  │   - Express API               │  │
│  │   - JWT Authentication        │  │
│  │   - Serves React Build        │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   SQLite Database             │  │
│  │   (lostfound.db)              │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
              │
              │ Port 5002
              ▼
        Your Server
```

---

## Backup Strategy

### Manual Backup

```bash
# Backup database
cp lostfound.db lostfound.db.backup-$(date +%Y%m%d)

# Or create a tar archive
tar -czf backup-$(date +%Y%m%d).tar.gz lostfound.db
```

### Automated Backup (Cron Job)

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /path/to/Lost-and-Found && cp lostfound.db backups/lostfound.db.$(date +\%Y\%m\%d)
```

---

## Monitoring

### Check Application Health

```bash
curl http://localhost:5002/api/items
```

### Monitor Container Resources

```bash
docker stats lost-and-found-app
```

### View Real-time Logs

```bash
docker-compose logs -f --tail=100
```

---

## Updating the Application

```bash
# Pull latest changes (if using git)
git pull

# Rebuild and restart
docker-compose down
docker-compose up --build -d

# Verify it's running
docker-compose ps
curl http://localhost:5002/api/items
```

---

## Security Recommendations

1. **Change Default Credentials**
   - Change moderator password immediately after deployment

2. **Use Strong JWT Secret**
   - Generate a strong random secret: `openssl rand -base64 32`
   - Update in docker-compose.yml or .env file

3. **Firewall Configuration**

   ```bash
   # Allow port 5002
   sudo ufw allow 5002/tcp

   # Enable firewall
   sudo ufw enable
   ```

4. **Regular Updates**
   - Keep Docker images updated
   - Update Node.js dependencies regularly

5. **HTTPS/SSL**
   - Use nginx reverse proxy with Let's Encrypt SSL
   - Or use Cloudflare for SSL termination

---

## Performance Optimization

### Docker Resource Limits

Add to docker-compose.yml:

```yaml
services:
  lost-and-found:
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
        reservations:
          cpus: "0.5"
          memory: 256M
```

### Enable Logging Rotation

Add to docker-compose.yml:

```yaml
services:
  lost-and-found:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## Support

For issues or questions:

- Check logs: `docker-compose logs`
- Verify port: `netstat -tulpn | grep 5002`
- Test API: `curl http://localhost:5002/api/items`

---

## Made with ❤️ by Shubhranshu Pandey
