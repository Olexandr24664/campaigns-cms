# CMS KICKSTARTER api

install dotenv package

```
npm install -D dotenv
```

create .env and add MONGO_CLOUD_CONNECTION_STRING for using cloud mongoDb

To start server with usage of cloud mongodb run this

if it is local development with docker then

```
docker exec -it container-name/id mongo

rs.initiate(
  {
    _id : 'rs0',
    members: [
      { _id : 0, host : "192.168.1.100:27017" },
    ]
  }
)
```

```
npm run start:cloudDb
```
