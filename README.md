# Cross-Platform Food Catalog Assignment

A single-page React Native + Expo application designed for Android, iOS and Web.

## Requirements implemented

- Category panel:
  - Mobile: horizontal category panel at the top.
  - Web: category panel on the left.
- Scroll syncing:
  - As the user scrolls, the category matching the section near the top becomes active.
  - Clicking a category scrolls to that category.
- Cart state:
  - Implemented with React Context API.
  - The state is shared across all product cards.
  - `+` adds an item.
  - Once added, `+` becomes `−`.
  - `−` removes the item.
  - A bottom cart summary shows selected item count and total.
- Responsive product layout for mobile and web.
- No external UI library is required.

## Important note about the Figma reference

The supplied Figma URL could not be fetched in the development environment, so the implementation follows the written requirements and uses a clean food-ordering visual style. If the evaluator expects pixel-level matching to the Figma file, compare the Snack preview with the Figma design and adjust colors, spacing, typography and assets.

## Run locally in VS Code

### 1. Install Node.js

Install a current LTS version of Node.js if it is not already installed.

### 2. Open this folder in VS Code

Open the `cross_platform_food_catalog` folder.

### 3. Install dependencies

```bash
npm install
```

### 4. Start Expo

```bash
npx expo start
```

For web:

```bash
npx expo start --web
```

For Android/iOS with Expo Go, scan the QR code shown by Expo.

## Create the required Expo Snack

The assignment specifically asks for an Expo Snack.

1. Open https://snack.expo.dev/
2. Sign in to Expo.
3. Create a new Snack.
4. Replace `App.js` with the `App.js` from this project.
5. Set the project dependencies/package.json to match the included `package.json` if Snack asks for dependencies.
6. Select Android, iOS and Web in the Snack preview.
7. Wait until the preview shows no errors.
8. Save the Snack.
9. Use the Share option and copy the Snack URL.
10. Submit that URL as the solution link.

Snack supports Android, iOS and Web previews and is designed for sharing Expo projects. Expo's documentation also describes Snack as an in-browser Expo development environment.

## Suggested test checklist

### Mobile
- Categories appear at the top.
- Swipe categories horizontally.
- Tap a category and verify the content scrolls to it.
- Scroll the products and verify the active category changes.
- Tap `+` on an item.
- Verify it changes to `−`.
- Verify the cart summary appears.
- Tap `−` and verify the item is removed.

### Web
- Categories appear on the left.
- Scroll the page.
- Verify the selected category follows the visible section.
- Click a category and verify the page scrolls to that section.
- Add/remove products and verify the shared cart state.

## Source structure

```text
cross_platform_food_catalog/
├── App.js
├── app.json
├── package.json
└── README.md
```
