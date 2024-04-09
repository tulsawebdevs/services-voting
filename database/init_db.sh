cat db_init.sql | docker-compose exec -T db psql -U postgres -d postgres 
