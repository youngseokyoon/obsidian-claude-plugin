# Development Guide

## Setup

```bash
npm install
```

## Development Mode

The dev script automatically:
1. Finds all your Obsidian vaults
2. Lets you select which vault to use
3. Installs hot-reload plugin (if not already installed)
4. Copies the plugin to the vault
5. Watches for changes and rebuilds automatically

```bash
npm run dev
```

After running this command:
- Select your vault from the list
- The plugin will be automatically installed
- Any code changes will trigger a rebuild
- Obsidian will hot-reload the plugin automatically

## Building

```bash
npm run build
```

## Code Formatting

Format all code with prettier:

```bash
npm run format
```

## Project Structure

```
obsidian-cloudflare-plugin/
├── src/
│   ├── publish.ts           # Main plugin entry point
│   ├── pasteListener.ts     # Paste event handler
│   ├── ui/
│   │   └── publishSettingTab.ts  # Settings UI
│   └── uploader/
│       ├── imageUploader.ts      # Uploader interface
│       ├── r2/
│       │   └── r2Uploader.ts     # R2 implementation
│       └── uploaderUtils.ts      # Utility functions
├── scripts/
│   └── dev.js              # Development automation
├── esbuild.config.mjs      # Build configuration
├── manifest.json           # Plugin manifest
└── package.json
```

## Hot Reload

The dev script automatically installs and configures [hot-reload](https://github.com/pjeby/hot-reload) plugin. This means:
- No need to manually reload Obsidian
- Changes are reflected immediately
- Faster development cycle

## Tips

1. **First time setup**: Run `npm run dev` and select your test vault
2. **Code changes**: Just save your files, hot-reload handles the rest
3. **Settings changes**: Modify `manifest.json` and the dev script will copy it
4. **Clean build**: Run `npm run build` before committing
