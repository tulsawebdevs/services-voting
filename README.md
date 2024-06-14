# A microservice for storing proposals and user votes

[Frontend Repo](https://github.com/tulsawebdevs/website/)

[Feature Progress Tracker](https://github.com/tulsawebdevs/website/issues/91)

[API Spec](https://gist.github.com/helmturner/8cd1f67d54506f03f7e95e8c28bbf519)

[Swagger UI](https://tulsawebdevs.org/docs/api)

## Development

`docker-compose up -d`

## Database

When starting the docker container it should initialize the database for you.

If you need to manually do it:

```
cd database
./init_db.sh
```

### Seed Database

If you would like to have fake data to test with. You can run the following (make sure container is running first):

```
docker compose exec -T web npm run db:seed
```

## Deployment

- pushing new v0.0.[#] tag will publish an image to ghcr
- restarting k8s pod will pull latest image
