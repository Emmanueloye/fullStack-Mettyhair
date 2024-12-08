import { Form } from 'react-router-dom';
import {
  ABox,
  AdminHeader,
  AdminSection,
  AFormGroupExt,
  InputExt,
  InputSm,
  LabelExt,
  LabelSm,
  ThreeGrid,
} from '../../../features/adminNavLayouts/AdminUtils';

import { TabContentWrapper } from '../../../features/Tab/TabContentWrapper';
import { sidebarLinks } from '../../../data/sidebarLinks';
import { changeToCamelCase } from '../../../utilities/HelperFunc';
import Button from '../../../ui/Button';
import { FaSave } from 'react-icons/fa';

// cons

const AccessManager = () => {
  return (
    <AdminSection>
      <AdminHeader>
        <h4>manage users access</h4>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        <Form id='form' method='post'>
          <ThreeGrid>
            {/* Dashboard */}
            <div
              style={{
                border: '1px solid var(--main-red-600)',
                padding: '1rem',
              }}
            >
              <AFormGroupExt className='accessmgr-group'>
                <InputExt type='checkbox' id='dashbaord' name='dashboard' />
                <LabelExt htmlFor='dashbaord'>dashboard</LabelExt>
              </AFormGroupExt>
            </div>
            {/* Page manager section */}
            {sidebarLinks.map((item) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid var(--main-red-600)',
                  padding: '1rem',
                }}
              >
                <AFormGroupExt className='group'>
                  <InputExt
                    type='checkbox'
                    id={changeToCamelCase(item.title)}
                    name={changeToCamelCase(item.title)}
                  />
                  <LabelExt htmlFor={changeToCamelCase(item.title)}>
                    {item.title}
                  </LabelExt>
                </AFormGroupExt>
                {item.links.map((link, index) => (
                  <ABox key={index}>
                    <AFormGroupExt>
                      <LabelSm htmlFor={changeToCamelCase(link)}>
                        {link}
                      </LabelSm>
                      <InputSm
                        type='checkbox'
                        id={changeToCamelCase(link)}
                        name={changeToCamelCase(link)}
                      />
                    </AFormGroupExt>
                  </ABox>
                ))}
              </div>
            ))}
          </ThreeGrid>
          <div className='mt-3'>
            <Button btnText='Save Settings' icon={<FaSave />} />
          </div>
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default AccessManager;
