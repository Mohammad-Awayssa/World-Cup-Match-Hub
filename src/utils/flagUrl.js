const specialCodes = {
  'gb-eng': 'https://flagcdn.com/w80/gb-eng.png',
  'gb-sct': 'https://flagcdn.com/w80/gb-sct.png',
};

export const getFlagUrl = (code, size = 80) => {
  if (!code) return null;
  if (specialCodes[code]) return specialCodes[code].replace('w80', `w${size}`);
  return `https://flagcdn.com/w${size}/${code}.png`;
};
