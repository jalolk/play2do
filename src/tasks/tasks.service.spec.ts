import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client';

describe('TasksService', () => {
  let tasksService: TasksService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    task: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks for a given user', async () => {
      const userId = 'user-123';
      const mockTasks: Task[] = [
        {
          id: 'task-1',
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'task-2',
          title: 'Task 2',
          description: 'Description 2',
          completed: true,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);

      const result = await tasksService.findAll(userId);

      expect(result).toEqual(mockTasks);
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it('should return an empty array if no tasks are found', async () => {
      const userId = 'user-123';
      mockPrismaService.task.findMany.mockResolvedValue([]);

      const result = await tasksService.findAll(userId);

      expect(result).toEqual([]);
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single task if found', async () => {
      const taskId = 'task-123';
      const userId = 'user-123';
      const mockTask: Task = {
        id: taskId,
        title: 'Task 1',
        description: 'Description 1',
        completed: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.task.findFirst.mockResolvedValue(mockTask);

      const result = await tasksService.findOne(taskId, userId);

      expect(result).toEqual(mockTask);
      expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
    });

    it('should throw NotFoundException if task is not found', async () => {
      const taskId = 'non-existent-task';
      const userId = 'user-123';

      mockPrismaService.task.findFirst.mockResolvedValue(null);

      await expect(tasksService.findOne(taskId, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
    });
  });

  describe('create', () => {
    it('should create and return a new task', async () => {
      const userId = 'user-123';
      const createTaskDto = {
        title: 'New Task',
        description: 'New Description',
        completed: false,
        userId: userId,
      };
      const mockCreatedTask: Task = {
        id: 'new-task-123',
        ...createTaskDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.task.create.mockResolvedValue(mockCreatedTask);

      const result = await tasksService.create(createTaskDto, userId);

      expect(result).toEqual(mockCreatedTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: createTaskDto,
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated task', async () => {
      const taskId = 'task-123';
      const userId = 'user-123';
      const updateTaskDto = { title: 'Updated Task', completed: true };
      const mockUpdatedTask: Task = {
        id: taskId,
        title: 'Updated Task',
        description: 'Original Description',
        completed: true,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.task.findFirst.mockResolvedValue({
        id: taskId,
        userId,
      });
      mockPrismaService.task.update.mockResolvedValue(mockUpdatedTask);

      const result = await tasksService.update(taskId, updateTaskDto, userId);

      expect(result).toEqual(mockUpdatedTask);
      expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: updateTaskDto,
      });
    });

    it('should throw NotFoundException if task to update is not found', async () => {
      const taskId = 'non-existent-task';
      const userId = 'user-123';
      const updateTaskDto = { title: 'Updated Task' };

      mockPrismaService.task.findFirst.mockResolvedValue(null);

      await expect(
        tasksService.update(taskId, updateTaskDto, userId),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
      expect(mockPrismaService.task.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove the specified task', async () => {
      const taskId = 'task-123';
      const userId = 'user-123';
      const mockDeletedTask: Task = {
        id: taskId,
        title: 'Task to Delete',
        description: 'Description',
        completed: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.task.findFirst.mockResolvedValue({
        id: taskId,
        userId,
      });
      mockPrismaService.task.delete.mockResolvedValue(mockDeletedTask);

      await tasksService.remove(taskId, userId);

      expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({
        where: { id: taskId },
      });
    });

    it('should throw NotFoundException if task to remove is not found', async () => {
      const taskId = 'non-existent-task';
      const userId = 'user-123';

      mockPrismaService.task.findFirst.mockResolvedValue(null);

      await expect(tasksService.remove(taskId, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
      expect(mockPrismaService.task.delete).not.toHaveBeenCalled();
    });
  });
});
