import Dataperser from 'datauri/parser.js';

export const getPathText = (str: string) => {
  return str.split('/').at(-1);
};

export const slugify = (str: string) => {
  return str.split(' ').join('-');
};

export const formatImageURI = (ext: string, buffer: any) => {
  const parser = new Dataperser();
  return parser.format(ext, buffer).content;
};
