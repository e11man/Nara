import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create some sample employees
  const employee1 = await prisma.employee.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Engineering',
      onboarded: false,
      tasks: {
        create: [
          {
            title: 'Complete HR paperwork',
            description: 'Fill out all required HR forms and documentation',
            isComplete: false,
          },
          {
            title: 'Set up development environment',
            description: 'Install necessary software and tools',
            isComplete: false,
          },
          {
            title: 'Meet with manager',
            description: 'Initial 1-on-1 with direct manager',
            isComplete: true,
          },
        ],
      },
    },
  });

  const employee2 = await prisma.employee.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      department: 'Product',
      onboarded: false,
      tasks: {
        create: [
          {
            title: 'Review product roadmap',
            description: 'Understand current product priorities',
            isComplete: false,
          },
          {
            title: 'Complete security training',
            description: 'Mandatory security awareness training',
            isComplete: false,
          },
        ],
      },
    },
  });

  const employee3 = await prisma.employee.create({
    data: {
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      department: 'Design',
      onboarded: true,
      tasks: {
        create: [
          {
            title: 'Review design system',
            description: 'Familiarize with company design guidelines',
            isComplete: true,
          },
          {
            title: 'Set up design tools',
            description: 'Install Figma and other design software',
            isComplete: true,
          },
        ],
      },
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log(`Created employees: ${employee1.name}, ${employee2.name}, ${employee3.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

