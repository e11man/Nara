# 📚 COMPREHENSIVE APPLICATION DOCUMENTATION
## Nara Onboarding System - Complete Technical Overview

---

## 🎯 **APPLICATION OVERVIEW**

This is a **Next.js 15** full-stack HR onboarding management system, Nara, that helps HR teams onboard new employees by managing tasks, creating reusable templates, and providing AI-powered insights.

### **Core Purpose**
- Streamline employee onboarding processes
- Track tasks assigned to employees
- Create reusable task templates for common onboarding scenarios
- Automatically assign default templates to new employees
- Generate AI-powered overviews of onboarding progress

---

## 🏗️ **ARCHITECTURE STACK**

### **Frontend**
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui + Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Theme**: next-themes (light/dark mode support)

### **Backend**
- **Runtime**: Node.js (Next.js API Routes)
- **ORM**: Prisma Client
- **Database**: PostgreSQL (hosted on Supabase)
- **Authentication**: Supabase Auth (SSR-enabled)
- **AI**: Google Gemini 2.0 Flash

### **Key Dependencies**
```json
{
  "@prisma/client": "^6.19.0",
  "@google/generative-ai": "^0.24.1",
  "@supabase/ssr": "latest",
  "@supabase/supabase-js": "latest",
  "next": "latest",
  "react": "^19.0.0",
  "framer-motion": "^12.23.24",
  "lucide-react": "^0.511.0"
}
```

---

## 🗄️ **DATABASE SCHEMA (PRISMA)**

### **1. Employee Model**
Represents employees being onboarded.

