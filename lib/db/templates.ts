import prisma from '@/lib/prisma';

export type TemplateWithTasks = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  tasks: {
    id: string;
    title: string;
    description: string | null;
    templateId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export async function getAllTemplatesWithTasks() {
  return await prisma.template.findMany({
    include: {
      tasks: {
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getTemplateById(id: string) {
  return await prisma.template.findUnique({
    where: { id },
    include: {
      tasks: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}

export async function createTemplate(data: {
  name: string;
  description?: string;
}) {
  return await prisma.template.create({
    data: {
      name: data.name,
      description: data.description,
    },
  });
}

export async function updateTemplate(id: string, data: {
  name?: string;
  description?: string;
}) {
  return await prisma.template.update({
    where: { id },
    data,
  });
}

export async function deleteTemplate(id: string) {
  return await prisma.template.delete({
    where: { id },
  });
}

// Template Task functions
export async function createTemplateTask(data: {
  title: string;
  description?: string;
  templateId: string;
}) {
  return await prisma.templateTask.create({
    data: {
      title: data.title,
      description: data.description,
      templateId: data.templateId,
    },
  });
}

export async function deleteTemplateTask(id: string) {
  return await prisma.templateTask.delete({
    where: { id },
  });
}

// Get default template
export async function getDefaultTemplate() {
  return await prisma.template.findFirst({
    where: { isDefault: true },
    include: { tasks: true }
  });
}

// Set a template as default (unsets others)
export async function setDefaultTemplate(templateId: string) {
  // First, unset all other templates
  await prisma.template.updateMany({
    where: { isDefault: true },
    data: { isDefault: false }
  });

  // Set the selected template as default
  return await prisma.template.update({
    where: { id: templateId },
    data: { isDefault: true }
  });
}

// Assign template to employee (copy all template tasks to employee tasks)
export async function assignTemplateToEmployee(templateId: string, employeeId: string) {
  const template = await prisma.template.findUnique({
    where: { id: templateId },
    include: { tasks: true }
  });

  if (!template) {
    throw new Error('Template not found');
  }

  // Create tasks for employee based on template tasks
  const tasks = await prisma.task.createMany({
    data: template.tasks.map(task => ({
      title: task.title,
      description: task.description,
      employeeId: employeeId,
      isComplete: false,
    })),
  });

  return tasks;
}

// Auto-assign default template to new employee
export async function autoAssignDefaultTemplate(employeeId: string) {
  const defaultTemplate = await getDefaultTemplate();
  
  if (!defaultTemplate || defaultTemplate.tasks.length === 0) {
    return null; // No default template or no tasks
  }

  // Create all tasks from the default template
  const tasks = await prisma.task.createMany({
    data: defaultTemplate.tasks.map(task => ({
      title: task.title,
      description: task.description,
      employeeId: employeeId,
      isComplete: false,
    })),
  });

  return { template: defaultTemplate, tasksCreated: tasks.count };
}


