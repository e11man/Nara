'use client';

import { useState } from 'react';
import { AIOverviewModal } from './AIOverviewModal';

export function AIOverviewButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="bg-purple-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-purple-700 font-medium flex items-center gap-2"
      >
        🤖 Generate AI Overview
      </button>

      {showModal && (
        <AIOverviewModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

