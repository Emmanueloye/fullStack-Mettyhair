import { Helmet } from 'react-helmet-async';

const HelmetSEO = ({
  title,
  description,
  name,
  type,
  // url,
  // image,
  keyword,
}: {
  title: string;
  description: string;
  name: string;
  type: string;
  keyword: string;
  // url?: string;
  // image?: string;
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keyword} />
      {/* Facebook tags */}
      <meta property='og:type' content={type} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      {/* <meta property='og:url' content={url} />
      <meta property='og:image' content={image} /> */}

      {/* Twitter tags */}
      <meta name='twitter:creator' content={name} />
      <meta name='twitter:card' content={type} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      {/* <meta name='twitter:image' content={image} /> */}
    </Helmet>
  );
};

export default HelmetSEO;
