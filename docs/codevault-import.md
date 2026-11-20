---
uid: 01a1f623-acbd-7f05-bc3e-a56902901fe5
title: Find and kill process on a port
language: bash
tags: linux, networking, troubleshooting
---
```bash
lsof -i:8000                # find the PID(s) bound to a port
kill -9 <PID>                # replace <PID> with the number shown

# one-liner version
fuser -k 8000/tcp
```

---
uid: 01a1f623-acbe-78d7-9922-84679407ed46
title: Cap Rust build parallelism on low-memory devices
language: bash
tags: rust, cargo, raspberry-pi, tauri
---
```bash
# rustc spawns one codegen unit per core by default; on a memory-constrained
# board (e.g. Raspberry Pi) this can spike RAM enough to make the whole
# system feel frozen. Cap it, then build/dev normally.
CARGO_BUILD_JOBS=2 pnpm tauri dev
CARGO_BUILD_JOBS=2 cargo build
```

---
uid: 01a1f623-acbf-77bb-bcee-6ff313becc72
title: Docker Compose full rebuild
language: bash
tags: docker, compose
---
```bash
docker compose up --build
# or, to force a clean rebuild ignoring the layer cache:
docker compose build --no-cache && docker compose up
```

---
uid: 01a1f623-acc0-7ddd-b6b9-01305f7b6f79
title: Grant current user docker group access
language: bash
tags: docker, linux, permissions
---
```bash
sudo usermod -aG docker $USER
# then either log out/in, or apply immediately in this shell:
newgrp docker
```

---
uid: 01a1f623-acc1-7cc3-a394-f090352707e1
title: UFW allow a service only over Tailscale
language: bash
tags: ufw, firewall, tailscale, security
---
```bash
# Deny a risky port publicly, but allow it over the Tailscale interface only
sudo ufw deny 3389
sudo ufw allow in on tailscale0 to any port 3389
sudo ufw status
```

---
uid: 01a1f623-acc2-7335-a3c0-d10a1c418404
title: Fix SSH authorized_keys permissions
language: bash
tags: ssh, linux, permissions
---
```bash
# sshd silently refuses key auth if these are too permissive
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

---
uid: 01a1f623-acc3-7b0d-8cc8-a99b727869de
title: Disk read/write benchmark with fio
language: bash
tags: linux, disk, benchmarking, fio
---
```bash
# sequential
sudo fio --name=readtest  --filename=/dev/sda --rw=read  --bs=1M --size=2G --direct=1 --numjobs=1 --iodepth=32 --runtime=60 --time_based --group_reporting
sudo fio --name=writetest --filename=/dev/sda --rw=write --bs=1M --size=2G --direct=1 --numjobs=1 --iodepth=32 --runtime=60 --time_based --group_reporting

# random 4k, heavier load
sudo fio --name=randread --filename=/dev/sda --rw=randread --bs=4k --direct=1 --numjobs=2 --iodepth=64 --size=8G --time_based --runtime=300 --group_reporting
```

---
uid: 01a1f623-acc4-7a82-800e-7eb38db3b046
title: Clone/backup a disk with ddrescue
language: bash
tags: linux, disk, backup, ddrescue
---
```bash
sudo apt install gddrescue -y
sudo umount /dev/sda*
sudo ddrescue -f -n /dev/sda /path/to/backup.img backup.log
```

---
uid: 01a1f623-acc5-7bcd-859d-28032a694a90
title: MySQL/MariaDB database sizes
language: sql
tags: mysql, mariadb, sql, admin
---
```sql
SELECT table_schema AS "Database",
       SUM(data_length + index_length) / 1024 / 1024 AS "Size (MB)"
FROM information_schema.TABLES
GROUP BY table_schema;
```

---
uid: 01a1f623-acc6-72b6-9c95-c30efc6ceef2
title: Raspberry Pi health check
language: bash
tags: raspberry-pi, monitoring
---
```bash
vcgencmd measure_temp && uptime && free -h
```

---
uid: 01a1f623-acc7-76d7-9c4d-d37f29507956
title: Update Pi-hole and refresh gravity list
language: bash
tags: pihole, dns
---
```bash
sudo pihole -up   # update Pi-hole core/web/FTL
sudo pihole -g    # rebuild gravity (blocklists)
```

---
uid: 01a1f623-acc8-77fd-a8e9-41d713f0ce1b
title: Standard apt maintenance
language: bash
tags: linux, apt, maintenance
---
```bash
sudo apt update && sudo apt upgrade -y
sudo apt autoremove -y
```

---
uid: 01a1f623-acc9-72f2-8f2c-55336936d577
title: uv + FastAPI dev loop
language: bash
tags: python, uv, fastapi, dev
---
```bash
# one-time
uv sync

# run with autoreload
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

---
uid: 01a1f623-acca-7c23-b351-0e0c14ea88b2
title: Change git remote URL
language: bash
tags: git
---
```bash
git remote set-url origin git@github.com:USER/REPO.git
git remote -v   # verify
```

---
uid: 01a1f623-accb-79d1-b224-91309e7a1968
title: nmap subnet sweep (authorized targets only)
language: bash
tags: nmap, networking, security, pentest
---
```bash
# Only run against hosts/networks you own or are authorized to test.
sudo nmap -sS -Pn 192.168.1.0/24
```

---
uid: 01a1f623-accc-7a28-bbeb-39651ada52f4
title: Build and install CodeVault .deb locally
language: bash
tags: codevault, tauri, deb
---
```bash
pnpm tauri build
sudo apt install ./target/release/bundle/deb/CodeVault_*_amd64.deb
# arm64 boards:
sudo apt install ./target/release/bundle/deb/CodeVault_*_arm64.deb
```
