# Pintra

Store links, ideas and notes as cards.

Work in progress.

Supports using Trello as the data source in addition to own database.
No editing support yet, and Trello integration nicely sidesteps that problem.

## Tech Stack

Web application running with Next.js using Postgres as database.

- Next.js 10
- React 17
- TypeScript 4.1
- Postgres 12.5

### Set up Postgres

You need to set up a Postgres instance somewhere.

### Running the app & server

Setup env: copy `template.env` to `.env.local`.
Configure env variables according to instructions in the file.

Then launch server: `npm run dev`

## Running

Launch production server: `next start`

## Creating content

Manual process for now.

## Integrating a Trello board

You need to add Trello configuration directly to DB and configure encryption env variables.

Create id for board and insert a new row to `board_configs` table.
Set `data_source` to `trello`.

`options`: `{"boardId": "trello-board-id"}`
`secret`: `{"apiKey": "encrypted-trello-api-key", "apiToken": "encrypted-trello-api-token"}`

Secrets need to be encrypted using AES-256-CBC. Encryption key and iv need to be added to environment config (`.env.local` for local dev).

## Containerization

The project includes a Dockerfile, so you can easily run the app in a container.

To build the image:

```
./container-build.sh
```

To run the app from **built** container:

```
./container-run.sh
```

## Heroku deployment

Set up Heroku app for the folder containing the cloned Pintra git repository normally.

After that you can easily push the Docker image to Heroku:

```
./container-push-to-heroku.sh
```
