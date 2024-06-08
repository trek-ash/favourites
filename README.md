# Favourites demo with node and mongoose 

## Tech Stack

**Server:** Node, Express, typescript, ts-node

**DataBase:** mongoose

**Redis** to have in memory cache to serve requests faster

## Run Locally

Install dependencies

```bash
  npm install
```

Start the tsc

```bash
  npm run watch
```

Start the server

```bash
  npm run dev
```


## Environment Variables

Please add the following environment variables to your .env file (change it based on config you want to run)

`NODE_ENV="local"`,
`JWT_SECRETS=RANDOM_SECRET`,
`REDIS_URL=127.0.0.1:6379`,
`MONGODB_URL=mongodb://127.0.0.1:27022/favouritesList`



## Project Structure

TypeScript (`.ts`) files are in `src` folder and after compilation output as JavaScript (`.js`) is in the `dist` folder.

More details on folders below:

> **Note!** Make sure you have already built the app using `npm run start`

| Name               | Description                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **config**         | Contains config environment to be used by the config package, such as MongoDB URI etc.                                                        |
| **dist**           | Contains the distributable (or output) from your TypeScript build                                                                                             |
| **node_modules**   | Contains projects npm dependencies                                                                                                                            |
| **src**            | Contains your source code that will be compiled to the dist dir                                                                                               |
| **src/middleware** | Contains the middlewares to intercept requests                                                                                                                |
| **src/models**     | Models define Mongoose schemas for MongoDB                                                                  |
| **src/controller** | The controller accesses the database through the model                                                                                                        |
| **src/routes**     | Endpoints of our API                                                                                                                       |
| **src/interfaces** | Contains all your custom types to better handle type checking with TypeScript                                                                                 |
| **src/services**   | Contains custom types of services like sending mail and etc..                                                                                                 |
| **src/index.ts**   | Entry point to  express app                                                                                                                               |
| package.json       | File that contains npm dependencies as well as build scripts                                                                                                  |
| tsconfig.json      | Config settings for compiling server code written in TypeScript                                                                                               |
| tslint.json        | settings for TSLint code style checking                                                                                                                |

## API Reference

### Add to favourites

```http
  POST api/v1/favourite
```

curl --location --request POST 'localhost:5000/api/v1/favourite' \
--header 'Content-Type: application/json' \
--header 'Cookie: 99_ab=20; GOOGLE_SEARCH_ID=5721441710420931976' \
--data-raw '{
  "itemId":"6654c39ccd9ce8858511be6d",
  "itemType":"Movie",
  "userId": "665475a8d05b16d08818005e"
}'


### Get favourites of a user

```http
  GET api/v1/favourite
```
curl --location --request GET 'localhost:5000/api/v1/favourite?userId=665475a8d05b16d08818005e' \
--header 'Cookie: 99_ab=20; GOOGLE_SEARCH_ID=5721441710420931976'

### Remove from favourites

```http
  PATCH api/v1/favourite
```

curl --location --request PATCH 'localhost:5000/api/v1/favourite' \
--header 'Content-Type: application/json' \
--header 'Cookie: 99_ab=20; GOOGLE_SEARCH_ID=5721441710420931976' \
--data-raw '{
  "itemId":"6654c39ccd9ce8858511be6d",
  "userId": "665475a8d05b16d08818005e"
}'

### Create user

curl --location --request POST 'localhost:5000/api/v1/auth/movie' \
--header 'Content-Type: application/json' \
--header 'Cookie: 99_ab=20; GOOGLE_SEARCH_ID=5721441710420931976' \
--data-raw '{
    "title": "Movie 14",
    "actors": ["Someone"],
    "description": "movie",
    "director": "Random",
    "releaseDate": "2023-12-04",
    "genres": ["SciFi"]
}'

### Add movie

curl --location --request POST 'localhost:5000/api/v1/auth/movie' \
--header 'Content-Type: application/json' \
--header 'Cookie: 99_ab=20; GOOGLE_SEARCH_ID=5721441710420931976' \
--data-raw '{
    "title": "Movie 14",
    "actors": ["Someone"],
    "description": "movie",
    "director": "Random",
    "releaseDate": "2023-12-04",
    "genres": ["SciFi"]
}'

### Add TV show

curl --location --request POST 'localhost:5000/api/v1/auth/tvShow' \
--header 'Content-Type: application/json' \
--header 'Cookie: 99_ab=20; GOOGLE_SEARCH_ID=5721441710420931976' \
--data-raw '{
    "title": "Stranger things",
    "actors": ["Someone"],
    "description": "A TV show",
    "director": "Random",
    "releaseDate": "2023-12-04",
    "genres": ["SciFi"],
    "episodes": [
        {
            "episodeNumber": 1,
            "seasonNumber": 1,
            "releaseDate": "2023-10-04",
            "director": "Random Director A",
            "actors": ["Someone A", "Someone B"]
        }
    ]
}'
