/* Michael's Foundations — Avatar Laboratory
   Character data lives here. Change identities without editing the renderer.
   Appearance is a proposed starting palette, not an ethnic identity assignment.
*/
export const characters = {
  AV01: { name: 'Anna', role: 'Warm host', gender: 'female', skinTone: 'fair', skin: '#e9b999', hair: '#76513f', shirt: '#7b4568', hairStyle: 'long', personality: 'welcoming', voiceLanguage: 'ru-RU' },
  AV02: { name: 'Dmitri', role: 'Friendly father', gender: 'male', skinTone: 'light olive', skin: '#c99b73', hair: '#342a2a', shirt: '#385a7a', hairStyle: 'short', personality: 'humorous', voiceLanguage: 'ru-RU' },
  AV03: { name: 'Amina', role: 'Curious guest', gender: 'female', skinTone: 'medium brown', skin: '#aa704e', hair: '#28212a', shirt: '#3b786c', hairStyle: 'curly', personality: 'energetic', voiceLanguage: 'ru-RU' },
  AV04: { name: 'Timur', role: 'Helpful cook', gender: 'male', skinTone: 'warm tan', skin: '#c58a5c', hair: '#211e24', shirt: '#80603f', hairStyle: 'short', personality: 'patient', voiceLanguage: 'ru-RU' },
  AV05: { name: 'Elena', role: 'Grandmother', gender: 'female', skinTone: 'fair', skin: '#e1b49d', hair: '#bfc4cb', shirt: '#805479', hairStyle: 'long', personality: 'affectionate', voiceLanguage: 'ru-RU' },
  AV06: { name: 'Ruslan', role: 'Sociable relative', gender: 'male', skinTone: 'deep brown', skin: '#70432f', hair: '#1e1b20', shirt: '#5d687e', hairStyle: 'short', personality: 'sociable', voiceLanguage: 'ru-RU' },
  AV07: { name: 'Sofia', role: 'Travel companion', gender: 'female', skinTone: 'golden brown', skin: '#b77e4e', hair: '#332522', shirt: '#9b5550', hairStyle: 'curly', personality: 'curious', voiceLanguage: 'ru-RU' }
};

export const scenarios = {
  familyDinner: { title: 'Family Dinner', participants: ['AV01', 'AV02', 'AV05'] },
  planningDinner: { title: 'Planning Dinner', participants: ['AV01', 'AV03', 'AV04'] },
  groceryShopping: { title: 'Grocery Shopping', participants: ['AV03', 'AV04'] },
  cookingTogether: { title: 'Cooking Together', participants: ['AV01', 'AV04'] },
  familyPicnic: { title: 'Family Picnic', participants: ['AV02', 'AV03', 'AV06'] },
  visitingRelatives: { title: 'Visiting Relatives', participants: ['AV05', 'AV06'] },
  vacationRestaurant: { title: 'Vacation Restaurant', participants: ['AV07', 'AV06'] }
};

export function getCharacter(id) {
  return characters[id] ?? null;
}

export function getScenarioCharacters(scenarioId) {
  return (scenarios[scenarioId]?.participants ?? []).map(getCharacter).filter(Boolean);
}
