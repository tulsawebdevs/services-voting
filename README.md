# A microservice for storing proposals and user votes

[Frontend Repo](https://github.com/tulsawebdevs/website/)

[Feature Progress Tracker](https://github.com/tulsawebdevs/website/issues/91)

[API Spec](https://gist.github.com/helmturner/8cd1f67d54506f03f7e95e8c28bbf519)

[Swagger UI](https://tulsawebdevs.org/docs/api)

## Development

`docker-compose up -d` 

## Deployment

- pushing new v0.0.[#] tag will publish an image to ghcr
- restarting k8s pod will pull latest image
