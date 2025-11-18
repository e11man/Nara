import prisma from '@/lib/prisma';

export async function createTask(data: {
  title: string;
  description?: string;
  employeeId: string;
}) {
  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      employeeId: data.employeeId,
    },
  });
}

export async function getTaskById(id: string) {
  return await prisma.task.findUnique({
    where: { id },
  });
}

export async function updateTask(id: string, data: {
  title?: string;
  description?: string;
  isComplete?: boolean;
}) {
  return await prisma.task.update({
    where: { id },
    data,
  });
}

export async function deleteTask(id: string) {
  return await prisma.task.delete({
    where: { id },
  });
}

export async function toggleTaskComplete(id: string) {
  const task = await prisma.task.findUnique({
    where: { id }
  });

  if (!task) {
    throw new Error('Task not found');
  }

  return await prisma.task.update({
    where: { id },
    data: {
      isComplete: !task.isComplete
    }
  });
}

