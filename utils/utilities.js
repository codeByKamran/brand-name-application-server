export const chunkifyArray = (array, chunkSize = 1) => {
  if (!Array.isArray(array)) {
    throw new TypeError(
      "Input of type array expected, got " + typeof arr + " instead"
    );
  }
  let result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
};
