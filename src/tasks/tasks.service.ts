import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({ where: { userId } });
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.prisma.task.findFirst({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async create(
    data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
    userId: string,
  ): Promise<Task> {
    return this.prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: string, data: Partial<Task>, userId: string): Promise<Task> {
    await this.findOne(id, userId);
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);
    await this.prisma.task.delete({ where: { id } });
  }
}
