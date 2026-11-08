/*
 * Michael's Foundations — Character Registry
 * One character record for each of the seven Conversation Gallery scenarios.
 * Portraits and spoken content are kept separate from page navigation.
 */

export const characters = {
    AV01: {"id": "AV01", "name": "Anna", "portrait": "anna-portrait.png", "scenario": "anna", "voiceLanguage": "ru-RU"},
    AV02: {"id": "AV02", "name": "Dmitri", "portrait": "dmitri-portrait.png", "scenario": "dmitri", "voiceLanguage": "ru-RU"},
    AV03: {"id": "AV03", "name": "Amina", "portrait": "amina-portrait.png", "scenario": "amina", "voiceLanguage": "ru-RU"},
    AV04: {"id": "AV04", "name": "Timur", "portrait": "timur-portrait.png", "scenario": "timur", "voiceLanguage": "ru-RU"},
    AV06: {"id": "AV06", "name": "Ruslan", "portrait": "ruslan-portrait.png", "scenario": "ruslan", "voiceLanguage": "ru-RU"},
    AV05: {"id": "AV05", "name": "Elena", "portrait": "elena-portrait.png", "scenario": "elena", "voiceLanguage": "ru-RU"},
    AV07: {"id": "AV07", "name": "Sofia", "portrait": "sofia-portrait.png", "scenario": "sofia", "voiceLanguage": "ru-RU"}
};

export function getCharacter(id) {
    return characters[id] ?? null;
}
