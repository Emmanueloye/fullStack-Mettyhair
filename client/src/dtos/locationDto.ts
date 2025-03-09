export type CountryType = {
  _id: string;
  country: string;
  countryCode: string;
  countryId: number;
  createdAt: Date;
};

export type StateType = {
  _id: string;
  state: string;
  stateId: number;
  countryId: number;
  createdAt: Date;
};

export type CityType = {
  _id: string;
  city: string;
  cityId: number;
  stateId: number;
  countryId: number;
};
