import * as XLSX from 'xlsx';
import { User } from '../../dtos/userDto';
import { StatementTypes } from '../../dtos/statementDto';
import { formatDate } from '../../utilities/HelperFunc';
import Button from '../../ui/Button';
import { FaDownload } from 'react-icons/fa';

const DownloadStatement = ({
  closingBal,
  openingBal,
  customerDetails,
  statementContent,
}: {
  closingBal: number;
  openingBal: number;
  customerDetails?: User;
  statementContent: StatementTypes[];
}) => {
  const handleExport = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Create an array to hold all the data
    const data = [];
    let runningBalance = openingBal || 0;

    // Business Information
    data.push(['Metty General Merchant']);
    data.push(['Customer Statement']);
    data.push(['', '']); // Empty row for spacing
    data.push(['', '']); // Empty row for spacing

    // Customer Details
    data.push(['Currency', 'NGN']);
    data.push(['Customer Name', customerDetails?.fullName]);
    data.push(['Opening Balance', openingBal || 0]);
    data.push(['Closing Balance', closingBal || 0]);
    data.push(['', '']); // Empty row for spacing

    // Statement header and opening balance
    data.push(['Date', 'Transaction ID', 'Debit', 'Credit', 'Balance']);
    data.push(['', 'Opening Balance', '', '', openingBal]);

    // Actual statement content
    statementContent.forEach((item) => {
      // Calculate the running balance for statement
      if (item.orderId) runningBalance += item.amount;
      if (item.paymentId) runningBalance -= item.amount;

      //   Set transaction id depending on invoice or payment
      const transactionID = item.orderId
        ? `INV-${item.orderId.invoiceNo.toUpperCase()}`
        : `PAY-${item.paymentId?.paymentId.toUpperCase()}`;

      // Set debit and credit depending whether we have orderId or paymentId.
      const debit = item.orderId ? item.amount : 0;
      const credit = item.paymentId ? item.amount : 0;

      //   Push the data.
      data.push([
        formatDate(new Date(item.date)),
        transactionID,
        debit,
        credit,
        runningBalance,
      ]);
    });
    data.push(['', '']); // Empty row for spacing

    // Closing Balance
    data.push(['', 'Closing Balance', '', '', closingBal || 0]); // Example closing balance

    // Convert the data array to a worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    ws['!cols'] = [
      { wch: 30 }, // Width for the first column
      { wch: 20 }, // Width for the second column
      { wch: 20 }, // Width for the third column
      { wch: 20 }, // Width for the fourth column
      { wch: 20 }, // Width for the fourth column
    ];

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Statement');

    // Export the workbook
    XLSX.writeFile(wb, 'statement.xlsx');
  };

  return (
    <div>
      <Button
        btnText='export to excel'
        icon={<FaDownload />}
        onBtnTrigger={handleExport}
      />
    </div>
  );
};

export default DownloadStatement;
