import SpellChecker from "simple-spellchecker";

export const spellCheckerController = async (req, res) => {
  const words = req.body;
  console.log({ words });

  SpellChecker.getDictionary("en-US", function (err, dictionary) {
    if (!err) {
      let result = [];
      words.forEach((word) => {
        let misspelled = !dictionary.spellCheck(word);
        if (misspelled) {
          let suggestions = dictionary.getSuggestions(word);
          console.log(word, suggestions);
          if (suggestions.length > 0) {
            result.push(suggestions[0]);
          }
        } else {
          result.push(word);
        }
      });
      res.status(200).json({ words: result });
    }
  });
};
