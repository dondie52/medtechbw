/**
 * Localisation scaffolding.
 *
 * MedLink must ship in English and Setswana. The architecture is set up here -
 * locale type, supported list, dictionary shape - but only the English
 * dictionary is populated. Emergency copy has to be translated by a fluent
 * Setswana speaker with clinical review; machine-translating "Awaiting dispatch
 * confirmation" or an allergy warning is not acceptable in this product.
 */
export type Locale = 'en' | 'tn';

export const SUPPORTED_LOCALES: ReadonlyArray<{
  code: Locale;
  englishName: string;
  nativeName: string;
  available: boolean;
}> = [
  { code: 'en', englishName: 'English', nativeName: 'English', available: true },
  { code: 'tn', englishName: 'Setswana', nativeName: 'Setswana', available: false },
];

export const DEFAULT_LOCALE: Locale = 'en';

/** Keys deliberately kept small: the strings a patient sees under stress. */
export interface Dictionary {
  sosLabel: string;
  sosSupportingLabel: string;
  holdInstruction: string;
  helpOnTheWay: string;
  callDispatch: string;
  contactFamily: string;
  cannotSpeak: string;
  cancelEmergency: string;
}

export const DICTIONARIES: Partial<Record<Locale, Dictionary>> = {
  en: {
    sosLabel: 'SOS',
    sosSupportingLabel: 'Get emergency help',
    holdInstruction: 'Press and hold for 2 seconds',
    helpOnTheWay: 'Help is on the way',
    callDispatch: 'Call dispatch',
    contactFamily: 'Contact family',
    cannotSpeak: "I can't speak",
    cancelEmergency: 'Cancel emergency',
  },
};
