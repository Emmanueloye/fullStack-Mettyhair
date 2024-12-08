import TableSearch from './TableSearch';
import { Select } from './SelectInput';

const AppTableSearch = ({
  searchOptions,
  sortOptions,
  dark,
  bg,
  onSort,
  onSearchField,
  onSearchValue,
  showSearch = true,
}: {
  searchOptions: string[];
  sortOptions: string[];
  dark?: boolean;
  bg?: string;
  onSort?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearchField?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearchValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showSearch?: boolean;
}) => {
  return (
    <div className='search-flex'>
      {showSearch && (
        <TableSearch
          searchOptions={searchOptions}
          isDark={dark}
          bg={bg}
          onSearchField={(e) => onSearchField?.(e)}
          onSearchValue={(e) => onSearchValue?.(e)}
        />
      )}
      <Select
        $bg={bg}
        style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
        name='sort'
        onChange={onSort}
      >
        <option value='' hidden>
          Sort table by
        </option>
        {sortOptions.map((option, key) => (
          <option value={option} key={key}>
            {option}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default AppTableSearch;
