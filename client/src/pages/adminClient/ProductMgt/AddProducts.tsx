/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Form,
  Link,
  useActionData,
} from 'react-router-dom';
import {
  AdminHeader,
  AdminSection,
  AFormGroup,
  ThreeGrid,
} from '../../../features/adminNavLayouts/AdminUtils';
import { Select } from '../../../ui/SelectInput';
import {
  Center,
  TabContentWrapper,
} from '../../../features/Tab/TabContentWrapper';
import Input, { Label } from '../../../ui/Input';
import { useEffect, useState } from 'react';
import img from '../../../assets/images/box.webp';
import TextArea from '../../../ui/TextArea';
import Button from '../../../ui/Button';
import { MdOutlineCreateNewFolder } from 'react-icons/md';
import { getData, postData, queryClient } from '../../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { CategoriesType, SubcategoriesType } from '../../../dtos/categoriesDto';
import { InfoType } from '../../../dtos/utilsDto';
import FormError from '../../../ui/FormError';

const AddProducts = () => {
  const [productImg, setProductImg] = useState(img);
  const [thumbnails, setThumbnails] = useState([img, img]);
  const [thumbErr, setThumbErr] = useState('');
  const [allCategories, setAllCategories] = useState<CategoriesType[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<SubcategoriesType[]>(
    []
  );
  const data = useActionData() as InfoType;

  // Handles thumbnail preview
  const handleThumbnailPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...e.target.files!];
    if (files.length > 2) {
      setThumbErr('Accepts only two images');
      return;
    }

    const inputedFiles = files.map((file) => URL.createObjectURL(file));
    setThumbnails(inputedFiles);
    setThumbErr('');
  };

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

  useEffect(() => {
    setAllCategories(categories);
    setAllSubcategories(subcategories);
  }, [categories, subcategories]);

  // Filter subcategories based on the category selected.
  const handleSubcategories = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filterSubcat = subcategories.filter(
      (item: SubcategoriesType) => item.category._id === e.target.value
    );

    setAllSubcategories(filterSubcat);
  };
  return (
    <AdminSection>
      {/* page header */}
      <AdminHeader>
        <h4>Add Product</h4>
        <Link to='/admin/products'>products</Link>
      </AdminHeader>
      <TabContentWrapper $dark={true}>
        {/* Form */}
        <Form id='form' method='post' encType='multipart/form-data'>
          {data && <FormError info={data.message} />}
          {/* top form inputs */}
          <ThreeGrid>
            <AFormGroup>
              <Input
                id='productName'
                type='text'
                placeholder='Product name*'
                $dark={true}
                name='productName'
              />
            </AFormGroup>
            <AFormGroup>
              <Select
                name='category'
                id='category'
                $bg='var(--admin-input-bg)'
                $width='100%'
                onChange={handleSubcategories}
              >
                <option value='' hidden>
                  Select category*
                </option>
                {allCategories.map((category: CategoriesType) => (
                  <option value={category._id} key={category._id}>
                    {category.category}
                  </option>
                ))}
              </Select>
            </AFormGroup>
            <AFormGroup>
              <Select
                name='subcategory'
                id='subcategory'
                $bg='var(--admin-input-bg)'
                $width='100%'
              >
                <option value='' hidden>
                  Select subcategory*
                </option>
                {allSubcategories.map((subcat) => (
                  <option value={subcat._id} key={subcat._id}>
                    {subcat.subcategory}
                  </option>
                ))}
              </Select>
            </AFormGroup>
            <AFormGroup>
              <Input
                type='text'
                placeholder='Available Quantity*'
                $dark={true}
                name='quantity'
              />
            </AFormGroup>
            <AFormGroup>
              <Input
                type='text'
                placeholder='Cost Price*'
                $dark={true}
                name='costPrice'
              />
            </AFormGroup>
            <AFormGroup>
              <Input
                type='text'
                placeholder='Selling Price*'
                $dark={true}
                name='sellingPrice'
              />
            </AFormGroup>

            <AFormGroup>
              <Input
                type='text'
                placeholder='Discounted Price'
                $dark={true}
                name='discountPrice'
              />
            </AFormGroup>
            <AFormGroup>
              <Input
                type='text'
                placeholder='wholesales Price*'
                $dark={true}
                name='wholeSalerPrice'
              />
            </AFormGroup>
            <AFormGroup>
              <Input
                type='text'
                placeholder='Weight (g)*'
                $dark={true}
                name='weight'
              />
            </AFormGroup>
            <AFormGroup>
              <Input
                type='text'
                placeholder='Colors* - format: red, blue'
                $dark={true}
                name='color'
              />
            </AFormGroup>
            <AFormGroup>
              <Input
                type='text'
                placeholder='Sizes* - - format: 10inches, 20inches'
                $dark={true}
                name='size'
              />
            </AFormGroup>
            <AFormGroup>
              <Select
                name='appearance'
                id='appearance'
                $bg='var(--admin-input-bg)'
                $width='100%'
              >
                <option value='' hidden>
                  product appearance
                </option>
                <option value=' bestSeller'>best seller</option>
              </Select>
            </AFormGroup>
          </ThreeGrid>
          {/* Product image section */}
          <ThreeGrid type='image'>
            <AFormGroup>
              <Label htmlFor='p-img'>product image</Label>
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
            <AFormGroup>
              <Center>
                <img
                  src={productImg}
                  alt='product image'
                  width={70}
                  height={70}
                  className='pimg'
                />
              </Center>
            </AFormGroup>
          </ThreeGrid>
          {/* Product thumbnails section */}
          <ThreeGrid type='image'>
            <AFormGroup>
              <Label htmlFor='thumbnails'>
                product thumbnails
                <span style={{ color: 'red' }}>
                  {thumbErr && ` : ${thumbErr}`}
                </span>
              </Label>
              <Input
                id='thumbnails'
                type='file'
                $dark={true}
                name='thumbnails'
                accept='image/*'
                multiple
                onChange={handleThumbnailPreview}
              />
            </AFormGroup>
            <AFormGroup>
              <Center>
                {thumbnails.map((thumbnail, index) => (
                  <img
                    key={index}
                    src={thumbnail}
                    alt='product image'
                    width={70}
                    height={70}
                    className='pimg'
                  />
                ))}
              </Center>
            </AFormGroup>
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
              />
            </AFormGroup>
            <AFormGroup>
              <Label htmlFor='longDesc'>long description</Label>
              <TextArea
                $dark={true}
                id='longDesc'
                name='description'
                rows={6}
              />
            </AFormGroup>
          </ThreeGrid>
          <Button
            btnText='create product'
            icon={<MdOutlineCreateNewFolder />}
          />
        </Form>
      </TabContentWrapper>
    </AdminSection>
  );
};

export default AddProducts;

export const loader = async () => {
  await queryClient.ensureQueryData({
    queryKey: ['categories'],
    queryFn: () => getData({ url: `/categories?sort=createdAt` }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['subcategories'],
    queryFn: () => getData({ url: `/subcategories?sort=createdAt` }),
  });
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();
  return postData({
    url: '/products',
    data,
    redirectTo: '/admin/products',
    setToast: true,
    invalidate: ['products'],
  });
};
