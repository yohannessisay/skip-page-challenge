# Skip Hire Challenge

A modern, responsive React application for skip hire services built as part of a coding challenge. The application allows users to browse and select skip hire options with a completely redesigned interface while maintaining full functionality.

## 🚀 Live Demo

- **Live website**:[https://skip-page-challenge.vercel.app/](https://skip-page-challenge.vercel.app/)

## 📋 Challenge Requirements

- ✅ Complete page redesign with modern UI/UX
- ✅ Maintain original functionality
- ✅ Fully responsive design (mobile & desktop)
- ✅ Clean, maintainable React code
- ✅ Integration with provided API data
- ✅ TypeScript implementation

## 🛠️ Tech Stack

### Core Technologies

- **React 18.3.1** - Modern React with hooks
- **TypeScript 5.5.3** - Type-safe development
- **Vite 5.4.1** - Fast build tool and dev server
- **React Router DOM 6.26.2** - Client-side routing

### UI & Styling

- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built on Radix UI
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful & consistent icons
- **next-themes** - Dark/light theme support

### State Management & Data Fetching

- **TanStack Query (React Query) 5.56.2** - Powerful data synchronization for server state management
  - Smart caching and background updates
  - Optimistic updates and error handling
  - Prefetching and pagination support
  - Automatic retry logic and stale-while-revalidate
- **Zod 3.23.8** - TypeScript-first schema validation

### Additional Libraries

- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Conditional CSS classes
- **date-fns** - Modern JavaScript date utility library
- **Sonner** - Toast notifications

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**
2. ```bash
   git clone https://github.com/yohannessisay/skip-page-challenge.git
   cd skip-page-challenge
   npm install
   npm run dev

   ```

   Before runing the projectr set this environment values by creating .env file

   > VITE_API_BASE_URL=https://app.wewantwaste.co.uk/api
   > VITE_APP_NAME=Skip Hire Challenge
   > VITE_DEFAULT_POSTCODE=NR32
   > VITE_DEFAULT_AREA=Lowestoft
   >

## 🏆 Performance & Quality

### Lighthouse Scores

Curently the existing page scores this in lighthouse is

- **Accessibility**: 92/100 ✅
- **Best Practices**: 100/100 ✅
- **SEO**: 91/100 ✅
- **Performance**: 71/100

This project achieves improved web standards compliance:

- **Accessibility**: 100/100 ✅
- **Best Practices**: 100/100 ✅
- **SEO**: 100/100 ✅
- **Performance**: 95+/100 ⚡

  The background image uses svg and css tricks to apply the effect so no image is being loaded thus no performance is affected , also it can be removed to instead use a gradient backround or solid color background.

#### Performance Notes

The performance score is not 100% due to optimization opportunities that are typically handled at the infrastructure level:

- **Enable text compression**: Potential savings of 2,788 KiB - resolved by configuring gzip/brotli compression in nginx/server
- **Minify JavaScript**: Handled by production build tools and CDN optimization

These optimizations are outside the scope of frontend development and would be addressed through proper server configuration and deployment pipeline setup.
