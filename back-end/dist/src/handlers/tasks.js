'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getTasks = getTasks;
exports.getTaskById = getTaskById;
exports.createTask = createTask;
exports.editTask = editTask;
exports.deleteTask = deleteTask;
const typeorm_config_1 = require('../../typeorm.config');
const Task_1 = require('../entities/Task');
const Kanban_1 = require('../entities/Kanban');
async function getTasks(req, res) {
  try {
    const kanbanId = req.query.kanban;
    const options = {
      relations: ['kanban'],
      where: kanbanId ? { kanban: { uniqueId: kanbanId } } : undefined,
    };
    const tasks = await typeorm_config_1.AppDataSource.getRepository(
      Task_1.Task
    ).find(options);
    const taskResponses = tasks.map((task) => ({
      ...task,
      kanban: task.kanban.uniqueId,
    }));
    res.status(200).json(taskResponses);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
async function getTaskById(req, res) {
  try {
    const taskId = Number(req.params.id);
    const task = await typeorm_config_1.AppDataSource.getRepository(
      Task_1.Task
    ).findOne({
      where: { id: taskId },
      relations: ['kanban'],
    });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    const taskResponse = {
      ...task,
      kanban: task.kanban.uniqueId,
    };
    res.status(200).json(taskResponse);
  } catch (error) {
    console.error(`Error fetching task by id ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
async function createTask(req, res) {
  try {
    const { title, description, status, order, kanbanId } = req.body;
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }
    if (!kanbanId) {
      res.status(400).json({ error: 'Kanban ID is required' });
      return;
    }
    const kanbanRepository = typeorm_config_1.AppDataSource.getRepository(
      Kanban_1.Kanban
    );
    const kanban = await kanbanRepository.findOne({
      where: { uniqueId: kanbanId },
    });
    if (!kanban) {
      res.status(404).json({ error: 'Kanban not found' });
      return;
    }
    const taskRepository = typeorm_config_1.AppDataSource.getRepository(
      Task_1.Task
    );
    const createdTask = taskRepository.create({
      title,
      description,
      status,
      order,
      kanban: kanban,
    });
    const result = await taskRepository.save(createdTask);
    const taskResponse = {
      ...result,
      kanban: result.kanban.uniqueId,
    };
    res.status(201).json(taskResponse);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
async function editTask(req, res) {
  try {
    const taskId = Number(req.params.id);
    if (!taskId) {
      res.status(400).json({ error: 'Id is required' });
      return;
    }
    const taskRepository = typeorm_config_1.AppDataSource.getRepository(
      Task_1.Task
    );
    const task = await taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      res.status(404).json({ error: `Task with id ${taskId} not found` });
      return;
    }
    const { kanbanId, ...taskUpdates } = req.body;
    if (kanbanId) {
      const kanbanRepository = typeorm_config_1.AppDataSource.getRepository(
        Kanban_1.Kanban
      );
      const kanban = await kanbanRepository.findOne({
        where: { uniqueId: kanbanId },
      });
      if (!kanban) {
        res.status(404).json({ error: 'Kanban not found' });
        return;
      }
      task.kanban = kanban;
    }
    const updatedTask = taskRepository.merge(task, taskUpdates);
    const result = await taskRepository.save(updatedTask);
    const taskResponse = {
      ...result,
      kanban: result.kanban.uniqueId,
    };
    res.status(200).json(taskResponse);
  } catch (error) {
    console.error('Error editing task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
async function deleteTask(req, res) {
  try {
    await typeorm_config_1.AppDataSource.getRepository(Task_1.Task).delete(
      req.params.id
    );
    res.status(200).json({ message: `Task with id ${req.params.id} deleted!` });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ detail: 'Internal Server Error' });
  }
}
