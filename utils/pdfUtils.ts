import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { CertificateData } from '../types';

export const generateSinglePDF = async (data: CertificateData): Promise<Blob> => {
  const element = document.getElementById('certificate-preview');
  if (!element) {
    throw new Error('Certificate preview element not found');
  }

  // Capture the certificate as canvas
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  });

  // Create PDF
  const imgWidth = 297; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  const pdf = new jsPDF('landscape', 'mm', 'a4');
  const imgData = canvas.toDataURL('image/png');
  
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  
  return pdf.output('blob');
};

export const generateBulkPDFs = async (
  certificates: CertificateData[],
  getCertificateElement: () => HTMLElement | null,
  updateCertificateData: (data: CertificateData) => Promise<void>,
  onProgress?: (current: number, total: number) => void
): Promise<void> => {
  if (certificates.length === 0) {
    throw new Error('No certificates to generate');
  }

  const zip = new JSZip();
  
  try {
    for (let i = 0; i < certificates.length; i++) {
      const cert = certificates[i];
      
      // Update progress
      if (onProgress) {
        onProgress(i + 1, certificates.length);
      }

      // Update the certificate data and wait for re-render
      await updateCertificateData(cert);
      
      // Small delay to ensure React has updated the DOM
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const element = getCertificateElement();
      if (!element) {
        throw new Error('Certificate preview element not found');
      }

      // Generate PDF for this certificate
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgWidth = 297; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Add PDF to ZIP
      const pdfBlob = pdf.output('blob');
      const fileName = `certificate_${cert.participantName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      zip.file(fileName, pdfBlob);
    }

    // Generate and download ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const timestamp = new Date().toISOString().slice(0, 10);
    saveAs(zipBlob, `certificates_bulk_${timestamp}.zip`);
    
  } catch (error) {
    throw new Error(`Failed to generate PDFs: ${(error as Error).message}`);
  }
};

// Alternative approach using React rendering
export const generateBulkPDFsWithReact = async (
  certificates: CertificateData[],
  renderCertificate: (data: CertificateData) => Promise<HTMLElement>,
  onProgress?: (current: number, total: number) => void
): Promise<void> => {
  if (certificates.length === 0) {
    throw new Error('No certificates to generate');
  }

  const zip = new JSZip();
  
  try {
    for (let i = 0; i < certificates.length; i++) {
      const cert = certificates[i];
      
      // Update progress
      if (onProgress) {
        onProgress(i + 1, certificates.length);
      }

      // Render certificate for this participant
      const element = await renderCertificate(cert);
      
      try {
        // Generate PDF
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        const imgWidth = 297; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const pdf = new jsPDF('landscape', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Add PDF to ZIP
        const pdfBlob = pdf.output('blob');
        const fileName = `certificate_${cert.participantName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        zip.file(fileName, pdfBlob);
        
      } finally {
        // Clean up rendered element
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }
    }

    // Generate and download ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const timestamp = new Date().toISOString().slice(0, 10);
    saveAs(zipBlob, `certificates_bulk_${timestamp}.zip`);
    
  } catch (error) {
    throw new Error(`Failed to generate PDFs: ${(error as Error).message}`);
  }
};