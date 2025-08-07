'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface FloatingActionButtonProps {
  onClick: () => void;
  tooltip?: string;
}

export default function FloatingActionButton({ onClick, tooltip }: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        title={tooltip}
      >
        <FontAwesomeIcon icon={faPlus} className="w-6 h-6" />
      </button>
    </div>
  );
}
