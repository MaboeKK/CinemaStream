import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './SearchInput.css';

function SearchInput() {
  const [expanded, setExpanded] = useState(false);
  const [term, setTerm] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const openAndFocus = () => {
    setExpanded(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const submit = () => {
    if (!term.trim()) return;
    navigate(`/movies?q=${encodeURIComponent(term.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submit();
    if (e.key === 'Escape') {
      setExpanded(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`nav-search${expanded ? ' expanded' : ''}`}>
      <button className="nav-search-icon" onClick={openAndFocus} aria-label="Search">
        <FaSearch />
      </button>
      <input
        ref={inputRef}
        type="text"
        className="nav-search-input"
        placeholder="Search titles..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => !term && setExpanded(false)}
      />
    </div>
  );
}

export default SearchInput;
