import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { debounce } from '../helpers/debounce';

const SearchBar = ({ onKanbanSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchValueChange = debounce((value) => {
    setSearchValue(value);
  }, 150);

  const handleInputChange = (e) => {
    handleSearchValueChange(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim() !== '') {
      onKanbanSearch(searchValue);
    }
  };

  return (
    <div className="search-bar-wrapper">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          value={searchValue}
          onChange={handleInputChange}
          placeholder="Enter unique ID of kanban"
          className="search-form-input"
        />
        <button type="submit" className="search-form-btn">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
