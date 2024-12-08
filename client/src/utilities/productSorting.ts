export const sortParamsSetting = (e: React.ChangeEvent<HTMLSelectElement>) => {
  let sortValue;

  if (e.target.value.toLowerCase().startsWith('old')) {
    sortValue = 'createdAt';
  }
  if (e.target.value.toLowerCase().startsWith('new')) {
    sortValue = '-createdAt';
  }

  if (e.target.value.toLowerCase().startsWith('a-z: product')) {
    sortValue = 'product';
  }
  if (e.target.value.toLowerCase().startsWith('z-a: product')) {
    sortValue = '-product';
  }
  if (e.target.value.toLowerCase().startsWith('accending: price')) {
    sortValue = 'price';
  }
  if (e.target.value.toLowerCase().startsWith('decending: price')) {
    sortValue = '-price';
  }
  if (e.target.value.toLowerCase().startsWith('accending: price')) {
    sortValue = 'sellingPrice';
  }
  if (e.target.value.toLowerCase().startsWith('decending: price')) {
    sortValue = '-sellingPrice';
  }
  if (e.target.value.toLowerCase().startsWith('accending: quantity')) {
    sortValue = 'quantity';
  }
  if (e.target.value.toLowerCase().startsWith('decending: quantity')) {
    sortValue = '-quantity';
  }
  if (e.target.value.toLowerCase().startsWith('active')) {
    sortValue = true;
  }

  if (e.target.value.toLowerCase().startsWith('inactive')) {
    sortValue = false;
  }
  return sortValue;
};
