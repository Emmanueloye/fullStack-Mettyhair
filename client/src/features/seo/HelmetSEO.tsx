import { Helmet } from 'react-helmet-async';

const HelmetSEO = ({
  title,
  description,
  name,
  type,
  url,
  image,
}: {
  title: string;
  description: string;
  name: string;
  type: string;
  url?: string;
  image?: string;
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <link rel='image_src' href={image} />
      {/* Facebook tags */}
      <meta property='og:type' content={type} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={url} />
      <meta property='og:image' content={image} />

      {/* Twitter tags */}
      <meta name='twitter:creator' content={name} />
      <meta name='twitter:card' content={type} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />
    </Helmet>
  );
};

export default HelmetSEO;
