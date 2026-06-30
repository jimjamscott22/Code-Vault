# CodeVault Sample Snippets

This file contains 15 useful code snippets and bash scripts ready to import into CodeVault using the **Import Markdown** feature.

---

---
title: Docker Cleanup and Prune
language: bash
tags: docker, cleanup, system
---
```bash
# Remove stopped containers
docker container prune -f

# Remove dangling images
docker image prune -f

# Remove unused volumes
docker volume prune -f

# Full cleanup (images, containers, volumes, networks)
docker system prune -a --volumes
```

---

---
title: Find Large Files in Directory
language: bash
tags: linux, disk-usage, files
---
```bash
# Find top 10 largest files recursively
find . -type f -exec ls -lh {} + | sort -k5 -hr | head -10

# Alternative using du
du -ah . | sort -rh | head -20

# Find files larger than 100MB
find . -type f -size +100M
```

---

---
title: Backup Directory with Timestamp
language: bash
tags: backup, administration, tar
---
```bash
#!/bin/bash
# Backup a directory with date-based naming
DIR_TO_BACKUP="$1"
BACKUP_DIR="${HOME}/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/${DIR_TO_BACKUP##*/}_${TIMESTAMP}.tar.gz" "$DIR_TO_BACKUP"
echo "Backup complete: $BACKUP_DIR/${DIR_TO_BACKUP##*/}_${TIMESTAMP}.tar.gz"
```

---

---
title: Check Open Ports
language: bash
tags: networking, ports, linux
---
```bash
# List all listening ports
sudo netstat -tulpn | grep LISTEN

# Alternative using ss (faster)
sudo ss -tulpn | grep LISTEN

# Find process listening on specific port
sudo lsof -i :8080

# Check if port is open without root
nc -zv localhost 3000
```

---

---
title: Git Force Pull (Discard Local)
language: bash
tags: git, version-control
---
```bash
# Discard all local changes and pull latest
git fetch origin
git reset --hard origin/main

# Or for current branch
git fetch origin
git reset --hard origin/$(git rev-parse --abbrev-ref HEAD)
```

---

---
title: Extract and Convert Media Files
language: bash
tags: ffmpeg, media, conversion
---
```bash
# Convert MP4 to WebM
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 output.webm

# Extract audio as MP3
ffmpeg -i video.mp4 -q:a 0 -map a audio.mp3

# Resize video to 720p
ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4

# Create GIF from video (first 5 seconds)
ffmpeg -i input.mp4 -t 5 -vf "fps=10,scale=320:-1:flags=lanczos" output.gif
```

---

---
title: Monitor System Resources
language: bash
tags: monitoring, system, performance
---
```bash
#!/bin/bash
# Continuous system resource monitor
watch -n 1 'echo "=== CPU ==="; top -bn1 | head -12; echo "=== Memory ==="; free -h; echo "=== Disk ==="; df -h /'
```

---

---
title: Generate Random Password
language: bash
tags: security, password, random
---
```bash
# Generate 32-character random password
openssl rand -base64 32

# Generate alphanumeric only (no special chars)
tr -dc 'A-Za-z0-9' </dev/urandom | head -c 32; echo

# Using /dev/urandom (portable)
cat /dev/urandom | tr -dc 'a-zA-Z0-9!@#$%^&*' | fold -w 32 | head -1
```

---

---
title: Batch Rename Files
language: bash
tags: bash, file-operations, rename
---
```bash
# Rename all .txt files to .md
for file in *.txt; do mv "$file" "${file%.txt}.md"; done

# Add prefix to all PNG files
for file in *.png; do mv "$file" "thumb_${file}"; done

# Change extension (e.g., .jpeg to .jpg)
for file in *.jpeg; do mv "$file" "${file%.jpeg}.jpg"; done

# Using rename tool (if available)
rename 's/\.txt$/.md/' *.txt
```

---

---
title: Search and Replace in Files
language: bash
tags: grep, sed, text-processing
---
```bash
# Simple grep search
grep -r "search_term" ./src

# Grep with context lines (before and after)
grep -B2 -A2 "pattern" file.txt

# Case-insensitive search
grep -ri "pattern" ./src

# Replace in all files (sed)
find . -name "*.js" -type f -exec sed -i 's/oldText/newText/g' {} +

# Safer backup version
find . -name "*.js" -type f -exec sed -i.bak 's/oldText/newText/g' {} +
```

---

---
title: Kill Process by Name
language: bash
tags: process, kill, system
---
```bash
# Kill process by name
killall node

# Kill with signal (graceful)
killall -SIGTERM node

# Kill by port number
lsof -i :8080 | grep -v COMMAND | awk '{print $2}' | xargs kill -9

# Kill all processes matching pattern
pkill -f "python.*script.py"
```

---

---
title: Simple HTTP Server
language: bash
tags: http, server, testing
---
```bash
# Python 3 (port 8000)
python3 -m http.server

# Python 3 (custom port)
python3 -m http.server 8080

# Python 2 (legacy)
python -m SimpleHTTPServer 8000

# Node.js (requires http-server)
npx http-server -p 8080

# Node.js one-liner with Express
node -e "require('http').createServer((req, res) => { res.writeHead(200); res.end('Hello'); }).listen(8080)"
```

---

---
title: Create Nginx Virtual Host
language: nginx
tags: nginx, web-server, config
---
```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/example.com;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php-fpm.sock;
    }

    # Redirect HTTP to HTTPS
    # return 301 https://$server_name$request_uri;
}
```

---

---
title: TypeScript React Component Template
language: typescript
tags: react, typescript, template
---
```typescript
import React, { useState, useCallback } from 'react';

interface Props {
  title: string;
  onClose?: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onClose }) => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <button
        onClick={handleClick}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Count: {count}
      </button>
    </div>
  );
};
```

---

---
title: Docker Compose Database Stack
language: yaml
tags: docker, docker-compose, database
---
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: my_postgres
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - mynetwork

  redis:
    image: redis:7-alpine
    container_name: my_redis
    ports:
      - "6379:6379"
    networks:
      - mynetwork

volumes:
  postgres_data:

networks:
  mynetwork:
    driver: bridge
```

---

---
title: Cron Job Examples
language: bash
tags: cron, scheduling, automation
---
```bash
# Edit current user's crontab
crontab -e

# Examples:
# Run every day at 2:30 AM
30 2 * * * /home/user/backup.sh

# Every 15 minutes
*/15 * * * * /usr/local/bin/check_status.sh

# Every Monday at 9 AM
0 9 * * 1 /usr/local/bin/weekly_report.sh

# Every 1st of month at midnight
0 0 1 * * /usr/local/bin/monthly_cleanup.sh

# Reboot at 3 AM daily
0 3 * * * /sbin/reboot

# View active crontab
crontab -l

# Remove all cron jobs
crontab -r
```

---
