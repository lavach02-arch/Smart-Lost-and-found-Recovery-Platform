import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PhaseNoticeModal from '../components/PhaseNoticeModal';
import { StructureFlowCollection } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';

export default function MainLayout() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    targetPhase: 'Phase 3',
  });

  const handleOpenReportModal = (title = 'Feature Notice', targetPhase = 'Phase 3') => {
    setModalState({
      isOpen: true,
      title,
      targetPhase,
    });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* ThreeUI StructureFlowCollection (dimensional-field variant) Shader Background for entire project */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-45">
        <StructureFlowCollection
          variant="dimensional-field"
          hue={0}
          saturation={1.00}
          brightness={1.00}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onOpenReportModal={handleOpenReportModal} />

        <main className="flex-grow">
          <Outlet context={{ onOpenReportModal: handleOpenReportModal }} />
        </main>

        <Footer />
      </div>

      <PhaseNoticeModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={modalState.title}
        targetPhase={modalState.targetPhase}
      />
    </div>
  );
}
