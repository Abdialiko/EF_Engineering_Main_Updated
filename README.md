# EF Engineering - New Website

This is the new website for EF Engineering built with Next.js 13+ App Router, TypeScript, and Tailwind CSS.

## Project Structure

```
app/                 # Next.js App Router pages
  about/             # About page
  services/          # Services page
  projects/          # Projects page
  gallery/           # Gallery page
  news/              # News page
  collaborators/     # Collaborators page
  clients/           # Clients page
  partners/          # Partners page
  vacancy/           # Career opportunities page
  profile/           # Company profile page
  contact/           # Contact page
  faq/               # FAQ page
  layout.tsx         # Root layout with Header component
  page.tsx           # Homepage
components/          # Reusable components
  Header.tsx         # Header component with navigation
public/              # Static assets
  images/            # Images organized by type
    logo/            # Logo images
    hero/            # Hero images
    social/          # Social media images
tailwind.config.js   # Tailwind CSS configuration
postcss.config.js    # PostCSS configuration
package.json         # Project dependencies and scripts
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Start production server:
   ```bash
   npm start
   ```

## Company Colors

- Primary Blue: #123B8B
- Accent Orange: #F2AF18

These colors are configured in `tailwind.config.js` as `primary` and `accent` respectively.# EF_Engineering_Main
