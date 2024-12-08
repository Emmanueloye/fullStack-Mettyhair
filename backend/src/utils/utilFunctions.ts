export const getPathText = (str: string) => {
  return str.split('/').at(-1);
};

export const slugify = (str: string) => {
  return str.split(' ').join('-');
};
