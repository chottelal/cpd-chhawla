import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { CertificateData } from '../types';
import { Document, Packer, Paragraph, ImageRun, PageOrientation } from 'docx';

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
      // Wait a bit longer for React & fonts to settle
      await new Promise(resolve => setTimeout(resolve, 250));
      const element = getCertificateElement();
      if (!element) {
        throw new Error('Certificate preview element not found');
      }
      if (element.clientWidth === 0 || element.clientHeight === 0) {
        console.warn('Bulk PDF generation: element has zero dimensions. width:', element.clientWidth, 'height:', element.clientHeight);
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

// Helper: sanitize a name for safe filenames/folders
const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '_');

// Helper: convert a data URL to a Uint8Array
const dataURLToUint8Array = (dataURL: string): Uint8Array => {
  const parts = dataURL.split(',');
  const base64 = parts[1] || '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

// Generate both PDF and DOCX for each certificate, zipping results per user in subfolders
export const generateBulkBoth = async (
  certificates: CertificateData[],
  getCertificateElement: () => HTMLElement | null,
  updateCertificateData: (data: CertificateData) => Promise<void>,
  onProgress?: (current: number, total: number) => void
): Promise<void> => {
  if (certificates.length === 0) {
    throw new Error('No certificates to generate');
  }

  const zip = new JSZip();
  const totalFiles = certificates.length * 2; // one PDF + one DOCX per certificate
  let completed = 0;

  for (let i = 0; i < certificates.length; i++) {
    const cert = certificates[i];

    await updateCertificateData(cert);
    // allow the UI to settle
    await new Promise((resolve) => setTimeout(resolve, 250));
    const element = getCertificateElement();
    if (!element) throw new Error('Certificate preview element not found');

    // Render once
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });
    const imgData = canvas.toDataURL('image/png');
    const safeName = sanitize(cert.participantName);
    const folder = (zip.folder(safeName) as JSZip);

    // PDF generation
    {
      const imgWidth = 297; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      const pdfBlob = pdf.output('blob');
      folder.file(`certificate_${safeName}.pdf`, pdfBlob);
      completed += 1; if (onProgress) onProgress(completed, totalFiles);
    }

    // DOCX generation (embed rendered PNG)
    {
      const imageBytes = dataURLToUint8Array(imgData);
      const targetWidth = Math.round(canvas.width / 2);
      const targetHeight = Math.round(canvas.height / 2);
      const doc = new Document({
        sections: [
          {
            properties: { page: { size: { orientation: PageOrientation.LANDSCAPE } } },
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageBytes,
                    type: 'png',
                    transformation: { width: targetWidth, height: targetHeight },
                  }),
                ],
              }),
            ],
          },
        ],
      });
      const buffer = await Packer.toBlob(doc);
      folder.file(`certificate_${safeName}.docx`, buffer);
      completed += 1; if (onProgress) onProgress(completed, totalFiles);
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(zipBlob, `certificates_bulk_${timestamp}.zip`);
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