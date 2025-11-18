import prisma from '@/lib/prisma';

export type EmployeeWithTasks = {
  id: string;
  name: string;
  email: string;
  department: string | null;
  onboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
  tasks: {
    id: string;
    title: string;
    description: string | null;
    isComplete: boolean;
    employeeId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export async function getAllEmployeesWithTasks() {
  return await prisma.employee.findMany({
    include: {
      tasks: {
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getEmployeeById(id: string) {
  return await prisma.employee.findUnique({
    where: { id },
    include: {
      tasks: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}

export async function createEmployee(data: {
  name: string;
  email: string;
  department?: string;
}) {
  return await prisma.employee.create({
    data: {
      name: data.name,
      email: data.email,
      department: data.department,
    },
  });
}

export async function updateEmployee(id: string, data: {
  name?: string;
  email?: string;
  department?: string;
  onboarded?: boolean;
}) {
  return await prisma.employee.update({
    where: { id },
    data,
  });
}

export async function deleteEmployee(id: string) {
  return await prisma.employee.delete({
    where: { id },
  });
}

