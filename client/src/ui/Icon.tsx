import styled from 'styled-components';

type IconProps = {
  icon: React.ReactNode;
  text?: string;
  color?: string;
  iconSize?: string;
  textSize?: string;
  space?: string;
  iconSpacing?: string;
  className?: string;
  openModal?: () => void;
};

type IconWrapperType = {
  $color?: string;
  $iconSize?: string;
  $textSize: string;
  $space: string;
  $iconSpacing: string;
};

const IconWrapper = styled.div<IconWrapperType>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  line-height: 0;
  color: ${(props) => props.$color};
  margin-right: ${(props) => props.$iconSpacing};
  cursor: pointer;

  &:hover {
    color: var(--main-blue);
  }
  .icon-size {
    font-size: ${(props) => props.$iconSize};
    margin-right: ${(props) => props.$space};
  }
  .text-size {
    font-size: ${(props) => props.$textSize};
    text-transform: capitalize;
  }
`;

const Icon = ({
  icon,
  text,
  color = 'var(--secondary-text-white)',
  iconSize = '1.8rem',
  textSize = '1.4rem',
  space = '0',
  iconSpacing = '1rem',
  className = '',
  openModal,
}: IconProps) => {
  return (
    <IconWrapper
      $color={color}
      $iconSize={iconSize}
      $textSize={textSize}
      $space={space}
      $iconSpacing={iconSpacing}
      className={className}
      onClick={() => openModal?.()}
    >
      <span className='icon-size'>{icon}</span>
      <span className='text-size'>{text}</span>
    </IconWrapper>
  );
};

export default Icon;
