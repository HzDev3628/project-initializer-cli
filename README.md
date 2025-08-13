# Project Initializer CLI ⚡️ 

This about **speed-up** your time for **first step in initialization project**.
<img src="https://maroon-spare-jay-600.mypinata.cloud/ipfs/bafkreiev6vsi5g5yqstlrq3srzpqs3kfoqvbcx75c3oxhw5fp5ilpv4rqu" />

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

### Example
Before initialization the project, **select directory** where you want place to project it. Also you can add option a like this:`-c ~/<your dir>`.

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

Also you can use just global command, like this:
```
npx project-initializer-cli@latest
```
Create any project with any settings using a single command.

## Contributing
Please, before your contribution, read the <a href="https://github.com/HzDev3628/project-initializer-cli/blob/main/CONTRIBUTING.md">contributing guide</a>.

## License
Licensed under the <a href="https://github.com/HzDev3628/project-initializer-cli/blob/main/LICENSE">MIT License.</a>