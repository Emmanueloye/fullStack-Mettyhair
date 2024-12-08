import Container from '../../ui/Container';
import Grid from '../../ui/Grid';
import ProductCard from './ProductCard';
import Heading from '../../ui/Heading';
import { ProductTypes } from '../../dtos/productsDto';

const ProductDisplay = ({
  products,
  title,
}: {
  products: ProductTypes[];
  title: string;
}) => {
  return (
    <section className='scaleIn' style={{ marginTop: '8rem' }}>
      <Container>
        <Heading title={title} />

        <Grid>
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </Grid>
      </Container>
    </section>
  );
};

export default ProductDisplay;
