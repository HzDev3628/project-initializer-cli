# Project Initializer CLI ⚡️ (BETA)

This about **speed-up** your time for **first step in initialization project**.
<img src="https://maroon-spare-jay-600.mypinata.cloud/ipfs/bafkreigtw7ftlg66alsortigf37wytcm7ackow3o7zllo3vwihc2uypmt4" />

## AI support coming soon

## How to use
There are **two** options for using the CLI:
1. You can install the CLI globally:
    ```
    npm install -g project-initializer-cli
    ```
    and use the keyword `pic` to start the script.

2. You can use the CLI with a package manager:
    ```
    npx project-initializer-cli@latest
    ```

### Example with Next.js
Before initialization the project, **select directory** where you want place to project it.

Use some key words, for initialization project. For example, we use nextjs key word. 

```
pic nextjs <example-project> [flags]
```
or
```
npx project-initializer-cli@latest nextjs <example-project> [flags]
```
After you'll see options with beauty UI

```
Select your package manager:
  - npm
  - pnpm
  - yarn
  - bun
  
Add Turbopack ?
  Yes / No
  
Add Tailwind CSS ?
  Yes / No
  
Add Shadcn UI ?
  Yes / No (default if project without Tailwind)

What do you like use ?
  Biome / ESlint
```
Additionally, you can use `-g <repo link>` to initialize a commit and push it to the specified repository.

## Contributing
Please, before your contribution, read the <a href="https://github.com/HzDev3628/project-initializer-cli/blob/main/CONTRIBUTING.md">contributing guide</a>.

## License
Licensed under the <a href="https://github.com/HzDev3628/project-initializer-cli/blob/main/LICENSE">MIT License.</a>