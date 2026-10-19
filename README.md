# Digital Innovation Lab

## One-command Docker deployment

Requirements: Docker Engine with the Docker Compose plugin.

For a new empty installation:

```bash
git clone https://github.com/YounesLamCherradi/DigitalInnovationLab_Project.git
cd DigitalInnovationLab_Project
chmod +x deploy.sh
./deploy.sh
```

The first run creates `.env` with random database and session secrets, builds the app, initializes PostgreSQL, and starts the site at `http://SERVER_IP:3000`.

### Deploy with the existing data

Copy one private backup timestamp directory to the new server. It must contain `database.dump`; `media.tar.gz` is optional but needed for uploaded images and résumés.

```bash
./deploy.sh --restore /absolute/path/to/backups/2026-10-19T02-15-02-061Z
```

Restoration is accepted only when the PostgreSQL Docker volume does not exist, which prevents accidental overwriting. Do not commit backup files: they can contain personal data and administrator password hashes.

After startup:

```bash
docker compose ps
docker compose logs -f app
```

Edit `.env` to set the public `SITE_URL`, `VITE_SITE_URL`, `ALLOWED_ORIGINS`, reverse-proxy settings, and SMTP credentials, then run `docker compose up -d --build` again. Data persists in Docker volumes across rebuilds and restarts.

See [BACKUPS.md](BACKUPS.md) for backup and restore operations.
