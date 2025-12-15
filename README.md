# MCP Policy Server

Small development notes for running the project on Windows.

## Development (fast, runs TypeScript in-place)

Recommended (works in cmd.exe and any shell):

- Run the loader directly (no npm script required):

  node --loader ts-node/esm src/index.ts

- NPM script that runs the same command:

  npm run dev

Note: On some PowerShell setups the `npm` shim script (npm.ps1) may be blocked by execution policy. If you see an error like `cannot be loaded because running scripts is disabled on this system`, either run the direct `node` command above, or run in `cmd.exe`.

## PowerShell workaround

If you want to allow running `npm` scripts from PowerShell, run PowerShell as Administrator and then:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Be sure to understand the security implications for your environment before changing execution policy.

## Production build

Build to JavaScript and run from `dist`:

  npm run build
  npm start

This repository uses ESM with `module: "NodeNext"` in `tsconfig.json`, so emitted JS files will reference `.js` imports correctly.
