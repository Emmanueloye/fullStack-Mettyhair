/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Form,
  Link,
  LoaderFunctionArgs,
  useActionData,
  useLoaderData,
} from 'react-router-dom';
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
import { Select } from '../../../ui/SelectInput';
import TextArea from '../../../ui/TextArea';
import Button from '../../../ui/Button';
import { GrUpdate } from 'react-icons/gr';
import { useEffect, useRef, useState } from 'react';
import { getData, queryClient, updateData } from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { CategoriesType, SubcategoriesType } from '../../../dtos/categoriesDto';
import FormError from '../../../ui/FormError';
import { InfoType } from '../../../dtos/utilsDto';

const EditProduct = () => {
  const params = useLoaderData() as { id: string };
  const data = useActionData() as InfoType;
  const categoryRef = useRef<HTMLSelectElement>(null);

  const {
    data: { product },
  } = useQuery({
    queryKey: ['fetchProduct', 'product', params.id],
    queryFn: () => getData({ url: `/products/${params.id}` }),
  });

  const {
    data: { categories },
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getData({ url: `/categories?sort=createdAt` }),
  });

  const {
    data: { subcategories },
  } = useQuery({
    queryKey: ['subcategories'],
    queryFn: () => getData({ url: `/subcategories?sort=createdAt` }),
  });

  const [productImg, setProductImg] = useState(product.productImage);
  const [thumbOne, setThumbOne] = useState(product.thumbnails.at(0));
  const [thumbTwo, setThumbTwo] = useState(product.thumbnails.at(1));
  const [allSubcategories, setAllSubcategories] =
    useState<SubcategoriesType[]>(subcategories);
  const [showDefault, setShowDefault] = useState(true);

  useEffect(() => {
    if (categoryRef.current) {
      const filteredSubcats = subcategories.filter(
        (item: SubcategoriesType) =>
          item.category._id === categoryRef.current!.value
      );
      setAllSubcategories(filteredSubcats);
    }
  }, [subcategories]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filteredSubcats = subcategories.filter(
      (item: SubcategoriesType) => item.category._id === e.target.value
    );
    setShowDefault(false);
    setAllSubcategories(filteredSubcats);
  };

  return (
    <AdminSection>
      {/* page header */}
      <AdminHeader>
        <h4>update Product: {product.productName}</h4>
        <Link to='/admin/products'>products</Link>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        {/* Form */}
        <Form id='form' method='post' encType='multipart/form-data'>
          {data && <FormError info={data.message} />}
          {/* top form inputs */}
          <ThreeGrid>
            <AFormGroup>
              <Label htmlFor='productName' type='dark'>
                product name
              </Label>
              <Input
                id='productName'
                type='text'
                placeholder='Product name*'
                $dark={true}
                name='productName'
                defaultValue={product.productName}
                $capitalize={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='category' type='dark'>
                category
              </Label>
              <Select
                name='category'
                id='category'
                $bg='var(--admin-input-bg)'
                $width='100%'
                ref={categoryRef}
                onChange={handleCategoryChange}
              >
                <option value={product.category._id}>
                  {product.category.category}
                </option>
                {categories
                  .filter(
                    (item: CategoriesType) => item._id !== product.category._id
                  )
                  .map((category: CategoriesType) => (
                    <option value={category._id} key={category._id}>
                      {category.category}
                    </option>
                  ))}
              </Select>
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='subcategory' type='dark'>
                subcategory
              </Label>
              <Select
                name='subcategory'
                id='subcategory'
                $bg='var(--admin-input-bg)'
                $width='100%'
              >
                {showDefault && (
                  <option value={product.subcategory._id}>
                    {product.subcategory.subcategory}
                  </option>
                )}
                {showDefault
                  ? allSubcategories
                      .filter((item) => item._id !== product.subcategory._id)
                      .map((subcat) => (
                        <option value={subcat._id} key={subcat._id}>
                          {subcat.subcategory}
                        </option>
                      ))
                  : allSubcategories.map((subcat) => (
                      <option value={subcat._id} key={subcat._id}>
                        {subcat.subcategory}
                      </option>
                    ))}
              </Select>
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='quantity' type='dark'>
                quantity
              </Label>
              <Input
                id='quantity'
                type='text'
                placeholder='Available Quantity*'
                $dark={true}
                name='quantity'
                defaultValue={product.quantity}
              />
            </AFormGroup>

            <AFormGroup>
              <Label htmlFor='sellingPrice' type='dark'>
                selling price
              </Label>
              <Input
                id='sellingPrice'
                type='text'
                placeholder='Selling Price*'
                $dark={true}
                name='sellingPrice'
                defaultValue={product.sellingPrice && product.sellingPrice}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='costPrice' type='dark'>
                cost price
              </Label>
              <Input
                id='costPrice'
                type='text'
                placeholder='Cost Price*'
                $dark={true}
                name='costPrice'
                defaultValue={product.costPrice && product.costPrice}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='discountPrice' type='dark'>
                discounted price
              </Label>
              <Input
                id='discountPrice'
                type='text'
                $dark={true}
                name='discountPrice'
                defaultValue={product.discountPrice && product.discountPrice}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='wholesalerPrice' type='dark'>
                wholesaler price
              </Label>
              <Input
                type='text'
                $dark={true}
                name='wholeSalerPrice'
                defaultValue={product?.wholeSalerPrice}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='weight' type='dark'>
                weight in gram
              </Label>
              <Input
                type='number'
                placeholder='Weight (g)*'
                $dark={true}
                name='weight'
                defaultValue={product?.weight}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='color' type='dark'>
                available colors
              </Label>
              <Input
                id='color'
                type='text'
                placeholder='Colors* - format: red, blue'
                $dark={true}
                name='color'
                defaultValue={product.color}
                $capitalize={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='size' type='dark'>
                available sizes
              </Label>
              <Input
                id='size'
                type='text'
                placeholder='Sizes* - - format: 10inches, 20inches'
                $dark={true}
                name='size'
                defaultValue={product.size}
                $capitalize={true}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='appearance' type='dark'>
                appearance
              </Label>
              <Select
                name='appearance'
                id='appearance'
                $bg='var(--admin-input-bg)'
                $width='100%'
              >
                {product.appearance ? (
                  <option value={product.appearance}>
                    {product.appearance}
                  </option>
                ) : (
                  <>
                    <option value='' hidden>
                      select appearance
                    </option>
                    <option value='bestSeller'>best seller</option>
                  </>
                )}
              </Select>
            </AFormGroup>
          </ThreeGrid>
          <ThreeGrid>
            {/* Product image section */}
            <AFormGroup>
              <Label htmlFor='p-img' type='dark'>
                product image
              </Label>
              <Center>
                <img
                  src={productImg}
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
                onChange={(e) =>
                  setProductImg(URL.createObjectURL(e.target.files![0]))
                }
              />
            </AFormGroup>
            {/* Product thumbnail one */}
            <AFormGroup>
              <Label htmlFor='thumbOne' type='dark'>
                product thumbnail
              </Label>
              <Center>
                <img
                  src={thumbOne}
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
                name='thumbOne'
                accept='image/*'
                onChange={(e) =>
                  setThumbOne(URL.createObjectURL(e.target.files![0]))
                }
              />
            </AFormGroup>
            {/* Product thumbnail two */}
            <AFormGroup>
              <Label htmlFor='thumbTwo' type='dark'>
                product thumbnail
              </Label>
              <Center>
                <img
                  src={thumbTwo}
                  alt='product image'
                  width={70}
                  height={70}
                  className='pimg mb-1'
                />
              </Center>
              <Input
                id='thumbTwo'
                type='file'
                $dark={true}
                name='thumbTwo'
                accept='image/*'
                onChange={(e) =>
                  setThumbTwo(URL.createObjectURL(e.target.files![0]))
                }
              />
            </AFormGroup>
          </ThreeGrid>

          <ThreeGrid type='full'>
            <AFormGroup>
              <Label htmlFor='shortDesc' type='dark'>
                short description
              </Label>
              <TextArea
                $dark={true}
                id='shortDesc'
                name='shortDesc'
                rows={3}
                cols={10}
                defaultValue={product.shortDesc}
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='longDesc' type='dark'>
                long description
              </Label>
              <TextArea
                $dark={true}
                id='longDesc'
                name='description'
                rows={6}
                defaultValue={product.description}
              />
            </AFormGroup>
          </ThreeGrid>
          <Button btnText='update product' icon={<GrUpdate />} />
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default EditProduct;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchProduct', 'product', params.id],
    queryFn: () => getData({ url: `/products/${params.id}` }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['categories'],
    queryFn: () => getData({ url: `/categories?sort=createdAt` }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['subcategories'],
    queryFn: () => getData({ url: `/subcategories?sort=createdAt` }),
  });
  return params;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const data = await request.formData();

  const resp = await updateData({
    url: `/products/${params.id}`,
    data,
    redirectTo: '/admin/products',
    setToast: true,
  });
  queryClient.invalidateQueries({ queryKey: ['fetchProduct'] });
  queryClient.invalidateQueries({ queryKey: ['categories'] });
  queryClient.invalidateQueries({ queryKey: ['subcategories'] });
  return resp;
};
