# holi-matrix-client

contains

- [holi-matrix-client](#holi-matrix-client)
  - [Development](#development)

## Development

### Prerequisites

Make sure that the [holi chat server](https://gitlab.holi.team/app/holi-chat-server) is running.

## Architecture

// TODO: in progress documentation. It's more of a mind dump to remind myself to update the documentation.

The Matrix protocol uses an event-driven architecture. In the front end, it's essential to separate read and write operations for the Matrix Store.