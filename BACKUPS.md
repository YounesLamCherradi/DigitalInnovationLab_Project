# Automated backups

`npm run backup` creates a private, timestamped backup in `backups/` containing:

- `database.dump`: PostgreSQL custom-format dump
- `media.tar.gz`: public uploads and private résumés

Backups older than `BACKUP_RETENTION_DAYS` are removed after a successful new backup. The default is 14 days. The scheduled job runs daily at 02:15.

Run the command from the repository directory while the Docker stack is running:

```bash
npm run backup
```

## Restore

### Restore onto a new server

Copy the timestamp directory to the new server and run:

```bash
./deploy.sh --restore /absolute/path/to/backups/TIMESTAMP
```

This first-boot restore imports both PostgreSQL and media into persistent Docker volumes. It refuses to overwrite an existing database volume.

### Restore an existing installation

An in-place restore is destructive. Stop the app, take another backup, and then run the following with values from `.env`:

```bash
docker compose stop app
docker compose exec -T db pg_restore -U dil -d digital_innovation_lab --clean --if-exists --no-owner --no-privileges < backups/TIMESTAMP/database.dump
docker compose start app
```

Keep an additional encrypted copy off the server. Local backups protect against database mistakes, but not loss of the entire machine.
