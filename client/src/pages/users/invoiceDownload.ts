import html2pdf from 'html2pdf.js';

export const handleInvoiceDownlaod = async (
  invoiceRef: React.MutableRefObject<null>
) => {
  if (invoiceRef.current) html2pdf(invoiceRef.current, { margin: 20 });
};
