import * as factory from '../../utils/handlerFactory';
import Country from './countryModel';
import State from './stateModel';
import City from './cityModel';

export const getCountries = factory.getAll({
  Model: Country,
  label: 'countries',
});

export const getStates = factory.getAll({
  Model: State,
  label: 'states',
});

export const getCities = factory.getAll({
  Model: City,
  label: 'cities',
});
