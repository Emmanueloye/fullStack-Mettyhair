export const slugifyInput = (str: string) => {
  return str.toLowerCase().split(' ').join('-');
};
