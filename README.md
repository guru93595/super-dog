# Super Dog

Super Dog is a lightweight Windows desktop pet made with Electron. A Shih Tzu follows the cursor and can play, sleep, visit its house, change appearance, and be renamed from the system tray.

## Requirements

- Windows 10 or newer
- Node.js 20 or newer

## Development

Install dependencies and start the app:

```bat
npm install
npm start
```

Run validation and tests:

```bat
npm run check
npm test
```

## Packaging

Create a Windows installer and portable executable:

```bat
npm run package
```

Build artifacts are written to `dist/`. The packaged app stores its settings in Electron's per-user application data directory.

## Features

- Cursor-following animated dog
- Ball, house, and sleep behaviors
- White, golden, and black-and-white pets
- Tray menu and persistent pet name
- Multiple-monitor support
- Installer and portable Windows builds

## Limitations

The dog is an always-on-top transparent overlay and intentionally ignores mouse clicks, so it cannot be dragged directly. Use the tray menu to control it.
