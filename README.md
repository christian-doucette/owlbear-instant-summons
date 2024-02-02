# Instant Summons - Owlbear Rodeo Extension

Instantly summon (upload) DnD 5e monster tokens onto your battlemap

## Usage
Pick a monster from the dropdown list, then double click on a square to add it to the scene

Useful for randomly rolled encounters, players polymorphing, or other cases where you want quick monster tokens without crowding your token storage

https://github.com/christian-doucette/owlbear-instant-summons/assets/64502867/3327c11f-6c2a-407a-8f56-0c1248fb4178

## Installing
The extension can be installed by pasting the manifest link to the Add Custom Extension option in Owlbear

```
https://instant-summons.pages.dev/manifest.json
```

Note: you have to enable the extension in any rooms you've already created

https://github.com/christian-doucette/owlbear-instant-summons/assets/64502867/7d177ca0-b473-4f03-874f-1a901c75e164

## Running Locally
Install all dependencies:

```
npm install
```

Run locally:

```
npm run dev
```

You can then use this local version in Owlbear by adding a custom extenion using its manifest (http://localhost:5173/manifest.json)

Build for production:

```
npm run build
```

Run linter:

```
npx eslint --fix .
```

## Notes
- The feature is only available for GMs (by choice, since the list of monsters might be a spoiler for players)
- I use [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) for privacy-first web analytics