```prisma
model Employee {
  id           String    @id @default(cuid())
  name         String
  email        String    @unique
  department   String?
  onboarded    Boolean   @default(false)
  tasks        Task[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

**Fields:**
- `id`: Unique identifier (CUID)
- `name`: Employee full name
- `email`: Unique email address
- `department`: Optional department (e.g., "Engineering", "Product")
- `onboarded`: Boolean flag indicating completion status
- `tasks`: One-to-many relationship with Task model
- `createdAt/updatedAt`: Timestamps

---

### **2. Task Model**
Represents individual tasks assigned to employees.

```prisma
model Task {
  id           String    @id @default(cuid())
  title        String
  description  String?
  isComplete   Boolean   @default(false)
  employeeId   String 
  employee     Employee  @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

**Fields:**
- `id`: Unique identifier
- `title`: Task name
- `description`: Optional details
- `isComplete`: Completion status
- `employeeId`: Foreign key to Employee
- `employee`: Relation to Employee (CASCADE delete)
- Timestamps

**Cascade Delete**: When an employee is deleted, all their tasks are automatically deleted.

---

### **3. Template Model**
Reusable task templates for common onboarding scenarios.

```prisma
model Template {
  id           String         @id @default(cuid())
  name         String
  description  String?
  isDefault    Boolean        @default(false)
  tasks        TemplateTask[]
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
}
```

**Fields:**
- `id`: Unique identifier
- `name`: Template name (e.g., "Engineering Onboarding")
- `description`: Optional description
- `isDefault`: If true, automatically assigned to new employees
- `tasks`: One-to-many relationship with TemplateTask
- Timestamps

**Auto-Assignment**: Only ONE template can be marked as default at a time. When a new employee is created, the default template's tasks are automatically copied to that employee.

---

### **4. TemplateTask Model**
Individual tasks within a template.

```prisma
model TemplateTask {
  id           String    @id @default(cuid())
  title        String
  description  String?
  templateId   String
  template     Template  @relation(fields: [templateId], references: [id], onDelete: Cascade)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

**Fields:**
- `id`: Unique identifier
- `title`: Task title
- `description`: Optional details
- `templateId`: Foreign key to Template
- `template`: Relation to Template (CASCADE delete)
- Timestamps

---

## 🔌 **ORM LAYER (Database Interactions)**

### **Prisma Client Singleton Pattern**
`lib/prisma.ts`:
```typescript
const prismaClientSingleton = () => new PrismaClient()
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
```

**Why**: Prevents multiple Prisma client instances in development (hot reload).

---

### **Employee Operations** (`lib/db/employees.ts`)

#### **1. Get All Employees with Tasks**
```typescript
getAllEmployeesWithTasks()
```
- Fetches all employees with their tasks included
- Orders tasks by `createdAt DESC`
- Orders employees by `createdAt DESC`
- Used by: Dashboard, Employees page

#### **2. Get Employee by ID**
```typescript
getEmployeeById(id: string)
```
- Fetches single employee with tasks
- Returns `null` if not found

#### **3. Create Employee**
```typescript
createEmployee(data: { name, email, department? })
```
- Creates new employee record
- Returns created employee object

#### **4. Update Employee**
```typescript
updateEmployee(id: string, data: { name?, email?, department?, onboarded? })
```
- Partial update (only provided fields)
- Can update onboarding status

#### **5. Delete Employee**
```typescript
deleteEmployee(id: string)
```
- Deletes employee record
- CASCADE deletes all associated tasks

---

### **Task Operations** (`lib/db/tasks.ts`)

#### **1. Create Task**
```typescript
createTask(data: { title, description?, employeeId })
```
- Creates task for specific employee
- `isComplete` defaults to `false`

#### **2. Get Task by ID**
```typescript
getTaskById(id: string)
```
- Fetches single task

#### **3. Update Task**
```typescript
updateTask(id: string, data: { title?, description?, isComplete? })
```
- Partial update
- Used for marking tasks complete

#### **4. Delete Task**
```typescript
deleteTask(id: string)
```
- Removes task from database

#### **5. Toggle Task Complete**
```typescript
toggleTaskComplete(id: string)
```
- Finds task, flips `isComplete` boolean
- Used by checkbox UI

---

### **Template Operations** (`lib/db/templates.ts`)

#### **1. Get All Templates with Tasks**
```typescript
getAllTemplatesWithTasks()
```
- Fetches all templates with their template tasks
- Orders by `createdAt DESC`

#### **2. Get Template by ID**
```typescript
getTemplateById(id: string)
```
- Fetches single template with tasks

#### **3. Create Template**
```typescript
createTemplate(data: { name, description? })
```
- Creates new template
- `isDefault` is `false` by default

#### **4. Update Template**
```typescript
updateTemplate(id: string, data: { name?, description? })
```
- Partial update

#### **5. Delete Template**
```typescript
deleteTemplate(id: string)
```
- Deletes template
- CASCADE deletes all template tasks

#### **6. Create Template Task**
```typescript
createTemplateTask(data: { title, description?, templateId })
```
- Adds task to specific template

#### **7. Delete Template Task**
```typescript
deleteTemplateTask(id: string)
```
- Removes task from template

#### **8. Get Default Template**
```typescript
getDefaultTemplate()
```
- Returns template where `isDefault = true`
- Includes all tasks

#### **9. Set Default Template**
```typescript
setDefaultTemplate(templateId: string)
```
- **Step 1**: Sets ALL templates `isDefault = false`
- **Step 2**: Sets target template `isDefault = true`
- Ensures only ONE default template exists

#### **10. Assign Template to Employee**
```typescript
assignTemplateToEmployee(templateId: string, employeeId: string)
```
- Fetches template with tasks
- Creates copies of all template tasks as employee tasks
- Uses `createMany` for bulk insert
- All new tasks start with `isComplete = false`

#### **11. Auto-Assign Default Template**
```typescript
autoAssignDefaultTemplate(employeeId: string)
```
- Called automatically when new employee is created
- Finds default template
- If exists, creates all template tasks for employee
- Returns result with template name and task count

---

## 🛣️ **API ROUTES (CRUD Operations)**

All API routes use Next.js 15 App Router conventions (`app/api/...`).

### **Employee Routes**

#### **GET /api/employees**
- Handler: `getAllEmployeesWithTasks()`
- Returns: Array of employees with tasks
- Used by: Dashboard, Employees page

#### **POST /api/employees**
- Body: `{ name, email, department? }`
- Validation: Requires `name` and `email`
- Process:
  1. Creates employee
  2. Calls `autoAssignDefaultTemplate(employee.id)`
  3. Returns employee + auto-assignment info
- Response:
```json
{
  "employee": {...},
  "autoAssigned": {
    "template": "Engineering Onboarding",
    "tasksCreated": 5
  }
}
```

#### **GET /api/employees/[id]**
- Returns: Single employee with tasks
- 404 if not found

#### **PUT /api/employees/[id]**
- Body: `{ name?, email?, department?, onboarded? }`
- Partial update support

#### **DELETE /api/employees/[id]**
- Deletes employee
- CASCADE deletes tasks

---

### **Task Routes**

#### **POST /api/employees/[id]/tasks**
- Creates task for specific employee
- Body: `{ title, description? }`
- Validation: `title` required

#### **PUT /api/tasks/[id]**
- Updates task
- Body: `{ title?, description?, isComplete? }`

#### **DELETE /api/tasks/[id]**
- Deletes task

---

### **Template Routes**

#### **GET /api/templates**
- Returns all templates with tasks

#### **POST /api/templates**
- Body: `{ name, description? }`
- Validation: `name` required

#### **GET /api/templates/[id]**
- Returns single template with tasks
- 404 if not found

#### **PUT /api/templates/[id]**
- Updates template metadata
- Body: `{ name?, description? }`

#### **DELETE /api/templates/[id]**
- Deletes template and cascade deletes template tasks

#### **POST /api/templates/[id]/tasks**
- Creates template task
- Body: `{ title, description? }`

#### **DELETE /api/template-tasks/[id]**
- Deletes specific template task

#### **POST /api/templates/[id]/set-default**
- Sets template as default
- Unsets all other templates
- Used for auto-assignment

#### **POST /api/templates/[id]/assign**
- Body: `{ employeeId }`
- Copies all template tasks to employee
- Manual assignment (alternative to auto-assign)

---

### **AI Overview Route**

#### **POST /api/ai-overview**
- **Purpose**: Generate AI-powered onboarding insights
- **AI Model**: Google Gemini 2.0 Flash
- **Process**:
  1. Fetches all employees with tasks
  2. Formats data for AI prompt
  3. Sends to Gemini API
  4. Returns AI-generated overview

**Data Format Sent to AI**:
```javascript
const employeeData = employees.map(emp => ({
  name: emp.name,
  department: emp.department || 'Not assigned',
  onboarded: emp.onboarded,
  tasks: emp.tasks.map(task => ({
    title: task.title,
    completed: task.isComplete
  }))
}))
```

**AI Prompt Template**:
```
You are an HR onboarding assistant analyzing employee progress.
Here is the current status of all employees:
[JSON data]

Please provide a concise, actionable overview of the onboarding status.
For each employee with incomplete tasks:
1. Address them by name
2. List their specific pending tasks
3. Provide priority recommendations

Keep the tone professional but friendly. Format your response in clear paragraphs, not bullet points. Focus on what needs to be done next.
```

**Response**:
```json
{
  "overview": "AI-generated text..."
}
```

**Error Handling**:
- Missing API key → 500 error
- Invalid API key → 401 error
- AI generation failure → 500 with error message
- No employees → Returns friendly message

---

## 🔍 **SEARCH FUNCTIONALITY**

### **Implementation Strategy**
The app uses **Server-Side Search** with URL query parameters.

### **How It Works**

#### **1. SearchBar Component** (`app/hr/components/SearchBar.tsx`)
```typescript
// Client-side component
const handleSearch = (term: string) => {
  const params = new URLSearchParams(searchParams);
  if (term) {
    params.set('q', term);  // Add search query
  } else {
    params.delete('q');     // Clear when empty
  }
  
  startTransition(() => {
    router.replace(`?${params.toString()}`);  // Update URL
  });
};
```

**Features**:
- Debounced via `useTransition` (prevents excessive re-renders)
- Updates URL query parameter `?q=search_term`
- Shows loading spinner while searching
- Preserves search term in URL (shareable links)

#### **2. Server-Side Filtering**

**Dashboard Page** (`app/hr/dashboard/page.tsx`):
```typescript
const query = searchParams.q || '';
// Passes query to EmployeeList component
<EmployeeList query={query} />
```

**EmployeeList Component**:
```typescript
const employees = query
  ? allEmployees.filter((emp) => 
      emp.name.toLowerCase().includes(query.toLowerCase()) ||
      emp.email.toLowerCase().includes(query.toLowerCase()) ||
      emp.department?.toLowerCase().includes(query.toLowerCase()) ||
      emp.tasks.some((task) => task.title.toLowerCase().includes(query.toLowerCase()))
    )
  : allEmployees;
```

**Search Criteria**:
- Employee name
- Employee email
- Department name
- Task titles

**Templates Page**: Similar filtering on:
- Template name
- Template description
- Template task titles

**Employees Page**: Filters on:
- Employee name
- Employee email
- Department

#### **Why Server-Side?**
- Better SEO (search queries in URL)
- Shareable search results
- No client-side hydration issues
- Instant back/forward navigation

---

## 🤖 **AI OVERVIEW LOGIC (DETAILED)**

### **Frontend Flow**

#### **1. AIOverviewButton** (`app/hr/dashboard/components/AIOverviewButton.tsx`)
```typescript
const [showModal, setShowModal] = useState(false);

<Button onClick={() => setShowModal(true)}>
  <Sparkles /> Generate AI Overview
</Button>

{showModal && <AIOverviewModal onClose={() => setShowModal(false)} />}
```

#### **2. AIOverviewModal** (`app/hr/dashboard/components/AIOverviewModal.tsx`)
```typescript
useEffect(() => {
  generateOverview();  // Auto-generate on mount
}, []);

const generateOverview = async () => {
  setIsLoading(true);
  const response = await fetch('/api/ai-overview', { method: 'POST' });
  const data = await response.json();
  setOverview(data.overview);
  setIsLoading(false);
};
```

**UI States**:
- **Loading**: Spinner + "Analyzing employee tasks..."
- **Success**: Displays AI-generated text in gradient box
- **Error**: Error message + "Try Again" button
- **Actions**: Regenerate button, Close button

### **Backend Flow**

#### **API Route** (`app/api/ai-overview/route.ts`)

**Step 1**: Validate Gemini API Key
```typescript
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) return 500 error
```

**Step 2**: Fetch Employee Data
```typescript
const employees = await getAllEmployeesWithTasks();
if (employees.length === 0) return friendly message
```

**Step 3**: Format Data for AI
```typescript
const employeeData = employees.map(emp => ({
  name: emp.name,
  department: emp.department || 'Not assigned',
  onboarded: emp.onboarded,
  tasks: emp.tasks.map(task => ({
    title: task.title,
    completed: task.isComplete
  }))
}));
```

**Step 4**: Create AI Prompt
```typescript
const prompt = `You are an HR onboarding assistant...
${JSON.stringify(employeeData, null, 2)}
...provide actionable overview...`;
```

**Step 5**: Call Gemini API
```typescript
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
const result = await model.generateContent(prompt);
const overview = result.response.text();
```

**Step 6**: Return Response
```typescript
return NextResponse.json({ overview });
```

### **AI Model Configuration**
- **Model**: Gemini 2.0 Flash
- **Temperature**: Default (not configured)
- **Max Tokens**: Default
- **Why Gemini**: Fast, cost-effective, good at summarization

---

## 🎨 **FRONTEND ARCHITECTURE**

### **App Structure**

```
app/
├── page.tsx                    # Landing page (redirects to /hr/dashboard)
├── layout.tsx                  # Root layout (theme provider)
├── globals.css                 # Global styles
├── hr/                         # Main HR section
│   ├── layout.tsx              # Sidebar layout
│   ├── page.tsx                # Redirects to dashboard
│   ├── dashboard/
│   │   ├── page.tsx            # Dashboard with search
│   │   └── components/
│   │       ├── EmployeeList.tsx       # Server component
│   │       ├── AIOverviewButton.tsx   # Client component
│   │       ├── AIOverviewModal.tsx    # Client component
│   │       └── TaskItem.tsx           # Task checkbox + edit/delete
│   ├── employees/
│   │   ├── page.tsx            # Employees table page
│   │   └── components/
│   │       ├── EmployeesTable.tsx     # Main table UI
│   │       ├── AddEmployeeModal.tsx   # Create employee form
│   │       ├── AddTaskModal.tsx       # Create task form
│   │       ├── EditTaskModal.tsx      # Edit task form
│   │       └── TaskList.tsx           # Expandable task list
│   ├── templates/
│   │   ├── page.tsx            # Templates grid page
│   │   └── components/
│   │       ├── TemplatesList.tsx          # Template cards
│   │       ├── CreateTemplateModal.tsx    # Create template
│   │       ├── AddTemplateTaskModal.tsx   # Add task to template
│   │       └── AssignTemplateModal.tsx    # Assign to employee
│   └── components/
│       └── SearchBar.tsx       # Reusable search component
└── api/                        # API routes (covered above)
```

---

### **Key Components Breakdown**

#### **1. HR Layout** (`app/hr/layout.tsx`)
```tsx
<SidebarProvider>
  <Sidebar>
    <Navigation>
      - Dashboard
      - Employees
      - Templates
    </Navigation>
  </Sidebar>
  <SidebarInset>
    <Header with SidebarTrigger />
    {children}
  </SidebarInset>
