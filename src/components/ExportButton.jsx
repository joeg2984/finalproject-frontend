// frontend/src/components/ExportButton.js
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExportButton = ({ targetId }) => {
  const handleExport = () => {
    const input = document.getElementById(targetId);
    if (!input) {
      console.error(`Element with id "${targetId}" not found.`);
      return;
    }
    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('evaluation_report.pdf');
      })
      .catch((err) => console.error('Error exporting PDF:', err));
  };

  return (
    <button
      onClick={handleExport}
      className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
      aria-label="Download Evaluation Report"
    >
      Download Report
    </button>
  );
};

export default ExportButton;
