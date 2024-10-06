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
import { fetchKanbans } from '../api/kanbans';
import { RootState, AppDispatch } from '../redux/store';
import { TaskStatuses } from '../constants/TaskStatuses.enum';
import Column from './Column';
import reorder from '../helpers/reorder';
import KanbanSelect from './KanbanSelect';
import SearchBar from './SearchBar';

type Columns = {
  [key in TaskStatuses]: Task[];
};

const TaskBoard = () => {
  const dispatch: AppDispatch = useDispatch();
  const { tasks, loadingStatus } = useSelector(
    (state: RootState) => state.tasks
  );
  const { statuses } = useSelector((state: RootState) => state.statuses);
  const { kanbans } = useSelector((state: RootState) => state.kanbans);

  const [selectedKanbanId, setSelectedKanbanId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([dispatch(fetchStatuses()), dispatch(fetchKanbans())]);

      if (selectedKanbanId) {
        await dispatch(fetchTasks(selectedKanbanId));
      }
    };

    fetchData();
  }, [dispatch, selectedKanbanId]);

  const memoizedColumns = useMemo(() => {
    return statuses.reduce<Columns>((acc, status) => {
      acc[status.name as TaskStatuses] = tasks
        .filter((task) => task.status === status.name)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return acc;
    }, {} as Columns);
  }, [tasks, statuses, selectedKanbanId]);

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

    const newColumns = { ...memoizedColumns };

    if (sourceStatus === destStatus) {
      const reorderedTasks = reorder(
        newColumns[sourceStatus],
        source.index,
        destination.index
      );

      newColumns[sourceStatus] = reorderedTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      await updateTaskOrder(reorderedTasks, sourceStatus);
    } else {
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

    await dispatch(fetchTasks(selectedKanbanId!));
  };

  const handleTaskSubmit = async (status: TaskStatuses) => {
    if (newTaskTitle.trim() === '' || newTaskDescription.trim() === '') {
      return;
    }

    const taskPayload: Omit<Task, 'id'> = {
      title: newTaskTitle,
      description: newTaskDescription,
      kanbanId: selectedKanbanId!,
      status,
      order: 0,
    };

    if (editingTaskId !== null) {
      await dispatch(editTask({ id: editingTaskId, ...taskPayload }));
      setEditingTaskId(null);
    } else {
      await dispatch(createTask(taskPayload));
    }

    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const handleEditTask = (id: number) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setNewTaskTitle(taskToEdit.title);
      setNewTaskDescription(taskToEdit.description);
      setEditingTaskId(id);
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

  const handleKanbanID = (kanbanId: string) => {
    setSelectedKanbanId(kanbanId);
  };

  const handleKanbanDelete = async () => {
    setSelectedKanbanId(null);
    await dispatch(fetchKanbans());
    await dispatch(fetchTasks(null));
  };

  if (loadingStatus === 'failed')
    return <p className="info-msg">Failed to load tasks.</p>;

  if (loadingStatus === 'loading')
    return <p className="info-msg">Loading...</p>;

  return (
    <>
      <SearchBar
        onKanbanSearch={handleKanbanID}
        setKanbanId={handleKanbanID}
        onDeleteKanban={handleKanbanDelete}
      />
      <div className="kanban-head-box">
        <KanbanSelect
          kanbans={kanbans}
          selectedKanbanId={selectedKanbanId}
          onKanbanChange={handleKanbanID}
        />
        {selectedKanbanId && <div>Kanban ID: {selectedKanbanId}</div>}
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="column-wrapper">
          {statuses.map((status) => (
            <Column
              key={status.id}
              status={status}
              tasks={memoizedColumns[status.name as TaskStatuses] || []}
              onTaskSubmit={handleTaskSubmit}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              newTaskTitle={newTaskTitle}
              setNewTaskTitle={setNewTaskTitle}
              newTaskDescription={newTaskDescription}
              setNewTaskDescription={setNewTaskDescription}
              editingTaskId={editingTaskId}
              setEditingTaskId={setEditingTaskId}
            />
          ))}
        </div>
      </DragDropContext>
    </>
  );
};

export default TaskBoard;
