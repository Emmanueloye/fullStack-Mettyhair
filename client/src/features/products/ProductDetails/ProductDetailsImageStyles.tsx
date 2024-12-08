import styled from 'styled-components';

const ProductImageWrapper = styled.article`
  width: 100%;
  .product-img {
    border: 1px solid #d4d4d8;
    border-radius: var(--border-radius-md);
    width: 100%;
    height: 35.7rem;
    margin-bottom: 2rem;
    object-fit: fill;
  }

  .thumbnails {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;

    img {
      border: 1px solid #d4d4d8;
      border-radius: var(--border-radius-md);
      width: 10rem;
      height: 10rem;
      object-fit: cover;
      transition: all 0.3s ease-in-out;
    }
    .active {
      border: 2px solid var(--primary-color);
      padding: 0.5rem;
    }
  }

  @media screen and (min-width: 768px) {
    .product-img {
      height: 50rem;
    }
    .thumbnails {
      gap: 1rem;
      img {
        width: 7rem;
        height: 7rem;
      }
    }
  }

  @media screen and (min-width: 820px) {
    .product-img {
      height: 42rem;
    }
  }
`;

export default ProductImageWrapper;
