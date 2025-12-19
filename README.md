# Nara Onboarding System

A modern, full-stack HR onboarding platform built with Next.js 15 that streamlines employee onboarding through task management, reusable templates, and AI-powered insights.

## Overview

This application helps HR teams efficiently onboard new employees by:
- Managing and tracking onboarding tasks assigned to employees
- Creating reusable task templates for common onboarding scenarios
- Automatically assigning default templates to new hires
- Generating AI-powered insights on onboarding progress using Google Gemini

## Key Features

### Employee Management
- Create, view, update, and delete employee records
- Track employee information (name, email, department)
- Monitor onboarding completion status
- Visual progress indicators for task completion

### Task Management
- Assign tasks to individual employees
- Mark tasks as complete with checkbox interface
- Edit task details (title and description)
- Real-time task completion tracking

### Template System
- Create reusable onboarding task templates
- Set a default template that auto-assigns to new employees
- Manually assign specific templates to employees
- Add/remove tasks from templates

### AI-Powered Insights
- Generate intelligent overviews of onboarding progress using Google Gemini 2.0 Flash
- Receive actionable recommendations for pending tasks
- Analyze completion rates and identify bottlenecks

### Search & Filter
- Server-side search across employees, departments, and tasks
- URL-based search queries (shareable links)
- Real-time filtering with loading states

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui + Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **ORM**: Prisma Client
- **Database**: PostgreSQL (hosted on Supabase)
- **Authentication**: Supabase Auth (configured)
- **AI**: Google Gemini 2.0 Flash

## Database Schema

The application uses a PostgreSQL database with the following models:

- **Employee**: Stores employee information and onboarding status
- **Task**: Individual tasks assigned to employees
- **Template**: Reusable task templates
- **TemplateTask**: Tasks within templates

All relationships use cascade deletion for data integrity.

## Getting Started

### Prerequisites

Before running this application, you'll need:
- Node.js 18+ installed
- A Supabase account with a PostgreSQL database
- (Optional) Google Gemini API key for AI features

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

# Database URLs
DATABASE_URL=postgresql://user:password@host:port/database?pgbouncer=true
DIRECT_URL=postgresql://user:password@host:port/database

# AI Configuration (Optional - required for AI Overview feature)
GEMINI_API_KEY=your-gemini-api-key
```

**Finding your Supabase credentials:**
1. Go to your [Supabase project dashboard](https://app.supabase.com)
2. Navigate to Project Settings > API
3. Copy the Project URL and anon/public key
4. Navigate to Project Settings > Database
5. Copy the connection string for DATABASE_URL and DIRECT_URL

**Getting a Gemini API key:**
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Create a new API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nextjs-with-supabase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

4. **Push database schema to Supabase**
   ```bash
   npx prisma db push
   ```

5. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```
   This creates sample employees and tasks for testing.

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
nextjs-with-supabase/
├── app/
│   ├── api/                    # API routes for CRUD operations
│   │   ├── employees/          # Employee endpoints
│   │   ├── tasks/              # Task endpoints
│   │   ├── templates/          # Template endpoints
│   │   └── ai-overview/        # AI insights endpoint
│   ├── hr/                     # Main application pages
│   │   ├── dashboard/          # Dashboard with employee list
│   │   ├── employees/          # Employee management
│   │   ├── templates/          # Template management
│   │   └── components/         # Shared components
│   └── auth/                   # Authentication pages (configured)
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── blocks/                 # Custom blocks (sidebar, etc.)
├── lib/
│   ├── db/                     # Prisma query functions
│   │   ├── employees.ts        # Employee operations
│   │   ├── tasks.ts            # Task operations
│   │   └── templates.ts        # Template operations
│   ├── supabase/               # Supabase client setup
│   ├── prisma.ts               # Prisma client singleton
│   └── utils.ts                # Utility functions
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeding script
└── public/                     # Static assets
```

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run db:seed    # Seed database with sample data
```

## Usage Guide

### Creating an Employee
1. Navigate to the Employees page
2. Click "Add Employee"
3. Fill in name, email, and department
4. If a default template exists, tasks will be automatically assigned

### Managing Templates
1. Go to the Templates page
2. Create a new template with a name and description
3. Add tasks to the template
4. Set as default for auto-assignment to new employees
5. Manually assign templates to existing employees

### Tracking Progress
1. View the Dashboard for an overview of all employees
2. Check task completion progress bars
3. Click checkboxes to mark tasks as complete
4. Use the search bar to filter employees or tasks

### AI Insights
1. Click "Generate AI Overview" on the Dashboard
2. Wait for the AI to analyze all employee data
3. Review personalized recommendations
4. Regenerate for updated insights

## Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy!

Vercel will automatically:
- Run `prisma generate` during build
- Deploy your Next.js application
- Set up preview deployments for branches

### Build Configuration

The build command is already configured in `package.json`:
```bash
prisma generate && next build
```

## Security Notes

- Supabase authentication is configured but not actively enforced
- API routes are currently unprotected
- For production use, implement route protection and authentication
- Never commit `.env.local` to version control

## Contributing

This is a production-ready template that can be extended with:
- User authentication and authorization
- Email notifications for task assignments
- Real-time updates with WebSockets
- Analytics dashboard for onboarding metrics
- File upload capabilities for documents
- Role-based access control

## Documentation

For detailed technical documentation, including:
- Complete API reference
- Database schema details
- Component architecture
- Data flow diagrams

See [COMPREHENSIVE_APP_DOCUMENTATION.md](./COMPREHENSIVE_APP_DOCUMENTATION.md)

## Tech Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Google Gemini AI](https://ai.google.dev/)

## icense

This project is open source and available for use and modification.

## Troubleshooting

### Common Issues

**"Error: Prisma Client not found"**
```bash
npx prisma generate
```

**"Database connection failed"**
- Verify your DATABASE_URL and DIRECT_URL in `.env.local`
- Ensure your Supabase database is running
- Check if your IP is whitelisted in Supabase

**"AI Overview not working"**
- Verify GEMINI_API_KEY is set correctly
- Check if your API key is valid and has not expired
- AI features are optional and the app works without them

**Port 3000 already in use**
```bash
npm run dev -- -p 3001
```

## Support

For issues, questions, or contributions, please open an issue on the repository.

---

Built with Next.js, Prisma, Supabase, and Google Gemini AI
