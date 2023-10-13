# adp-portal
The Azure Development Platform Portal built using [Backstage](https://backstage.io/).

## Getting started

### Prerequisites

* Access to a UNIX based operating system. If on Windows it is recommended that you use [WSL](https://learn.microsoft.com/en-us/windows/wsl/)
* A GNU-like build environment available at the command line. For example, on Debian/Ubuntu you will want to have the `make` and `build-essential` packages installed
* `curl` or `wget` installed
* [Node.js Active LTS release](https://nodejs.org/en/blog/release)
* [Yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable)
* [Docker](https://docs.docker.com/engine/install/)
* [Git](https://github.com/git-guides/install-git)

See the [Backstage Getting Started documentation](https://backstage.io/docs/getting-started/#prerequisites) for the full list of prerequisites.

### Integrations
We integrate with GitHub via a GitHub app. To get this working locally, the following script will initialize the required environment variables:

```sh
EXPORT GITHUB_APP_ID=<REPLACE>
EXPORT GITHUB_CLIENT_ID=<REPLACE>
EXPORT GITHUB_CLIENT_SECRET=<REPLACE>
```

The GitHub integration also requires a private key. Generate and copy this from your GitHub app to the path specified in [github-app-configuration.yaml](app/github-app-configuration.yaml).

### Running locally
Run the following commands from the `/app` directory:

```sh
yarn install
yarn dev
```