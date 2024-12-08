import styled from 'styled-components';

const HeroSection = styled.section`
  /* display: flex;
  justify-content: center;
  align-items: center; */
  background-color: var(--primary-color);
  padding: 2rem 0 4rem;
  /* height: 100vh; */

  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 6rem;
  }
  .image-box {
    width: 20rem;
    height: 15rem;
    margin: 0 auto;
    background-color: var(--main-blue);
    border-radius: var(--rounded);

    img {
      object-fit: cover;

      z-index: 3;
    }
  }
  .msg-box {
    text-align: center;
    /* width: 90%; */
    h1 {
      color: var(--primary-text-white);
      font-weight: 800;
      text-transform: uppercase;
    }
    p {
      color: var(--secondary-text-white);
      margin-top: 2rem;
      text-align: center;
    }
  }
  .hidden {
    display: none;
  }
  .show {
    display: block;
  }

  @media screen and (min-width: 500px) {
    .grid {
      gap: 10rem;
    }
    .image-box {
      width: 48rem;
      height: 48rem;
    }
  }

  @media screen and (min-width: 1024px) {
    /* height: 90vh; */
    overflow-y: hidden;

    .relative {
      position: relative;
    }
    .circle {
      background-color: var(--main-blue);
      border-radius: var(--rounded);
      width: 40rem;
      height: 40rem;
      position: absolute;
    }
    .circle-1 {
      top: 0rem;
      right: 5rem;
    }
    .circle-2 {
      width: 42rem;
      height: 42rem;
      background-color: var(--body-bg);
      top: 40%;
      right: 15%;
    }
    .grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    .image-box {
      /* width: ;
      height: 90%; */
      background-color: transparent;
      border-radius: 0;
      order: 2;
      z-index: 5;
      img {
        height: 50.2rem;
        margin-left: -12rem;
      }
    }
    .msg-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      text-align: left;
      p {
        text-align: left;
      }
    }
  }

  @media screen and (max-width: 250px) {
    /* height: 80vh; */
    .image-box {
      display: none;
    }
  }
`;
export default HeroSection;
