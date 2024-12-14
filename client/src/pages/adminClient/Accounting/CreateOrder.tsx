import { Form, Link } from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  ThreeGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import Input, { Label } from '../../../ui/Input';
import { Select } from '../../../ui/SelectInput';

const CreateOrder = () => {
  return (
    <AdminSection>
      {/* Header */}
      <AdminHeader>
        <h4>Create order</h4>
        <Link to='/admin/account'>Account dashboard</Link>
      </AdminHeader>
      <Form id='form' method='post'>
        {/* header */}
        <ThreeGrid>
          <AFormGroup>
            <Label>customer</Label>
            <Select $width='100%' $bg='var(--admin-input-bg)' name='fullName'>
              <option value=''>customer 1</option>
            </Select>
          </AFormGroup>
          <AFormGroup>
            <Label>Email</Label>
            <Input type='email' $dark name='email' />
          </AFormGroup>
          <AFormGroup>
            <Label>Telephone</Label>
            <Input type='text' $dark name='phoe' />
          </AFormGroup>
        </ThreeGrid>
      </Form>
    </AdminSection>
  );
};

export default CreateOrder;
