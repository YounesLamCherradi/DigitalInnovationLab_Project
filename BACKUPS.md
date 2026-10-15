# Automated backups

`npm run backup` creates a private, timestamped backup in `backups/` containing:

- `database.dump`: PostgreSQL custom-format dump
- `media.tar.gz`: public uploads and private résumés

Backups older than `BACKUP_RETENTION_DAYS` are removed after a successful new backup. The default is 14 days. The scheduled job runs daily at 02:15.

## Restore

Stop the application before restoring. Replace the timestamp below with the backup to restore:

```bash
docker exec -i dil-postgres pg_restore -U dil -d digital_innovation_lab --clean --if-exists < backups/TIMESTAMP/database.dump
tar -xzf backups/TIMESTAMP/media.tar.gz
```

Keep an additional encrypted copy off the server. Local backups protect against database mistakes, but not loss of the entire machine.

