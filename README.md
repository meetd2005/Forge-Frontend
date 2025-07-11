# Forge Frontend

A modern, responsive frontend for the Forge blogging platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Next.js 14** with App Router
- 🎨 **Modern UI** with Tailwind CSS and shadcn/ui
- 🔐 **Authentication** with Google OAuth and JWT
- 📝 **Rich Text Editor** with TipTap
- 🌙 **Dark Mode** support
- 📱 **Responsive Design** for all devices
- 🔒 **Protected Routes** and role-based access
- 🎯 **TypeScript** for type safety
- 📊 **GraphQL** integration with Apollo Client

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Rich Text**: TipTap Editor
- **State Management**: React Context + Apollo Client
- **Authentication**: JWT + Google OAuth
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/meetd2005/Forge-Frontend.git
   cd Forge-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the `.env.local` file with your configuration.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── public/             # Static assets
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## Key Features

### Authentication
- Google OAuth integration
- JWT token management
- Protected routes
- User session management

### Rich Text Editor
- TipTap-based editor
- Image uploads
- Formatting tools
- Character count

### UI Components
- Modern design system
- Dark/light mode
- Responsive layouts
- Accessible components

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
