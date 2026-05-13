# KYLDSVCARDS - Dynamic Animated vCard QR System

A stylish, modern contact card QR code system with Node.js, Express, MongoDB Atlas, TailwindCSS, and beautiful animated UI. 

## Features
- Mobile-friendly, glassy vCard creation UI (naval blue theme)
- Image upload with live preview
- Per-card password protection (bcrypt hashed)
- Secure API (no password ever returned to client)
- QR codes link to public card viewer (not direct card data leak)
- vCard (.vcf) download for instant "Add to Contacts"
- Deploy on Render, MongoDB Atlas

## Usage
1. Clone repo & `npm install`
2. Add a `.env` file (see `.env.example`)
3. `npm run start` or `node server.js`
4. Open `http://localhost:3000` to create a new card

## Folder Structure
- /models: Mongoose data models
- /routes: Express route handlers
- /public: Frontend assets (Tailwind, JS, images)

## Customization
- Frontend uses TailwindCSS + custom CSS variables for theme
- Animations: card pop, glassmorphism, QR fade, modal transitions

## Credits & License
- Code, UI: Copilot + HasnainShabbir16
- MIT License
