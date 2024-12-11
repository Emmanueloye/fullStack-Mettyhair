import {
  AdminSection,
  ThreeGrid,
} from '../../../features/adminNavLayouts/AdminUtils';

import { accountLinks } from '../../../data/accountLinks';
import AccountItem from '../../../features/adminAccordion/AccountItem';

const Account = () => {
  return (
    <AdminSection>
      <ThreeGrid>
        {accountLinks.map((item) => (
          <AccountItem menuItem={item} key={item.id} />
        ))}
      </ThreeGrid>
    </AdminSection>
  );
};

export default Account;
