import { FaSearch } from 'react-icons/fa';
import Input from './Input';
import styled from 'styled-components';
import { Form } from 'react-router-dom';
import { Select } from './SelectInput';
import { changeToCamelCase } from '../utilities/HelperFunc';

const SearchContainer = styled.div<{ $bg?: string }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;

  select {
    display: block;
    /* background-color: var(--body-bg); */
    border: none;
    font-family: 'Lato', sans-serif;
    font-size: 1.4rem;
    padding: 0.3rem 2rem;
    outline: none;
    text-transform: capitalize;

    appearance: list-menu;

    height: 4.4rem;
  }
  .input-box {
    position: relative;
    .icon {
      position: absolute;
      font-size: 2rem;
      top: 50%;
      transform: translateY(-50%);
      right: 1rem;
    }
  }
  @media screen and (min-width: 500px) {
    flex-direction: row;
  }
`;

const TableSearch = ({
  isDark,
  bg,
  searchOptions,
  onSearchField,
  onSearchValue,
}: {
  searchOptions: string[];
  isDark?: boolean;
  bg?: string;
  onSearchField: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearchValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Form>
      <SearchContainer $bg={bg}>
        <Select $bg={bg} name='query' id='query' onChange={onSearchField}>
          {searchOptions.map((header) => {
            return (
              <option key={header} value={changeToCamelCase(header)}>
                {header}
              </option>
            );
          })}
        </Select>
        <div className='input-box'>
          <Input
            type='text'
            placeholder='search...'
            id='search'
            name='search'
            $dark={isDark}
            onChange={onSearchValue}
          />
          <FaSearch className='icon' />
        </div>
      </SearchContainer>
    </Form>
  );
};

export default TableSearch;
