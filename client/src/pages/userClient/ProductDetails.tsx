/* eslint-disable react-refresh/only-export-components */
import Container from '../../ui/Container';
import ProductImage from '../../features/products/ProductDetails/ProductDetailsImage';
import ProductDetailsInfo from '../../features/products/ProductDetails/ProductDetailsInfo';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import styled from 'styled-components';
import ProductDisplay from '../../features/products/ProductDisplay';
import Tab from '../../features/Tab/Tab';
import { useAppSelector } from '../../store/hook';
import DescriptionTab from '../../features/Tab/DescriptionTab';
import ReviewTab from '../../features/Tab/ReviewTab';
import CustomersReviews from '../../features/Tab/CustomersReviews';
import { getData, queryClient } from '../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { ProductTypes } from '../../dtos/productsDto';
import HelmetSEO from '../../features/seo/HelmetSEO';

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media screen and (min-width: 779px) {
    grid-template-columns: 40% 60%;
  }
`;

const ProductDetails = () => {
  const params = useLoaderData() as { slug: string; id: string };

  const { tabIndex } = useAppSelector((state) => state.ui);

  const {
    data: { product },
  } = useQuery({
    queryKey: ['fetchProduct', 'productDetails', params.id],
    queryFn: () => getData({ url: `/products/${params.id}` }),
  });

  const {
    data: { products: relatedProducts },
  } = useQuery({
    queryKey: ['fetchProduct', 'products', product.category._id],
    queryFn: () =>
      getData({
        url: `/products?category=${product.category._id}&sort=-createdAt&limit=10`,
      }),
  });

  const filteredRelatedProducts = relatedProducts
    .filter((item: ProductTypes) => item._id !== product._id)
    .slice(0, 4);

  return (
    <>
      <HelmetSEO
        title={`MettyHair - ${product.productName.toUpperCase()}`}
        description={product.description}
        name={product.productName}
        type='article'
        image={product.productImage}
      />
      <section style={{ paddingTop: '3rem' }}>
        <Container>
          <TwoColumnGrid className='scaleIn'>
            {/* Product image */}
            <ProductImage product={product} />
            {/* Product information */}
            <ProductDetailsInfo product={product} />
          </TwoColumnGrid>
          {/* Tab */}
          <div className='scaleIn'>
            <Tab btnLabels={['description', 'add review', 'review']}>
              {tabIndex === 0 && <DescriptionTab product={product} />}
              {tabIndex === 1 && <ReviewTab product={product} />}
              {tabIndex === 2 && <CustomersReviews reviews={product.reviews} />}
            </Tab>
          </div>
          {/* Related products */}
          {filteredRelatedProducts.length > 0 && (
            <ProductDisplay
              products={filteredRelatedProducts}
              title='related products'
            />
          )}
        </Container>
      </section>
    </>
  );
};

export default ProductDetails;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const resp = await queryClient.ensureQueryData({
    queryKey: ['fetchProduct', 'productDetails', params.id],
    queryFn: () => getData({ url: `/products/${params.id}` }),
  });

  const categoryId = resp.product.category._id;
  await queryClient.ensureQueryData({
    queryKey: ['fetchProduct', 'products', categoryId],
    queryFn: () =>
      getData({
        url: `/products?category=${categoryId}&sort=-createdAt&limit=10`,
      }),
  });
  return params;
};
