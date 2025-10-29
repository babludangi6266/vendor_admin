// import * as XLSX from 'xlsx';

// export const exportToExcel = (data, filename = 'vendors_data') => {
//   // Prepare data for Excel
//   const excelData = data.map(vendor => ({
//     'Name': vendor.name,
//     'Contact': vendor.contact,
//     'Email': vendor.email || 'N/A',
//     'Address': vendor.address,
//     'Service Category': vendor.serviceCategory,
//     'Rate': vendor.rate || 'N/A',
//     'Rate Type': vendor.rateType,
//     'Registration Date': new Date(vendor.registrationDate).toLocaleDateString()
//   }));

//   // Create workbook and worksheet
//   const workbook = XLSX.utils.book_new();
//   const worksheet = XLSX.utils.json_to_sheet(excelData);

//   // Add worksheet to workbook
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendors');

//   // Set column widths
//   const colWidths = [
//     { wch: 20 }, // Name
//     { wch: 15 }, // Contact
//     { wch: 25 }, // Email
//     { wch: 30 }, // Address
//     { wch: 15 }, // Service Category
//     { wch: 10 }, // Rate
//     { wch: 12 }, // Rate Type
//     { wch: 15 }  // Registration Date
//   ];
//   worksheet['!cols'] = colWidths;

//   // Export to Excel
//   XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
// };

import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename = 'vendors_data') => {
  // Prepare data for Excel
  const excelData = data.map(vendor => ({
    'ID': vendor.id,
    'Name': vendor.name,
    'Contact': vendor.contact,
    'Email': vendor.email || 'N/A',
    'Address': vendor.address,
    'Service Category': vendor.serviceCategory,
    'Rate': vendor.rate || 'N/A',
    'Rate Type': vendor.rateType,
    'Registration Date': new Date(vendor.registrationDate).toLocaleDateString()
  }));

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendors');

  // Set column widths
  const colWidths = [
    { wch: 8 },  // ID
    { wch: 20 }, // Name
    { wch: 15 }, // Contact
    { wch: 25 }, // Email
    { wch: 30 }, // Address
    { wch: 15 }, // Service Category
    { wch: 10 }, // Rate
    { wch: 12 }, // Rate Type
    { wch: 15 }  // Registration Date
  ];
  worksheet['!cols'] = colWidths;

  // Export to Excel
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};