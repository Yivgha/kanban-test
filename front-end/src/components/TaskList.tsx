import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../redux/slices/taskSlice';
import { RootState, AppDispatch } from '../redux/store';

const TaskList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { tasks, loadingStatus } = useSelector(
    (state: RootState) => state.tasks
  );

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loadingStatus === 'loading') return <p>Loading...</p>;
  if (loadingStatus === 'failed') return <p>Failed to load tasks.</p>;

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.title} - {task.description} - {task.status}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
