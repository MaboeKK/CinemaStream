import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import SearchOverlay from './SearchOverlay';
import './SearchInput.css';

function SearchInput() {
  const [expanded, setExpanded] = useState(false);
  const [term, setTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const openAndFocus = () => {
    setExpanded(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const close = () => {
    setExpanded(false);
    inputRef.current?.blur();
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(term), 300);
    return () => clearTimeout(timer);
  }, [term]);

  useEffect(() => {
    if (!expanded) return undefined;
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [expanded]);

  const submit = () => {
    if (!term.trim()) return;
    navigate(`/movies?q=${encodeURIComponent(term.trim())}`);
    setTerm('');
    close();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submit();
    if (e.key === 'Escape') close();
  };

  const handleSelect = () => {
    setTerm('');
    close();
  };

  return (
    <div className={`nav-search${expanded ? ' expanded' : ''}`} ref={containerRef}>
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
        onFocus={() => setExpanded(true)}
        onKeyDown={handleKeyDown}
      />
      {expanded && (
        <SearchOverlay term={debouncedTerm} onSelect={handleSelect} onClear={() => setTerm('')} />
      )}
    </div>
  );
}

export default SearchInput;
