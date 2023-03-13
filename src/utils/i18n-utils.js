/**
 * This source file is part of the Swift.org open source project
 *
 * Copyright (c) 2023 Apple Inc. and the Swift project authors
 * Licensed under Apache License v2.0 with Runtime Library Exception
 *
 * See https://swift.org/LICENSE.txt for license information
 * See https://swift.org/CONTRIBUTORS.txt for Swift project authors
*/

import appLocales from 'theme/lang/locales.json';
import { defaultLocale } from 'theme/lang/index.js';
import { updateLangTag } from 'docc-render/utils/metadata';

const localeCodes = new Set(appLocales.map(appLocale => appLocale.code));

/**
 * Check if locale is valid
 * @param {String} localeCode - locale code
 * @param {{ code: String }[]} locales - locales available
 */
export function localeIsValid(localeCode) {
  return localeCodes.has(localeCode);
}

// If possible, map abbreviated country codes to the full code for its
// corresponding locale.
// Otherwise, return the unmodified code
//
// This allows the abbreviated country code to be used as a parameter in the
// URL to refer to a more specific locale.
//
// examples:
// getSanitizedLocaleCode('zh-CN') => 'zh-CN'
// getSanitizedLocaleCode('cn') => 'zh-CN'
// getSanitizedLocaleCode('foobar') => 'foobar'
function getSanitizedLocaleCode(code) {
  // this may fail if we ever support a locale without a language subtag due
  // to the reliance on the hyphen separator
  const getCountry = locale => locale.code.toLowerCase().split('-')[1];
  return appLocales.reduce((sanitized, locale) => (
    code.toLowerCase() === getCountry(locale).toLowerCase()
      ? locale.code
      : code
  ), code);
}

/**
 * Updates i18n global var and html lang
 * @param {{ params: { locale: String } }} to - where the route navigates to
 * @param {Object{}} env - context
 * @param {{ code: String, name: String }[]} locales
 */
export function updateCurrentLocale(to, env) {
  const currentLocale = getSanitizedLocaleCode(to.params.locale || defaultLocale);
  // exist if current locale is not supported
  if (!localeIsValid(currentLocale)) return;
  // update locale global var
  env.$i18n.locale = currentLocale; // eslint-disable-line no-param-reassign
  // update html lang
  updateLangTag(currentLocale);
}
