import { useState } from 'react';
import { AdminSection } from '../../../features/adminNavLayouts/AdminUtils';

const SalesJournal = () => {
  const [journalEntries, setJournalEntries] = useState([
    {
      date: '',
      account: '',
      debit: 0,
      credit: 0,
      amount: 0,
    },
  ]);

  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [balance, setBalance] = useState(0);

  const handleAddRow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setJournalEntries([
      ...journalEntries,
      {
        date: '',
        account: '',
        debit: 0,
        credit: 0,
        amount: 0,
      },
    ]);
  };

  const handleRemoveRow = (
    index: number,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setJournalEntries(journalEntries.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    if (name && value) {
      const newJournalEntries = [...journalEntries];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newJournalEntries as any)[index][name] = value;
      setJournalEntries(newJournalEntries);
      calculateTotals();
    }
  };

  const calculateTotals = () => {
    let totalDebit = 0;
    let totalCredit = 0;

    journalEntries.forEach((entry) => {
      totalDebit += entry.debit;
      totalCredit += entry.credit;
    });

    setTotalDebit(totalDebit);
    setTotalCredit(totalCredit);
    setBalance(totalDebit - totalCredit);
  };

  return (
    <AdminSection>
      <form>
        <div className='header-section'>
          <label htmlFor='journal-date'>Journal Date:</label>
          <input type='date' id='journal-date' name='journal-date' />
          <label htmlFor='journal-description'>Journal Description:</label>
          <input
            type='text'
            id='journal-description'
            name='journal-description'
          />
        </div>
        <div className='journal-entries-table'>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Account</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {journalEntries.map((entry, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type='date'
                      name='date'
                      value={entry.date}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </td>
                  <td>
                    <input
                      type='text'
                      name='account'
                      value={entry.account}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </td>
                  <td>
                    <input
                      type='number'
                      name='debit'
                      value={entry.debit}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </td>
                  <td>
                    <input
                      type='number'
                      name='credit'
                      value={entry.credit}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </td>
                  <td>
                    <input
                      type='number'
                      name='amount'
                      value={entry.amount}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </td>
                  <td>
                    <button onClick={(e) => handleRemoveRow(index, e)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='footer-section'>
          <label htmlFor='total-debit'>Total Debit:</label>
          <input
            type='number'
            id='total-debit'
            name='total-debit'
            value={totalDebit}
            readOnly
          />
          <label htmlFor='total-credit'>Total Credit:</label>
          <input
            type='number'
            id='total-credit'
            name='total-credit'
            value={totalCredit}
            readOnly
          />
          <label htmlFor='balance'>Balance:</label>
          <input
            type='number'
            id='balance'
            name='balance'
            value={balance}
            readOnly
          />
        </div>
        <button onClick={handleAddRow}>Add Row</button>
      </form>
    </AdminSection>
  );
};

export default SalesJournal;
