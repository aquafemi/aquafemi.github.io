# femi.xyz

Personal portfolio + playground website.

## About

A minimalist portfolio showcasing software engineering projects using a Windows XP-inspired design.

## Tech Stack

- **HTML/CSS/JS**: Pure vanilla implementation (no frameworks)
- **Hosting**: Cloudflare Pages
- **DNS**: Cloudflare
- **Domain**: [femi.xyz](https://femi.xyz)

## Features

- Static site (no build process required)
- Progressive Web App (PWA) support
- Responsive design
- Fast global CDN delivery via Cloudflare

## Development

To run locally:

```bash
# Start a local server
python3 -m http.server 8000

# Visit http://localhost:8000
```

## Deployment

Automatically deployed to Cloudflare Pages on push to `master` branch.

## Todo

- [ ] XP Error Messages — random BSOD or error dialog popups
- [ ] Minesweeper window
- [ ] Solitaire window
- [ ] Pinball window (3D Pinball Space Cadet)
- [ ] Notepad window with a README.txt
- [ ] Recycle Bin desktop icon
- [ ] Internet Explorer window
- [ ] WinAmp-style music player window
- [ ] Language toggle — switch all site text between English and Japanese

## Structure

```
.
├── index.html                    # Homepage
├── assets/
│   ├── css/style.css            # Compiled styles
│   ├── scripts/                 # JavaScript files
│   ├── images/                  # Images and graphics
│   └── fonts/                   # Web fonts
└── manifest.json                # PWA manifest
```