</SidebarProvider>
```

**Features**:
- Collapsible sidebar
- Fixed navigation
- Light mode enforced (`className="light"`)

#### **2. Dashboard Page** (`app/hr/dashboard/page.tsx`)
```tsx
<div>
  <h1>HR Onboarding Dashboard</h1>
  
  <div className="flex gap-4">
    <AIOverviewButton />
    <SearchBar />
  </div>

  <Suspense fallback={<SkeletonLoader />}>
    <EmployeeList query={searchParams.q} />
  </Suspense>
</div>
```

**Dynamic Force**: `export const dynamic = 'force-dynamic'` prevents static generation.

#### **3. EmployeeList Component** (Server Component)
```tsx
// Fetches employees server-side
const allEmployees = await getAllEmployeesWithTasks();

// Filters based on search query
const employees = query ? filtered : allEmployees;

// Renders employee cards
employees.map(employee => (
  <EmployeeCard employee={employee} />
));
```

**EmployeeCard**:
- Shows employee name, email, department
- Calculates completion percentage
- Renders Progress bar
- Lists tasks with TaskItem components

#### **4. TaskItem Component** (Client Component)
```tsx
<li>
  <input type="checkbox" 
    checked={task.isComplete}
    onChange={toggleComplete} />
  <span className={task.isComplete ? "line-through" : ""}>
    {task.title}
  </span>
  <Button onClick={() => setIsEditModalOpen(true)}>Edit</Button>
  <Button onClick={handleDelete}>Delete</Button>
