import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { CertificateData } from '../types';

// Excel template columns matching CertificateData interface
const TEMPLATE_COLUMNS = [
  'Participant Name',
  'Participant Name (Hindi)',
  'Designation', 
  'Designation (Hindi)',
  'Organization Name',
  'Organization Name (Hindi)',
  'Organization Address',
  'Organization Location',
  'Organization Location (Hindi)',
  'Regional Office',
  'Regional Office (Hindi)',
  'Training Name',
  'Workshop Details',
  'Dates',
  'Duration',
  'Duration (Hindi)',
  'Year',
  'Principal Name',
  'Principal Signature (URL)'
];

export const downloadExcelTemplate = () => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Create worksheet with headers
  const ws = XLSX.utils.aoa_to_sheet([
    TEMPLATE_COLUMNS,
    // Add one sample row with example data
    [
      'John Doe',
      'जॉन डो',
      'Teacher', 
      'शिक्षक',
      'KENDRIYA VIDYALAYA SANGATHAN',
      'केंद्रीय विद्यालय संगठन',
      'New Delhi, India',
      'New Delhi',
      'नई दिल्ली',
      'Delhi Regional Office',
      'दिल्ली क्षेत्रीय कार्यालय',
      'Professional Development Workshop',
      'Details about the training workshop conducted for capacity building',
      '15-17 January 2025',
      '3 Days',
      '3 दिन',
      '2025',
      'Dr. Principal Name',
      'https://example.com/signature.png'
    ]
  ]);
  
  // Auto-size columns
  const colWidths = TEMPLATE_COLUMNS.map(() => ({ wch: 20 }));
  ws['!cols'] = colWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Certificate Data');
  
  // Generate buffer
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
  // Save file
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, 'certificate_template.xlsx');
};

export const readExcelFile = (file: File): Promise<CertificateData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first worksheet
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        
        // Skip header row and process data
        const headers = jsonData[0];
        const rows = jsonData.slice(1);
        
        const certificates: CertificateData[] = rows
          .filter(row => row.length > 0 && row[0]) // Filter empty rows
          .map((row, index) => {
            try {
              return {
                participantName: row[0] || '',
                participantNameHindi: row[1] || '',
                designation: row[2] || '',
                designationHindi: row[3] || '',
                organizationName: row[4] || '',
                organizationNameHindi: row[5] || '',
                organizationAddress: row[6] || '',
                organizationLocation: row[7] || '',
                organizationLocationHindi: row[8] || '',
                regionalOffice: row[9] || '',
                regionalOfficeHindi: row[10] || '',
                trainingName: row[11] || '',
                workshopDetails: row[12] || '',
                dates: row[13] || '',
                duration: row[14] || '',
                durationHindi: row[15] || '',
                year: row[16] || '',
                principalName: row[17] || '',
                principalSignature: row[18] || ''
              };
            } catch (error) {
              console.error(`Error processing row ${index + 2}:`, error);
              return null;
            }
          })
          .filter(cert => cert !== null) as CertificateData[];
        
        resolve(certificates);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};