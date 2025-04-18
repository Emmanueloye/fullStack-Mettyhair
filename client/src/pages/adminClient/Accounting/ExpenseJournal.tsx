/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Link,
  useActionData,
  useSubmit,
} from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
} from '../../../features/adminNavLayouts/AdminUtils';
import {
  BtnUI,
  FourGrid,
  OrderLabel,
} from '../../../features/adminAccount/adminOrderStyles';
import Button from '../../../ui/Button';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { Select } from '../../../ui/SelectInput';
import Input from '../../../ui/Input';
import { useState } from 'react';
import TotalWrapper from '../../../features/shoppingCart/ProductTotalStyles';
import { formatNumber } from '../../../utilities/HelperFunc';
import {
  extractFormData,
  getData,
  postData,
  queryClient,
} from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { ExpenseHeadType } from '../../../dtos/ExpenseHeadDto';
import FormError from '../../../ui/FormError';
import { InfoType } from '../../../dtos/utilsDto';

type ExpensesType = {
  expenseHead: string;
  description: string;
  amount: string;
};

const ExpenseJournal = () => {
  const [expenses, setExpenses] = useState([
    { expenseHead: '', description: '', amount: '' },
  ]);
  const [total, setTotal] = useState(0);
  const submit = useSubmit();
  const error = useActionData() as InfoType;

  // fetch expense heads
  const { data } = useQuery({
    queryKey: ['fetchExpenseHead', 'expenseHeads'],
    queryFn: () => getData({ url: '/expense-head?isActive=true' }),
  });

  // Add more inputs dynamically
  const handleAddBtn = () => {
    setExpenses([
      ...expenses,
      { expenseHead: '', description: '', amount: '' },
    ]);
  };

  // Handle input changes
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const { name, value } = e.target;
    const changedData = [...expenses];
    changedData[i][name as keyof ExpensesType] = value;
    setExpenses(changedData);
    calculateTotal();
  };

  // To calculate total expenses posted
  const calculateTotal = () => {
    const totalExpenses = expenses.reduce((acc, item) => {
      return acc + Number(item.amount);
    }, 0);
    setTotal(totalExpenses);
  };

  // Handle input deletion
  const handleDelete = (i: number) => {
    const deleteValue = [...expenses];
    deleteValue.splice(i, 1);
    setExpenses(deleteValue);
  };

  // Send form inputs to react router action
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('expenses', JSON.stringify(expenses));
    submit(formData, { method: 'POST' });
  };

  return (
    <AdminSection>
      <AdminHeader>
        <h4>Post Expenses</h4>
        <Link to='/admin/account/expenses'>All expenses</Link>
      </AdminHeader>

      {error && <FormError info={error.message} />}

      <BtnUI type='button' onClick={handleAddBtn}>
        Add +
      </BtnUI>

      <div style={{ overflowX: 'auto', margin: '2rem 0 2rem 0' }}>
        {/* Header */}
        <FourGrid type='dark'>
          <OrderLabel>expense head</OrderLabel>
          <OrderLabel>description</OrderLabel>
          <OrderLabel>amount</OrderLabel>
          <OrderLabel>action</OrderLabel>
        </FourGrid>
        {/* Dynamic inputs */}
        {expenses.map((value, index) => {
          return (
            <FourGrid type='dark' key={index}>
              <AFormGroup className='mb-0'>
                <Select
                  $width='100%'
                  $bg='var(--admin-input-bg)'
                  name='expenseHead'
                  onChange={(e) => handleChange(e, index)}
                  value={value.expenseHead}
                >
                  <option value='' hidden>
                    select expense head
                  </option>
                  {data?.expenseHeads.map((item: ExpenseHeadType) => (
                    <option value={item._id} key={item._id}>
                      {item.description}
                    </option>
                  ))}
                </Select>
              </AFormGroup>
              <AFormGroup className='mb-0'>
                <Input
                  type='text'
                  id={`description-${index}`}
                  name='description'
                  $dark
                  onChange={(e) => handleChange(e, index)}
                  value={value.description}
                />
              </AFormGroup>
              <AFormGroup className='mb-0'>
                <Input
                  type='number'
                  id={`amount-${index}`}
                  name='amount'
                  $dark
                  onChange={(e) => handleChange(e, index)}
                  value={value.amount}
                />
              </AFormGroup>
              <AFormGroup style={{ display: 'flex', alignItems: 'center' }}>
                <BtnUI type='button' onClick={() => handleDelete(index)}>
                  <FaTimes />
                </BtnUI>
              </AFormGroup>
            </FourGrid>
          );
        })}
      </div>
      {/* Total box */}
      <TotalWrapper $dark>
        <div className='box'>
          <div className='cost-breakdown'>
            <div className='subtotal'>
              <p>total:</p>
              <p>&#8358; {formatNumber(total) || `0.00`}</p>
            </div>
          </div>
        </div>
      </TotalWrapper>
      {/* Submit button */}
      <Button
        type='button'
        btnText='post'
        icon={<FaPlus />}
        onBtnTrigger={handleSubmit}
      />
    </AdminSection>
  );
};

export default ExpenseJournal;

export const loader = async () => {
  return queryClient.ensureQueryData({
    queryKey: ['fetchExpenseHead', 'expenseHeads'],
    queryFn: () => getData({ url: '/expense-head?isActive=true' }),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  return postData({
    url: '/expenses',
    data,
    invalidate: ['fetchExpenses'],
    redirectTo: '/admin/account/expenses',
    setToast: true,
  });
};