</li>
```

**Features**:
- Checkbox toggles `isComplete` via API
- Edit button opens modal
- Delete button with confirmation
- Optimistic UI updates via `router.refresh()`

#### **5. Progress Component** (`components/ui/progress.tsx`)
Custom progress bar showing task completion:
```tsx
<Progress value={completedTasks} max={totalTasks} />
```

Renders visual percentage bar with calculated width.

---

### **Modal System**

All modals use a consistent pattern:

#### **Structure**:
```tsx
<div className="fixed inset-0 bg-black bg-opacity-50 z-50">
  <div className="bg-white rounded-lg p-6 max-w-md">
    <header>
      <h2>Modal Title</h2>
      <Button onClick={onClose}><X /></Button>
    </header>
    
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit">Submit</Button>
    </form>
  </div>
</div>
```

#### **Modal Components**:
1. **AddEmployeeModal**: Create employee + auto-assign default template
2. **AddTaskModal**: Add task to employee
3. **EditTaskModal**: Edit task title/description
4. **CreateTemplateModal**: Create new template
5. **AddTemplateTaskModal**: Add task to template
6. **AssignTemplateModal**: Assign template to employee
7. **AIOverviewModal**: Display AI insights

**Common Pattern**:
- Client components (`'use client'`)
- Form state with `useState`
- `router.refresh()` after success
- Error handling with error state
- Loading state during submission

---

## 🔄 **DATA FLOW**

### **Example: Creating an Employee**

#### **Frontend Flow**:
```
User clicks "Add Employee" 
  → AddEmployeeModal opens
  → User fills form (name, email, department)
  → Form submits
  → POST /api/employees
  ↓
