'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getTasks = getTasks;
exports.getTaskById = getTaskById;
exports.createTask = createTask;
exports.editTask = editTask;
exports.deleteTask = deleteTask;
const typeorm_config_1 = require('../../typeorm.config');
const Task_1 = require('../entities/Task');
async function getTasks(req, res) {
  try {
    const tasks = await typeorm_config_1.AppDataSource.getRepository(
      Task_1.Task
    ).find();
    res.status(200).json(tasks);
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
    ).findOneBy({
      id: taskId,
    });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error(`Error fetching task by id ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
async function createTask(req, res) {
  try {
    const { title, description, status, order } = req.body;
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
    }
    const taskRepository = typeorm_config_1.AppDataSource.getRepository(
      Task_1.Task
    );
    const createdTask = taskRepository.create({
      title,
      description,
      status,
      order,
    });
    const result = await taskRepository.save(createdTask);
    res.status(201).json(result);
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
    }
    const task = await typeorm_config_1.AppDataSource.getRepository(
      Task_1.Task
    ).findOneBy({
      id: taskId,
    });
    if (!task) {
      res.status(404).json({ error: `Task with id ${taskId} not found` });
    }
    if (task == null) {
      return;
    }
    const { id, ...taskUpdates } = req.body;
    const updatedTask = typeorm_config_1.AppDataSource.getRepository(
      Task_1.Task
    ).merge(task, taskUpdates);
    const result = await typeorm_config_1.AppDataSource.getRepository(
      Task_1.Task
    ).save(updatedTask);
    res.status(200).json(result);
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
