import Setting from './settingModel';
import * as factory from '../../utils/handlerFactory';

// No route define for this. This is to setup the settings.
export const saveSetting = factory.createOne({
  Model: Setting,
  label: 'settings',
});

export const getSetting = factory.getAll({ Model: Setting, label: 'settings' });
export const updateSetting = factory.updateOne({
  Model: Setting,
  label: 'setting',
});
