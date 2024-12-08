import ProductCard from '../ProductCard';
import styled from 'styled-components';
import Empty from '../../../ui/Empty';
import { FiBox } from 'react-icons/fi';
import { ProductTypes } from '../../../dtos/productsDto';

const MainProductWrapper = styled.div`
  .product-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media screen and (min-width: 500px) {
    .product-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media screen and (min-width: 736px) {
    .product-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;

const MainProduct = ({ products }: { products: ProductTypes[] }) => {
  return (
    <MainProductWrapper>
      {products?.length > 0 ? (
        <div className='product-grid'>
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              className='scaleIn'
            />
          ))}
        </div>
      ) : (
        <Empty
          icon={<FiBox />}
          message='We could not find the product(s) you are looking for.'
          btnText='continue shopping'
          url='/'
          iconSize='8rem'
        />
      )}
    </MainProductWrapper>
  );
};

export default MainProduct;
