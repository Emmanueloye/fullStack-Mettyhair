export type AccountLinks = {
  id: number;
  title: string;
  links: string[];
};

export const accountLinks: AccountLinks[] = [
  {
    id: 1,
    title: 'sales',
    links: ['create order', 'sales orders', 'cancelled order'],
  },
  {
    id: 2,
    title: 'account receivables',
    links: [
      'create invoice',
      'sales orders',
      'returns',
      'due invoices',
      'payment',
    ],
  },
  {
    id: 3,
    title: 'reporting',
    links: ['sales report', 'bank balance', 'customer statement'],
  },
  {
    id: 4,
    title: 'financial accounting',
    links: ['journal', 'P/L statement', 'bank balance', 'chart of account'],
  },
];
