import translations from '../translations.config';

/**
 * Pass a string to translate (if a translation exists).
 * 
 * Only Spanish is supported.
 * To add translations, edit the translation.config.js file.
 */
export const translate = ((translations = {}) => language => textToTranslate => {
  // We only support Spanish.
  if(language !== 'es'){
    return textToTranslate;
  }

  // Translations are case sensitive.
  const translatedText = translations[textToTranslate];

  // When a translation doesn't exist we fall back to the original english.
  return translatedText || textToTranslate;
})(translations);