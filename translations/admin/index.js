// This file can be used in both Server and Client Components

const translations = {
    en: () => import('./en.json').then((module) => module.default),
    de: () => import('./de.json').then((module) => module.default),
    nl: () => import('./nl.json').then((module) => module.default),
    ar: () => import('./ar.json').then((module) => module.default),
    fr: () => import('./fr.json').then((module) => module.default),
    es: () => import('./es.json').then((module) => module.default),
    it: () => import('./it.json').then((module) => module.default),
}

export const getTranslation = async (locale) => {
    try {
        if (translations[locale]) {
            return await translations[locale]();
        }
        return await translations['en']();
    } catch (error) {
        return await translations['en']();
    }
}