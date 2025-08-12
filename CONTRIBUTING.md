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
3. Create other tab in terminal, for testing CLI:
    ```bash
    pnpm pic -h
    ```

    Also for test, create some project:
    ```bash
    pnpm pic hono test-hono-app -c ~/Desktop
    ```

Now you can solve a problem or development a new feature.

## Testing
We use <a href="https://jestjs.io/">Jest</a> to write tests. You can run all the tests from the root directory with:
```
pnpm run test
```
**We have constant like:**
```
export const TIMEOUT = 300000 // 5 min
```
**This is normal, because if the TIMEOUT is set to less than 5 minutes, the Nuxt.js test will crash.**
**Also test like <... test dir> must be a last test.**

## Commit Convention
When you create commit, please to follow the convention `category: message` in your commit message. Below, you'll see all the categories you can use. 

- `feat`: any changes that introduce entirely new code or add new features.

- `fix`: changes that resolve bugs (ideally, reference a related issue if available).

- `refactor`: changes to existing code that improve performance and overall quality.

- `build`: changes related to the build process, including dependency updates or additions.

- `test`: changes related to testing, such as adding or modifying tests.

- `chore`: any changes that do not touch business logic.

Well, now you know how to contribute to this repository. Thank you for your efforts — they are priceless.