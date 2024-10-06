import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addKanban, editKanban, deleteKanban } from '../api/kanbans';
import { AppDispatch, RootState } from '../redux/store';

const KanbanActions = ({ setKanbanId, onDeleteKanban }) => {
  const dispatch: AppDispatch = useDispatch();
  const { kanbans } = useSelector((state: RootState) => state.kanbans);

  const handleAddKanban = async () => {
    const kanbanName = prompt('Enter Kanban name:');
    if (kanbanName === null) {
      return; // User canceled, do nothing
    }

    const properNameCheck = kanbanName.trim() !== '';
    if (!properNameCheck) {
      alert('Please provide a valid name for the board.');
      return;
    }

    try {
      const newKanban = await dispatch(addKanban(kanbanName)).unwrap();
      setKanbanId(newKanban.uniqueId);
    } catch (error) {
      alert('Failed to add Kanban. Please try again.');
      console.error(error);
    }
  };

  const handleEditKanban = async () => {
    const kanbanId = prompt('Enter Kanban ID to edit:');
    if (kanbanId === null) {
      return; // User canceled, do nothing
    }

    const kanbanToEdit = kanbans.find((kanban) => kanban.uniqueId === kanbanId);
    if (!kanbanToEdit) {
      alert('Kanban ID does not exist.');
      return;
    }

    const newKanbanName = prompt('Enter new Kanban name:', kanbanToEdit.name);
    if (newKanbanName === null) {
      return; // User canceled, do nothing
    }

    if (newKanbanName.trim() === '') {
      alert('Please provide a valid name for the Kanban.');
      return;
    }

    try {
      await dispatch(
        editKanban({ uniqueId: kanbanId, name: newKanbanName })
      ).unwrap();
      alert('Kanban edited successfully!'); // Optional success message
      setKanbanId(kanbanId); // Set the current Kanban ID if needed
    } catch (error) {
      alert('Failed to edit Kanban. Please try again.');
      console.error(error);
    }
  };

  const handleDeleteKanban = async () => {
    const kanbanId = prompt('Enter Kanban ID to delete:');
    if (kanbanId === null) {
      return; // User canceled, do nothing
    }

    const exists = kanbans.some((kanban) => kanban.uniqueId === kanbanId);
    if (!exists) {
      alert('Kanban ID does not exist.');
      return;
    }

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this board?'
    );
    if (confirmDelete) {
      try {
        await dispatch(deleteKanban(kanbanId));
        onDeleteKanban();
      } catch (error) {
        alert('Failed to delete Kanban. Please try again.');
        console.error(error);
      }
    }
  };

  return (
    <div className="kanban-actions">
      <button onClick={handleAddKanban} className="kanban-action-btn">
        <FontAwesomeIcon icon={faPlus} title="Add Kanban" />
      </button>
      <button onClick={handleEditKanban} className="kanban-action-btn">
        <FontAwesomeIcon icon={faEdit} title="Edit Kanban" />
      </button>
      <button onClick={handleDeleteKanban} className="kanban-action-btn">
        <FontAwesomeIcon icon={faTrash} title="Delete Kanban" />
      </button>
    </div>
  );
};

export default KanbanActions;
