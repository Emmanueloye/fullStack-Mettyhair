// import slugify from 'slugify';

// Accept number and format it.
export const formatNumber = (number: number) => {
  const nf = new Intl.NumberFormat();
  if (!number) return;

  return nf.format(number);
};

// convert strings to lower case and separate them by dash.
export const slugifyText = (str: string) => {
  const string = str.toLowerCase().split(' ').join('-');
  return string;
  // return slugify(str, { lower: true });
};

export const changeToCamelCase = (str: string) => {
  const words = str.split(' ');
  const camelCase = words
    .map((el, i) => {
      if (i === 0) {
        return el.toLowerCase();
      } else {
        return el.charAt(0).toUpperCase() + el.slice(1);
      }
    })
    .join('');

  return camelCase;
};

export const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const dateFormat = new Intl.DateTimeFormat('en-US', options);
  return dateFormat.format(date);
};
