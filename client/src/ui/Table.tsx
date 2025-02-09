import styled from 'styled-components';

export const TableBox = styled.div`
  border: 1px solid var(--main-red-200);
  font-size: 1.4rem;
  background-color: transparent;
  border-radius: 7px;
  overflow-x: auto;
  @media screen and (min-width: 1190px) {
    overflow-x: visible;
  }
`;
// 1fr 1.8fr 2.2fr 1fr 1fr 1fr 1fr
export const TableHeader = styled.div<{ $column?: string; $width?: string }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$column ? props.$column : 'repeat(5, 1fr)'};
  column-gap: 2.4rem;
  align-items: center;
  background-color: var(--main-red-50);
  border-bottom: 1px solid var(--main-red-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
  min-width: ${(props) => (props.$width ? `${props.$width}` : '90rem')};
`;

export const TableRow = styled.div<{ $column?: string; $width?: string }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$column ? props.$column : 'repeat(5, 1fr)'};
  column-gap: 2.4rem;
  align-items: center;
  color: var(--admin-sec-text-color);
  padding: 1rem 2.4rem;
  min-width: ${(props) => (props.$width ? `${props.$width}` : '90rem')};
  text-transform: capitalize;
  &:not(:last-child) {
    border-bottom: 1px solid var(--main-red-300);
  }
  p {
    font-size: 1.4rem;
  }
`;
export const TableContainer = ({ children }: { children: React.ReactNode }) => {
  return <TableBox role='table'>{children}</TableBox>;
};

type TablePropsType = {
  headers: string[];
  column?: string;
  width?: string;
  children: React.ReactNode;
};

export const Table = ({ headers, column, width, children }: TablePropsType) => {
  return (
    <TableContainer>
      <TableHeader $column={column} $width={width}>
        {headers?.map((header, index) => (
          <div key={index} role='table header'>
            {header}
          </div>
        ))}
      </TableHeader>
      {children}
    </TableContainer>
  );
};
