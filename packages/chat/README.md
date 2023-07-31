# holi-matrix-client

contains

- [holi-matrix-client](#holi-matrix-client)
  - [Getting started](#getting-started)
    - [Development](#development)
    - [Local Development](#local-backend-development)
  - [Architecture](#architecture)

## Getting started

### Development

For development, you need to work with a holi chat server.
There is a deployed staging chat server that you can work with out of the box; there is no extra configuration necessary
from your side. To ensure it is running, you can open this [link](https://staging.chat.holi.social/) in your preferred
browser.

Matrix chat users are created or logged in when you log in to holi. We start the client when you visit the chat
home `holi-url/chat.`

### Local Backend Development

The preferred way to develop if you want to delete/create users, rooms, and messages is to run the holi chat server
locally. For that, you need to check out the [holi chat server](https://gitlab.holi.team/app/holi-chat-server) repo and
follow the installation instructions from the repository README file.

Once you finish the installation, you can spin up the server with `docker-compose up -d`. Now you can open
the [chat server link](https://local.chat.holi.social/) in the browser; in the opened browser tab, go to advance and
proceed with
the "unsafe" site. Browsers don't trust self-signed SSL from the local.chat.holi.social/ that is why this step is
essential. Browsers warn you that **Your connection is not private**. If you start getting chat authentication errors
from the server during development, you must re-visit the **local.chat.holi.social** again and accept the unsafe site.

Before you execute `mprocs -c mprocs-local-backend.yaml`, ensure that the chat JWT token has been stored in
the `holi-unified-api `repository. In the Unified API repository, you should have a **jwks.json** file in
holi-unified-api > outhkeeper > secretes. The token can be found
in [Passboly]( https://cloud.passbolt.com/holi/app/passwords/view/283ea49a-d1d4-412d-9f7a-836c47be8bed) under *
*ORY_JWKS_DEVELOPMENT**.

Now you can execute `mprocs -c mprocs-local-backend.yaml` and use the local chat server.

Matrix chat users are created or logged in when you log in to holi. We start the client when you visit the chat
home `holi-url/chat.

## Architecture

We use the matrix protocol for secure and decentralized communication in the holi chat. It comprises two central systems; a chat home server and a client. We host our own [Synapse homeserver](https://matrix-org.github.io/synapse/latest/) used locally for development or on the deployed staging server. Our home server is necessary for hosting our holi user accounts.

The matrix protocol uses an event-driven architecture. In the front end, it's essential to separate read and write operations to ensure we are not encountering any wasteful re-renders. We hide the **matrix-js-sdk** client behind a `ChatClient` facade (bulk accessor) that hides matrix complexity for the holi chat. The `ChatClient` is a singleton and only communicates with the `Store.`

// TODO: Continue updating the documentation
### ChatLogin

### ChatClient

### Jōtai Store
Check the Jōtai documentation for more information. You can find the link in the references below.


## References
[matrix](https://matrix.org/)
[matrix documentation](https://matrix.org/docs/chat_basics/matrix-for-im/)
[matrix-js-sdk](https://matrix-org.github.io/matrix-js-sdk/)
[Jotai](https://jotai.org/)
