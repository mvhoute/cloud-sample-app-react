import Client from "../Client.js";
import { takeUntil } from 'rxjs/operators';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';

let changeListeners = [];
let facts = initLanguageCodeObject();

let notifyChange = () => {
  changeListeners.forEach((listener) => {
    listener();
  });
}

let fetchFacts = (unsubscribeSubject, language, urlSlug) => {
  let query = Client.items()
    .type('about_us');

  if (language) {
    query.languageParameter(language);
  }

  if (urlSlug) {
    query.equalsFilter('elements.url_pattern', urlSlug);
  }

  query.getObservable()
    .pipe(takeUntil(unsubscribeSubject))
    .subscribe(response => {
      if (language) {
        facts[language] = response.items[0].facts;
      } else {
        facts[defaultLanguage] = response.items[0].facts;
      }
      notifyChange();
    });
}

class FactStore {

  // Actions

  provideFacts(unsubscribeSubject, language, urlSlug) {
    fetchFacts(unsubscribeSubject, language, urlSlug);
  }

  // Methods

  getFacts(language) {
    return facts[language];
  }

  // Listeners

  addChangeListener(listener) {
    changeListeners.push(listener);
  }

  removeChangeListener(listener) {
    changeListeners = changeListeners.filter((element) => {
      return element !== listener;
    });
  }
}

export default new FactStore();