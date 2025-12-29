import React, { useState } from 'react';

const EyeIcon = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
    <path d="M10 3C6 3 2.73 5.11 1 8c1.73 2.89 5 5 9 5s7.27-2.11 9-5c-1.73-2.89-5-5-9-5zm0 8a3 3 0 110-6 3 3 0 010 6z" />
  </svg>
);

const ClipboardIcon = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
    <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H6zM8 4h4v1H8V4z" />
  </svg>
);

const MaskedNumber = ({ number = '' }) => {
  const [show, setShow] = useState(false);
  const masked = String(number).replace(/.(?=.{4})/g, '*'); // mask all but last 4 chars

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(String(number));
      // optionally show a toast later
    } catch (err) {
      // ignore
    }
  };

  const toggle = (e) => {
    e.stopPropagation();
    setShow((s) => !s);
  };

  return (
    <span className="inline-flex items-center space-x-2 text-sm">
      <span className="font-mono tracking-wide truncate">{show ? number : masked}</span>

      {/* show icons on small screens, label + icon on larger screens */}
      <button
        type="button"
        aria-label={show ? 'Sembunyikan nomor' : 'Tampilkan nomor'}
        onClick={toggle}
        className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 focus:outline-none"
      >
        <EyeIcon className="h-4 w-4" />
        <span className="hidden sm:inline text-xs">{show ? 'Sembunyikan' : 'Tampilkan'}</span>
      </button>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center space-x-1 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Salin nomor"
      >
        <ClipboardIcon className="h-4 w-4" />
        <span className="hidden sm:inline text-xs">Salin</span>
      </button>
    </span>
  );
};

export default MaskedNumber;
