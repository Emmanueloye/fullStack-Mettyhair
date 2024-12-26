import styled from 'styled-components';

export const BlogHeroBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--main-red-200);
  background-size: 100%;
  width: 100%;
  padding: 20rem 0;
  position: relative;
  .hero-txt {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .inner-text {
    color: var(--primary-white);
    text-align: center;
    h1 {
      display: inline-block;
      background-color: var(--main-red-600);
      padding: 1rem 1.5rem;
      margin-top: 1rem;
    }
    p {
      background-color: var(--main-red-600);
      text-align: center;
      margin-top: 0.3rem;
      padding: 1rem 2rem;
    }
  }

  .img {
    position: absolute;
    border-radius: 50%;
  }
  .img-1 {
    top: 0;
    left: 4rem;
    animation: middleToTopLeft 1s;
    transition: var(--transition);
  }
  .img-2 {
    top: 0;
    right: 7rem;
    animation: middleToTopRight 1s;
    transition: var(--transition);
  }
  .img-3 {
    bottom: 0;
    right: 7rem;
    animation: middleToBottomRight 1s;
    transition: var(--transition);
  }
  .img-4 {
    bottom: 0;
    left: 4rem;
    animation: middleToBottomRight 1s;
    transition: var(--transition);
  }

  @keyframes middleToBottomLeft {
    from {
      top: 30%;
      left: 40%;
      opacity: 0;
    }
    to {
      bottom: 0;
      left: 4rem;
      opacity: 1;
    }
  }

  @keyframes middleToTopLeft {
    from {
      top: 30%;
      left: 40%;
      opacity: 0;
    }
    to {
      top: 0;
      left: 4rem;
      opacity: 1;
    }
  }

  @keyframes middleToTopRight {
    from {
      top: 30%;
      left: 40%;
      opacity: 0;
    }
    to {
      top: 0;
      right: 7rem;
      opacity: 1;
    }
  }
  @keyframes middleToBottomRight {
    from {
      top: 30%;
      left: 40%;
      opacity: 0;
    }
    to {
      bottom: 0;
      right: 7rem;
      opacity: 1;
    }
  }

  @media screen and (max-width: 570px) {
    .img-3,
    .img-2 {
      display: none;
    }
    .img-1 {
      left: 50%;
      transform: translateX(-50%);
    }
    .img-4 {
      left: 50%;
      transform: translateX(-50%);
    }
    @keyframes middleToTopLeft {
      from {
        top: 30%;
        left: 40%;
        opacity: 0;
      }
      to {
        top: 0;
        left: 50%;
        opacity: 1;
      }
    }
  }

  @keyframes middleToBottomRight {
    from {
      top: 30%;
      left: 40%;
      opacity: 0;
    }
    to {
      bottom: 0;
      right: 50%;
      opacity: 1;
    }
  }
`;
