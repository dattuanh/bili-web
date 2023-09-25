### Notes:

1. Always use soft-delete
2. When delete entity, delete all other's entity which level is lower
3. Git convention:
   1. Do not push direct to dev, stage, prod
   2. Branch name must follow scheme: <prefix>/#<ticket-id><name>
      1. Prefix: dev, stage, prod
      2. Ticket id: 412
      3. Name: written in lower and kebab case
      4. Example: feat/#421-impl-product-variant

## Todo:

1. Use joi

### Migration:

1. Create empty migration: `npm run migration:create --name='name'`
2. Generate migration base on differences with database: `npm run migration:generate --name='name'`
3. Run migration: `npm run migration:up`
4. Revert migration: `npm run migration:down`

### Husky:

1. Skip husky with command: git commit -n -m '<commit message>'

### Cron Job:

1. Sync UrBox: `npm run cron-job sync-product-ur-box`

### Run redis:

1. docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
