/* eslint-disable react-refresh/only-export-components */
import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  ThreeGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import {
  Center,
  TabContentWrapper,
} from '../../../features/Tab/TabContentWrapper';
import Input, { Label } from '../../../ui/Input';
import TextArea from '../../../ui/TextArea';
import { getData, queryClient } from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { formatDate, formatNumber } from '../../../utilities/HelperFunc';

const ProductView = () => {
  const params = useLoaderData() as { id: string };

  const {
    data: { product },
  } = useQuery({
    queryKey: ['fetchProduct', 'product', params.id],
    queryFn: () => getData({ url: `/products/${params.id}` }),
  });

  return (
    <AdminSection>
      {/* page header */}
      <AdminHeader>
        <h4>Product details: {product.productName}</h4>
        <Link to='/admin/products'>products</Link>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        {/* top form inputs */}
        <ThreeGrid>
          <AFormGroup>
            <Label htmlFor='status'>status</Label>
            <Input
              id='status'
              type='text'
              $dark={true}
              defaultValue={product.isActive ? 'Active' : 'Inactive'}
              disabled
              $capitalize={true}
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='product'>Product name</Label>
            <Input
              id='product'
              type='text'
              $dark={true}
              defaultValue={product.productName}
              disabled
              $capitalize={true}
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='category'>category</Label>
            <Input
              id='category'
              type='text'
              $dark={true}
              defaultValue={product.category.category}
              disabled
              $capitalize={true}
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='subcategory'>subcategory</Label>
            <Input
              id='subcategory'
              type='text'
              $dark={true}
              defaultValue={product.subcategory.subcategory}
              disabled
              $capitalize={true}
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='quantity'>Available Quantity</Label>
            <Input
              id='quantity'
              type='text'
              $dark={true}
              defaultValue={product.quantity}
              disabled
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='sellingPrice'>selling Price</Label>
            <Input
              id='sellingPrice'
              type='text'
              $dark={true}
              defaultValue={formatNumber(product.sellingPrice)}
              disabled
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='costPrice'>cost Price</Label>
            <Input
              id='costPrice'
              type='text'
              $dark={true}
              defaultValue={
                product.costPrice && formatNumber(product.costPrice)
              }
              disabled
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='discountPrice'>discount Price</Label>
            <Input
              id='discountPrice'
              type='text'
              $dark={true}
              defaultValue={
                product.discountPrice && formatNumber(product.discountPrice)
              }
              disabled
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='color'>available colors</Label>
            <Input
              id='color'
              type='text'
              $dark={true}
              defaultValue={product.color}
              disabled
              $capitalize={true}
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='size'>available sizes</Label>
            <Input
              id='size'
              type='text'
              $dark={true}
              defaultValue={product.size}
              disabled
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='appearance'>product appearance</Label>
            <Input
              id='appearance'
              type='text'
              $dark={true}
              defaultValue={product.appearance}
              disabled
            />
          </AFormGroup>
        </ThreeGrid>
        <ThreeGrid>
          {/* Product image section */}
          <AFormGroup>
            <Label htmlFor='p-img'>product image</Label>
            <Center>
              <img
                src={product.productImage}
                alt='product image'
                width={70}
                height={70}
                className='pimg mb-1'
              />
            </Center>
            <Input
              id='p-img'
              type='file'
              $dark={true}
              name='productImage'
              accept='image/*'
              disabled
            />
          </AFormGroup>
          {/* Product thumbnails */}
          {product.thumbnails.map((image: string, index: number) => (
            <AFormGroup key={index}>
              <Label htmlFor='thumbOne'>product thumbnail</Label>
              <Center>
                <img
                  src={image}
                  alt='product image'
                  width={70}
                  height={70}
                  className='pimg mb-1'
                />
              </Center>
              <Input
                id='thumbOne'
                type='file'
                $dark={true}
                name='productImage'
                accept='image/*'
                disabled
              />
            </AFormGroup>
          ))}
        </ThreeGrid>

        <ThreeGrid type='full'>
          <AFormGroup>
            <Label htmlFor='shortDesc'>short description</Label>
            <TextArea
              $dark={true}
              id='shortDesc'
              name='shortDesc'
              rows={3}
              cols={10}
              defaultValue={product.shortDesc}
              disabled
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='longDesc'>long description</Label>
            <TextArea
              $dark={true}
              id='longDesc'
              name='longDesc'
              rows={6}
              defaultValue={product.description}
              disabled
            />
          </AFormGroup>
        </ThreeGrid>
        <ThreeGrid type='two'>
          <AFormGroup>
            <Label htmlFor='createdBy'>created by</Label>
            <Input
              id='createdBy'
              type='text'
              $dark={true}
              defaultValue={product.createdBy?.fullName}
              disabled
              $capitalize={true}
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='createdDate'>created Date</Label>
            <Input
              id='createdDate'
              type='text'
              $dark={true}
              defaultValue={
                product.createdAt && formatDate(new Date(product.createdAt))
              }
              disabled
              $capitalize={true}
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='editedBy'>last edited by</Label>
            <Input
              id='editedBy'
              type='text'
              $dark={true}
              defaultValue={product.updatedBy?.fullName}
              disabled
              $capitalize={true}
            />
          </AFormGroup>
          <AFormGroup>
            <Label htmlFor='editedDate'>last edited Date</Label>
            <Input
              id='editedDate'
              type='text'
              $dark={true}
              defaultValue={
                product.updatedAt && formatDate(new Date(product.updatedAt))
              }
              disabled
              $capitalize={true}
            />
          </AFormGroup>
        </ThreeGrid>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default ProductView;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchProduct', 'product', params.id],
    queryFn: () => getData({ url: `/products/${params.id}` }),
  });

  return params;
};
