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

### GitHub Integration
You will need to create a GitHub Personal Access Token to support the GitHub integration. Follow the steps in the [Backstage documentation](https://backstage.io/docs/getting-started/configuration/#setting-up-a-github-integration) to create your token.

Either save your token to an environment variable named `GITHUB_TOKEN`, or add the following to your **app-config.local.yml** file:

```yml
integrations:
  github:
    - host: github.com
      token: REPLACE-WITH-YOUR-TOKEN
```

### Running locally
Run the following commands from the `/app` directory:

```sh
yarn install
yarn dev
```