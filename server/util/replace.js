export const replaceChar = (str, target, value) => {
  let newStrign = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === target) {
      newStrign = newStrign + value;
    } else {
      newStrign = newStrign + str[i];
    }
  }
  return newStrign;
};
