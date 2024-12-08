import { ProductTypes } from '../../dtos/productsDto';
import { ContentWrapper, TabContentWrapper } from './TabContentWrapper';

const DescriptionTab = ({ product }: { product: ProductTypes }) => {
  return (
    <TabContentWrapper>
      <ContentWrapper>
        <h4>{product.productName}</h4>
        <h5>
          Category: <span>{product.category.category}</span>
        </h5>
        <p>{product.description}</p>
      </ContentWrapper>
    </TabContentWrapper>
  );
};

export default DescriptionTab;
