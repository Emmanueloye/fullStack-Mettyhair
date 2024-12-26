export const slugifyInput = (str: string) => {
  return str.toLowerCase().split(' ').join('-');
};

export const capitalized = (str: string) => {
  const wordSplit = str.split(' ');
  return wordSplit
    .map((el: string) => el.charAt(0).toUpperCase() + el.slice(1))
    .join(' ');
};
