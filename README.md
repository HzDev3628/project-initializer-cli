# Speed CLI ⚡️ (BETA)

This about **speed-up** your time for **first step in initialization project**.
<img src="https://maroon-spare-jay-600.mypinata.cloud/ipfs/bafkreih352c6itbhbf3qyrtge74xzl4imafub4pohyuu2r3gzufpjetxcy" />

## How to use
First, you need to install the CLI globally:

```
npm install -g speed-cli
```
After that, you can already use it. Just run the `-h` flag to see all available commands.

```
speed-cli -h
```

### Example with Next.js
Use some key words, for initialization project. For example, we use nextjs key word. 

```
speed-cli nextjs <example-project> [flags]
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
Licensed under the <a href="https://github.com/HzDev3628/speed-cli/blob/main/LICENSE">MIT License.</a>