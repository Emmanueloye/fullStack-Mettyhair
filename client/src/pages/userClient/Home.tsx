/* eslint-disable react-refresh/only-export-components */
import Hero from '../../features/hero/Hero';
import Category from '../../features/category/CategoryMain';
import ProductDisplay from '../../features/products/ProductDisplay';
import SpecialDeal from '../../features/products/SpecialDeal';
import { getData, queryClient } from '../../api/requests';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const {
    data: { categories },
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getData({ url: `/categories?sort=createdAt&limit=4` }),
  });

  const {
    data: { products: newArrivels },
  } = useQuery({
    queryKey: ['fetchProduct', 'newArrival'],
    queryFn: () =>
      getData({
        url: `/products?quantity[gt]=0&sort=-createdAt&limit=4&isActive=true`,
      }),
  });

  const {
    data: { products: bestSeller },
  } = useQuery({
    queryKey: ['fetchProduct', 'bestSeller'],
    queryFn: () =>
      getData({
        url: `/products?quantity[gt]=0&sort=-createdAt&limit=4&isActive=true&search=appearance&value=bestSeller`,
      }),
  });

  const {
    data: { sliders },
  } = useQuery({
    queryKey: ['fetchSlider', 'clientSlider'],
    queryFn: () =>
      getData({
        url: `/sliders?sort=-createdAt&limit=3&isActive=true`,
      }),
  });

  return (
    <>
      <Helmet>
        <title>Home - MettyHair</title>
      </Helmet>
      {/* Hero section */}
      <Hero slides={sliders} />
      {/* category section */}
      {categories.length > 1 && <Category categories={categories} />}
      {/* new arrivals section */}
      {newArrivels.length >= 0 && (
        <ProductDisplay products={newArrivels} title='new arrival' />
      )}
      {/* special deal section */}
      <SpecialDeal />
      {/* best seller section */}
      {bestSeller.length >= 0 && (
        <ProductDisplay products={bestSeller} title='best seller' />
      )}
    </>
  );
};

export default Home;

export const loader = async () => {
  await queryClient.ensureQueryData({
    queryKey: ['categories'],
    queryFn: () => getData({ url: `/categories?sort=createdAt&limit=4` }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['fetchProduct', 'newArrival'],
    queryFn: () =>
      getData({
        url: `/products?quantity[gt]=0&sort=-createdAt&limit=4&isActive=true`,
      }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['fetchProduct', 'bestSeller'],
    queryFn: () =>
      getData({
        url: `/products?quantity[gt]=0&sort=-createdAt&limit=4&isActive=true&search=appearance&value=bestSeller`,
      }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['fetchSlider', 'clientSlider'],
    queryFn: () =>
      getData({
        url: `/sliders?sort=-createdAt&limit=3&isActive=true`,
      }),
  });

  return null;
};