Loading state (isSubmitting = true)
  ↓
API returns success with autoAssigned info
  ↓
Alert shows: "Employee created! Auto-assigned 'Engineering Onboarding' template with 5 tasks."
  ↓
router.refresh() (re-fetches data)
  ↓
Modal closes
  ↓
Table updates with new employee
```

#### **Backend Flow**:
```
POST /api/employees receives { name, email, department }
  ↓
Validate required fields
  ↓
createEmployee() → Inserts into Employee table
  ↓
autoAssignDefaultTemplate(employee.id)
  ├─ getDefaultTemplate() → Finds template with isDefault=true
  ├─ If exists:
  │   └─ createMany() → Copies all TemplateTask → Task (bulk insert)
  └─ Returns { template, tasksCreated }
  ↓
Returns JSON: { employee, autoAssigned }
```

---

### **Example: Search Flow**

```
User types "john" in SearchBar
  ↓
useTransition starts (isPending = true)
  ↓
router.replace('?q=john') updates URL
  ↓
Page re-renders with searchParams.q = "john"
  ↓
Server component re-executes:
  ├─ Fetches all employees
  ├─ Filters where name/email/dept/tasks contain "john"
  └─ Returns filtered list
  ↓
UI shows filtered results
  ↓
isPending = false (spinner disappears)
```

---

### **Example: AI Overview Flow**

```
User clicks "Generate AI Overview" button
  ↓
