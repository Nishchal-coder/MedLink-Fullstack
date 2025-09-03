# MedLink Landing Page

A modern, responsive landing page for MedLink - a centralized healthcare data platform. Built with React, TypeScript, TailwindCSS, and Framer Motion.

## Features

- 🎨 **Modern Design**: Clean, professional healthcare-focused design
- 📱 **Mobile-First**: Fully responsive across all devices
- ⚡ **Smooth Animations**: Framer Motion animations for enhanced UX
- 🎯 **SEO Optimized**: Proper meta tags and semantic HTML
- ♿ **Accessible**: WCAG compliant design patterns
- 🚀 **Performance**: Optimized for fast loading

## Sections

1. **Header/Navbar**: Logo and navigation with mobile menu
2. **Hero Section**: Main headline, subheadline, and CTA buttons
3. **About Section**: Mission explanation with feature highlights
4. **Features Section**: Four key features in a grid layout
5. **How It Works**: Three-step process visualization
6. **Contact Section**: Contact form with additional contact info
7. **Footer**: Company info, links, and social media

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Vite** - Fast build tool and dev server

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd medlink-landing
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

The build files will be in the `build` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Hero section
│   ├── About.tsx       # About section
│   ├── Features.tsx    # Features grid
│   ├── HowItWorks.tsx  # Process steps
│   ├── Contact.tsx     # Contact form
│   └── Footer.tsx      # Footer
├── App.tsx             # Main app component
├── index.tsx           # Entry point
└── index.css           # Global styles & TailwindCSS
```

## Customization

### Colors

The color scheme can be customized in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    // ... more shades
  }
}
```

### Content

Update the content in each component file to match your specific needs.

### Styling

Modify the TailwindCSS classes in the components or add custom CSS in `src/index.css`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support or questions, please contact the development team or create an issue in the repository.
