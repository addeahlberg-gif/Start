/* Startportal: engangsmigrering fran v1 till v2.
   Den gamla datan raderas inte. Filen ska laddas fore app.js. */
(() => {
  'use strict';

  const OLD_KEY = 'startportal.cloudflare.v1';
  const NEW_KEY = 'startportal.cloudflare.v2';

  try {
    const oldRaw = localStorage.getItem(OLD_KEY);
    const newRaw = localStorage.getItem(NEW_KEY);

    if (!oldRaw) return;

    const oldData = JSON.parse(oldRaw);
    if (!oldData || !Array.isArray(oldData.categories) || !Array.isArray(oldData.links)) {
      console.warn('Startportal: v1-data hittades, men formatet kunde inte valideras.');
      return;
    }

    if (!newRaw) {
      localStorage.setItem(NEW_KEY, JSON.stringify(oldData));
      console.info('Startportal: kategorier och lankar migrerades fran v1 till v2.');
      return;
    }

    const newData = JSON.parse(newRaw);
    const oldHasUserData = oldData.categories.length > 0 || oldData.links.length > 0;
    const newLooksLikeDefaults =
      Array.isArray(newData?.categories) && newData.categories.length <= 2 &&
      Array.isArray(newData?.links) && newData.links.length <= 2;

    if (oldHasUserData && newLooksLikeDefaults) {
      const merged = {
        ...newData,
        ...oldData,
        feeds: Array.isArray(newData.feeds) && newData.feeds.length
          ? newData.feeds
          : oldData.feeds,
        place: newData.place || oldData.place || 'Härnösand'
      };
      localStorage.setItem(NEW_KEY, JSON.stringify(merged));
      console.info('Startportal: v1-data aterstalldes och nya v2-installningar beholls.');
    }
  } catch (error) {
    console.error('Startportal: migreringen misslyckades. Ingen gammal data raderades.', error);
  }
})();
