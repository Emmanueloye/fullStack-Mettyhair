import { Helmet } from 'react-helmet-async';

const HelmetSEO = ({
  title,
  description,
}: // name,
// type,
{
  title: string;
  description: string;
  name?: string;
  type?: string;
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta property='og:type' />
    </Helmet>
  );
};

export default HelmetSEO;
