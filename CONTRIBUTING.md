# Contributing 
Thanks for your interest in helping with project-initializer-cli. We're happy to have you here.

But before your first pull request, you must review the contribution guide. Also, check issues and pull requests for the same problem or improvement.

## In this repository, you will find
- We use `pnpm` for development.
- We use `changesets` for managing releases.

### Repository structure
```
src
└──|
   |-- index.ts
   |-- commands 
   |-- test
   |-- lib
       |-- constants
       |-- types
       |-- services
           |-- install
```

## Steps for contributing
### Fork repo
Just fork repo.

### Clone repository
```bash
git clone https://github.com/your-username/project-initializer-cli.git
```

### New Branch
```bash
git checkout -b new-branch
```

### Install all dependencies
```bash
pnpm install
```

### Build and running the CLI
1. Build command:
    ```bash
    pnpm run build
    ```

2. And after build, you can start dev script:
    ```bash
    pnpm run dev
    ```
3. Create other terminal, for testing CLI:
    ```bash
    pnpm pic -h
    ```

    Also for test, create some project:
    ```bash
    pnpm pic hono test-hono-app
    ```

Now you can solve a problem or development a new feature.

## Commit Convention
TODO