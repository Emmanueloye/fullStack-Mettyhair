export type AccountLinks = {
  id: number;
  title: string;
  links: string[];
};

export const accountLinks: AccountLinks[] = [
  {
    id: 1,
    title: 'sales',
    links: ['create order', 'sales orders'],
  },
  {
    id: 2,
    title: 'account receivables',
    links: ['sales orders', 'returns', 'payment'],
  },
  {
    id: 3,
    title: 'reporting',
    links: ['sales report', 'customer statement'],
  },
  {
    id: 4,
    title: 'financial accounting',
    links: ['expenses', 'expense head', 'P/L statement'],
  },
];
