# 🌿 Ability Buddy

**Empowering independence through shared knowledge**

A community-driven platform where people with disabilities share practical daily living hacks, adaptive solutions, and life-changing tips that others might find helpful. Built with accessibility and independence at its core.

## 🎯 **The Vision**

We all develop specialized knowledge adapting to our unique challenges - from using your phone's camera to find dropped glasses when your vision is poor, to creative household item hacks that solve unexpected problems. Ability Buddy makes it easy to share these discoveries and find solutions from others who understand.

> *"Instead of writing out tips individually whenever I meet someone who might benefit, I wanted a place where our deep, specialized knowledge could help anyone facing similar challenges."* - Creator

## ✨ **Key Features**

- 🔍 **Smart Filtering** - Find resources by symptoms, body systems, or tags
- 💡 **Practical Focus** - Daily living hacks, tech solutions, and low-barrier adaptations  
- 👤 **Simple Sharing** - Easy resource creation with detailed descriptions and media
- ❤️ **Helpful Feedback** - Like system to highlight the most useful resources
- 🎨 **Accessible Design** - WCAG 2.1 AA compliant with nature-inspired, calming UI
- 🔐 **Secure Auth** - Google OAuth and email/password options

## 🛠️ **Tech Stack**

**Modern & Robust Architecture:**
- **Frontend**: Next.js 14+ with React 18+ and TypeScript
- **Database**: MySQL 8.0 with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Styling**: Tailwind CSS + Shadcn UI + Radix UI primitives
- **Hosting**: Railway with automated CI/CD
- **Architecture**: Server-side rendering with optimized performance

**Design System:**
- Nature-inspired visual theme with organic shapes and plant motifs
- Accessibility-first color palette (bright green, sky blue, sunshine yellow)
- High-contrast mode support
- Mobile-first responsive design

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+ (or use Railway's managed MySQL)
- Google Cloud Platform account (for OAuth)

### Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your local configuration
   ```

3. **Database setup:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

### Production Deployment

This app is configured for Railway deployment with:
- Automated builds from GitHub
- Managed MySQL database
- Environment variable management
- Custom domain support

## 🗃️ **Database Schema**

**Core Models:**
- **Users** - Authentication and profile data
- **Resources** - Shared tips and solutions
- **Tags** - Dynamic categorization system
- **Likes** - Community feedback mechanism
- **ResourceTags** - Many-to-many tag relationships

**Key Features:**
- Secure password hashing with bcrypt
- NextAuth.js integration for OAuth
- Body system categorization
- Media attachment support

## 🎨 **Design Philosophy**

**Accessibility First:**
- WCAG 2.1 AA compliance throughout
- Screen reader compatibility
- Keyboard navigation support
- High contrast mode option
- Alternative text for all images

**Nature-Inspired Theme:**
- Calming color palette promoting well-being
- Organic shapes and flowing design elements
- Subtle animations that enhance rather than distract
- Focus on clarity and ease of use

## 🔐 **Security & Privacy**

- Secure authentication with NextAuth.js
- Encrypted password storage
- Minimal personal data collection
- User data deletion capabilities
- Environment-specific secret management

## 📚 **Environment Variables**

See `.env.example` for required configuration. All production secrets are managed securely through Railway's environment system.

## 🌟 **Impact**

Built by someone with lived experience of chronic illness, this platform aims to:
- Reduce isolation through shared knowledge
- Promote independence and self-advocacy
- Create a judgment-free space for practical solutions
- Bridge the gap between formal resources and real-world adaptations

---

**Live Demo**: [ability-buddy.com](https://ability-buddy.com)

**Tech Portfolio**: This project demonstrates modern full-stack development with accessibility, security, and user experience as primary concerns.

---

*Built with 💚 for the disability community* 