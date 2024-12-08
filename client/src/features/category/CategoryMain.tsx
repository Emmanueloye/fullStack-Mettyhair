import Container from '../../ui/Container';
import img from '../../assets/images/DeskopCatBg.png';
import CategoryCard from '../products/CategoryCard';
import SectionWrapper from './CategoryStyles';
import Heading from '../../ui/Heading';
import { CategoriesType } from '../../dtos/categoriesDto';

const Category = ({ categories }: { categories: CategoriesType[] }) => {
  return (
    <SectionWrapper className='scaleIn' $bg={img} $grid={categories.length}>
      <Container>
        {/* <ProfileHeader>Product categories</ProfileHeader> */}
        <Heading title='Product categories' />
        <div className='grid'>
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              category={category.category}
              image={category.photo}
              text={'Quality, affordability and accessibility.'}
              url={`/products/category/${category.slug}/${category._id}`}
            />
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
};

export default Category;