AIOverviewModal opens
  ↓
useEffect triggers on mount
  ↓
Loading state: "Analyzing employee tasks..."
  ↓
POST /api/ai-overview
  ├─ Fetch all employees with tasks
  ├─ Format data for AI
  ├─ Send to Gemini API with prompt
  ├─ Receive AI-generated text
  └─ Return { overview }
  ↓
Modal displays overview in gradient box
  ↓
User can "Regenerate" or "Close"
```

---

## 🔐 **AUTHENTICATION (SUPABASE)**

### **Setup**

#### **Environment Variables**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJxxx...
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
GEMINI_API_KEY=AIzxxx...
```

#### **Server Client** (`lib/supabase/server.ts`)
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        }
      }
    }
  );
}
```

#### **Browser Client** (`lib/supabase/client.ts`)
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
```

### **Usage Pattern**
The Supabase clients are set up but **not actively used** in the current codebase. The app uses:
- **Database**: Supabase-hosted PostgreSQL (via Prisma)
- **Authentication**: Configured but not implemented in UI

**Auth Routes Available** (not in use):
- `/app/auth/login`
- `/app/auth/sign-up`
- `/app/auth/forgot-password`
- `/app/auth/update-password`

---

## 📊 **PERFORMANCE OPTIMIZATIONS**

### **1. React Server Components**
- **EmployeeList**, **TemplatesContent**, **EmployeesContent** are server components
- Data fetching happens on server (faster, no client-side waterfalls)

### **2. Suspense Boundaries**
```tsx
<Suspense fallback={<SkeletonLoader />}>
  <EmployeeList query={query} />
</Suspense>
```
- Shows loading state while server component renders
- Prevents blocking the entire page

### **3. Dynamic Rendering**
```tsx
export const dynamic = 'force-dynamic';
```
- Disables static generation for pages with real-time data
- Ensures fresh data on every request

### **4. Prisma Connection Pooling**
- Single Prisma client instance (singleton pattern)
- Reuses connections across requests

### **5. Bulk Operations**
```typescript
// Creates multiple tasks in one query
await prisma.task.createMany({
  data: template.tasks.map(task => ({ ... }))
});
```

### **6. Cascade Deletes**
```prisma
employee Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)
```
- Database-level cascading (faster than application-level)

---

## 🎨 **STYLING SYSTEM**

