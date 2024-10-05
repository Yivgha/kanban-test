import { useEffect, useMemo, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { Task } from '../redux/slices/taskSlice';
import { fetchStatuses } from '../redux/slices/statusSlice';
import {
  fetchTasks,
  updateTaskStatus,
  createTask,
  deleteTask,
  editTask,
} from '../api/tasks';
import { RootState, AppDispatch } from '../redux/store';
import { TaskStatuses } from '../constants/TaskStatuses.enum';
import Column from './Column';
import reorder from '../helpers/reorder';

type Columns = {
  [key in TaskStatuses]: Task[];
};

const TaskBoard = () => {
  const dispatch: AppDispatch = useDispatch();
  const { tasks, loadingStatus } = useSelector(
    (state: RootState) => state.tasks
  );
  const { statuses } = useSelector((state: RootState) => state.statuses);

  const [columns, setColumns] = useState<Columns>(
    Object.values(TaskStatuses).reduce<Columns>((acc, status) => {
      acc[status] = [];
      return acc;
    }, {} as Columns)
  );

  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAndPopulateTasks = async () => {
      await Promise.all([dispatch(fetchTasks()), dispatch(fetchStatuses())]);
    };
    fetchAndPopulateTasks();
  }, [dispatch]);

  const memoizedColumns = useMemo(() => {
    return statuses.reduce<Columns>((acc, status) => {
      acc[status.name as TaskStatuses] = tasks
        .filter((task) => task.status === status.name)
        .sort((a, b) => a.order - b.order);
      return acc;
    }, {} as Columns);
  }, [tasks, statuses]);

  useEffect(() => {
    setColumns(memoizedColumns);
  }, [memoizedColumns]);

  const updateTaskOrder = async (tasks: Task[], status: TaskStatuses) => {
    await Promise.all(
      tasks.map((task, index) =>
        dispatch(
          updateTaskStatus({ id: task.id, status: status, order: index })
        )
      )
    );
  };

  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceStatus = source.droppableId as TaskStatuses;
    const destStatus = destination.droppableId as TaskStatuses;

    const newColumns = { ...columns };

    if (sourceStatus === destStatus) {
      // Reorder within the same column
      const reorderedTasks = reorder(
        newColumns[sourceStatus],
        source.index,
        destination.index
      );

      newColumns[sourceStatus] = reorderedTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      setColumns(newColumns);
      await updateTaskOrder(reorderedTasks, sourceStatus);
    } else {
      // Move task to a different column
      const sourceTasks = Array.from(newColumns[sourceStatus]);
      const destTasks = Array.from(newColumns[destStatus]);
      const movedTask = { ...sourceTasks[source.index], status: destStatus };

      sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, movedTask);

      newColumns[sourceStatus] = sourceTasks.map((task, index) => ({
        ...task,
        order: index,
      }));
      newColumns[destStatus] = destTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      setColumns(newColumns);

      // Update the status and order for the moved task
      await Promise.all([
        dispatch(
          updateTaskStatus({
            id: movedTask.id,
            status: destStatus,
            order: destination.index,
          })
        ),
        updateTaskOrder(destTasks, destStatus),
      ]);
    }

    await dispatch(fetchTasks());
  };

  const handleAddTask = async (status: TaskStatuses) => {
    if (newTaskTitle.trim() === '' || newTaskDescription.trim() === '') {
      return;
    }

    const newTask: Omit<Task, 'id'> = {
      title: newTaskTitle,
      description: newTaskDescription,
      status,
      order: 0,
    };

    await dispatch(createTask(newTask));

    // Update the local state
    setColumns((prevColumns) => {
      const existingTasks = prevColumns[status];

      const updatedExistingTasks = existingTasks.map((task) => ({
        ...task,
        order: task.order + 1,
      }));

      return {
        ...prevColumns,
        [status]: updatedExistingTasks.sort((a, b) => a.order - b.order),
      };
    });

    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const handleEditTask = async (id: number) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setNewTaskTitle(taskToEdit.title);
      setNewTaskDescription(taskToEdit.description);
      setEditingTaskId(id);
    }
  };

  const handleSaveEditedTask = async () => {
    if (editingTaskId !== null) {
      const updatedTask: Task = {
        id: editingTaskId,
        title: newTaskTitle,
        description: newTaskDescription,
        status:
          tasks.find((task) => task.id === editingTaskId)?.status ||
          TaskStatuses.TODO,
      };

      await dispatch(editTask(updatedTask));

      setNewTaskTitle('');
      setNewTaskDescription('');
      setEditingTaskId(null);
    }
  };

  const handleDeleteTask = async (id: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this task?'
    );
    if (confirmDelete) {
      await dispatch(deleteTask(id));
    }
  };

  if (loadingStatus === 'failed')
    return <p className="info-msg">Failed to load tasks.</p>;

  if (loadingStatus === 'loading')
    return <p className="info-msg">Loading...</p>;

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="column-wrapper">
        {statuses.map((status) => (
          <Column
            key={status.id}
            status={status}
            tasks={columns[status.name as TaskStatuses] || []}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            newTaskTitle={newTaskTitle}
            setNewTaskTitle={setNewTaskTitle}
            newTaskDescription={newTaskDescription}
            setNewTaskDescription={setNewTaskDescription}
          />
        ))}
        {editingTaskId !== null && (
          <div>
            <h4>Edit Task</h4>
            <input
              type="text"
              id="edit task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <input
              type="text"
              id="edit task description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <button onClick={handleSaveEditedTask}>Save</button>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
