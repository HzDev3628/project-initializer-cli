# Project Initializer CLI ⚡️ (BETA)

This about **speed-up** your time for **first step in initialization project**.
<img src="https://maroon-spare-jay-600.mypinata.cloud/ipfs/bafkreigtw7ftlg66alsortigf37wytcm7ackow3o7zllo3vwihc2uypmt4" />

## How to use
First, you need to install the CLI globally:

```
npm install -g project-initializer-cli
```
After that, you can already use it. Just run the `-h` flag to see all available commands.

```
pic -h
```

### Example with Next.js
Use some key words, for initialization project. For example, we use nextjs key word. 

```
pic nextjs <example-project> [flags]
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
TODO

## License
Licensed under the <a href="https://github.com/HzDev3628/project-initializer-cli/blob/main/LICENSE">MIT License.</a>