### **Tailwind Configuration**
- **Theme**: Custom theme via `tailwind.config.ts`
- **Animations**: `tailwindcss-animate` plugin
- **Dark Mode**: Class-based (`next-themes`)

### **Color Palette**
```css
/* Primary colors */
bg-white, text-gray-900        /* Light backgrounds */
bg-gray-50, bg-gray-100        /* Subtle backgrounds */
text-blue-800, bg-blue-50      /* Info states */
text-green-800, bg-green-100   /* Success states */
text-yellow-800, bg-yellow-100 /* Warning states */
text-red-700, bg-red-50        /* Error states */
```

### **Component Patterns**

#### **Card**:
```css
border rounded-lg p-6 bg-white shadow-sm
```

#### **Button Variants** (shadcn/ui):
- `variant="default"`: Blue background
- `variant="outline"`: Border only
- `variant="ghost"`: Transparent
- `variant="destructive"`: Red (delete actions)
- `variant="secondary"`: Alternative style

#### **Progress Bar**:
Custom implementation with calculated width based on `value/max`.

---

## 🧪 **DATABASE SEEDING**

### **Seed Script** (`prisma/seed.ts`)

Creates sample data:

```typescript
await prisma.employee.create({
  data: {
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    tasks: {
      create: [
        { title: 'Complete HR paperwork', isComplete: false },
        { title: 'Set up development environment', isComplete: false },
        { title: 'Meet with manager', isComplete: true }
      ]
    }
  }
});
```

**Run with**:
```bash
npm run db:seed
# or
tsx prisma/seed.ts
```

---

## 🚀 **DEPLOYMENT GUIDE**

### **Prerequisites**
1. Supabase account + project
2. PostgreSQL database URL
3. Gemini API key (optional, for AI features)

### **Environment Variables**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJxxx

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db?pgbouncer=true
DIRECT_URL=postgresql://user:pass@host:5432/db

