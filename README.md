# femi.xyz

Personal portfolio website for Femi Olukoya.

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

## Structure

```
.
├── index.html                    # Homepage
├── assets/
│   ├── css/style.css            # Compiled styles
│   ├── scripts/                 # JavaScript files
│   ├── images/                  # Images and graphics
│   └── fonts/                   # Web fonts
├── [project-name]/              # Individual project pages
│   └── index.html
└── manifest.json                # PWA manifest
```