# AI (Optional)
GEMINI_API_KEY=AIzxxx
```

### **Steps**

#### **1. Install Dependencies**
```bash
npm install
```

#### **2. Generate Prisma Client**
```bash
npx prisma generate
```

#### **3. Push Database Schema**
```bash
npx prisma db push
```

#### **4. (Optional) Seed Database**
```bash
npm run db:seed
```

#### **5. Run Development Server**
```bash
npm run dev
```
Visit: http://localhost:3000

#### **6. Build for Production**
```bash
npm run build
npm start
```

### **Vercel Deployment**
1. Connect GitHub repo
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

**Build Command**: `prisma generate && next build`

---

## 📁 **FILE STRUCTURE SUMMARY**

```
nextjs-with-supabase/
├── app/
│   ├── api/              # Backend API routes
│   ├── hr/               # Main HR app
│   ├── auth/             # Authentication pages (unused)
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── blocks/           # Custom blocks (sidebar, hero)
│   └── ...               # Utility components
├── lib/
│   ├── db/               # Prisma query functions
│   ├── supabase/         # Supabase clients
│   ├── prisma.ts         # Prisma client singleton
│   └── utils.ts          # Utility functions
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── public/               # Static assets
├── package.json          # Dependencies
├── next.config.ts        # Next.js config
├── tailwind.config.ts    # Tailwind config
└── tsconfig.json         # TypeScript config
```

---

## 🔑 **KEY FEATURES RECAP**

### **1. Employee Management**
- ✅ Create, read, update, delete employees
- ✅ Assign tasks to employees
- ✅ Track onboarding status
- ✅ View progress with visual indicators

### **2. Task Management**
- ✅ Create tasks for employees
- ✅ Mark tasks as complete (checkbox)
- ✅ Edit task details (title, description)
- ✅ Delete tasks
- ✅ Task completion progress bars

### **3. Template System**
- ✅ Create reusable task templates
- ✅ Add/remove tasks from templates
- ✅ Set default template (auto-assigns to new employees)
- ✅ Manually assign templates to employees
- ✅ Visual "AUTO-ASSIGN" badge for default template

### **4. Search & Filter**
- ✅ Server-side search
- ✅ Search across names, emails, departments, tasks
- ✅ URL-based search (shareable)
- ✅ Instant results with loading states

### **5. AI Insights**
- ✅ Google Gemini 2.0 Flash integration
- ✅ Analyzes all employee progress
- ✅ Generates actionable recommendations
- ✅ Regenerate on demand

### **6. UI/UX**
- ✅ Responsive design
- ✅ Modal-based workflows
- ✅ Loading states & error handling
- ✅ Confirmation dialogs for destructive actions
- ✅ Optimistic UI updates

---

## 🛠️ **TECHNICAL DECISIONS**

### **Why Next.js 15?**
- Server components for faster data fetching
- Built-in API routes (no separate backend)
- File-based routing
- Excellent TypeScript support

### **Why Prisma?**
- Type-safe database queries
- Auto-generated types
- Simple migrations
- Great DX (developer experience)

### **Why PostgreSQL?**
- Robust relational database
- Supports complex queries
- Excellent Prisma integration
- Hosted on Supabase (easy setup)

### **Why Supabase?**
- Free PostgreSQL hosting
- Built-in authentication (if needed)
- Direct database connection support
- Connection pooling via PgBouncer

### **Why Gemini AI?**
- Fast inference (2.0 Flash model)
- Cost-effective
- Good at summarization tasks
- Easy Google AI SDK integration

### **Why Server-Side Search?**
- Better SEO
- Shareable search URLs
- No client-side filtering overhead
- Works without JavaScript

---

## 🔮 **POTENTIAL IMPROVEMENTS**

### **1. Authentication Integration**
- Currently configured but not used
- Add protected routes
- Employee self-service portal

### **2. Email Notifications**
- Notify employees of new tasks
- Reminder emails for incomplete tasks
- Manager notifications

### **3. Real-Time Updates**
- WebSocket or Supabase Realtime
- Live task completion updates
- Collaborative features

### **4. Analytics Dashboard**
- Completion rates by department
- Average onboarding time
- Task bottlenecks

### **5. File Uploads**
- Attach documents to tasks
- Employee profile pictures
- Store in Supabase Storage

### **6. Task Dependencies**
- Block tasks until prerequisites complete
- Workflow automation

### **7. Role-Based Access Control**
- Admin vs. Manager vs. Employee roles
- Permission-based features

### **8. Mobile App**
- React Native or PWA
- Push notifications

---

## 📚 **API REFERENCE QUICK GUIDE**

### **Employees**
```
GET    /api/employees           # List all
POST   /api/employees           # Create new
GET    /api/employees/:id       # Get one
PUT    /api/employees/:id       # Update
DELETE /api/employees/:id       # Delete
```

### **Tasks**
```
POST   /api/employees/:id/tasks # Create task for employee
PUT    /api/tasks/:id           # Update task
DELETE /api/tasks/:id           # Delete task
```

### **Templates**
```
GET    /api/templates               # List all
POST   /api/templates               # Create new
GET    /api/templates/:id           # Get one
PUT    /api/templates/:id           # Update
DELETE /api/templates/:id           # Delete
POST   /api/templates/:id/tasks     # Add task to template
POST   /api/templates/:id/set-default   # Set as default
POST   /api/templates/:id/assign    # Assign to employee
```

### **Template Tasks**
```
DELETE /api/template-tasks/:id   # Delete template task
```

### **AI**
```
POST   /api/ai-overview          # Generate AI insights
```

---

## 🎓 **LEARNING RESOURCES**

### **Technologies Used**
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Google AI SDK](https://ai.google.dev/tutorials)

---

## 📝 **CONCLUSION**

This is a **full-stack Next.js HR onboarding system** with:

✅ **Database**: PostgreSQL with Prisma ORM  
✅ **API**: RESTful API routes for all CRUD operations  
✅ **Frontend**: React Server Components + Client Components  
✅ **Search**: Server-side filtering with URL params  
✅ **AI**: Google Gemini integration for insights  
✅ **Templates**: Reusable task templates with auto-assignment  
✅ **UI**: Modern design with Tailwind + shadcn/ui  

The architecture is **scalable**, **type-safe**, and **production-ready**. 🚀

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-18  
**Generated for**: Complete app understanding

