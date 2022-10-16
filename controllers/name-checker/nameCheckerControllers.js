export const checkNamesController = async (req, res) => {
  const { query } = req.params;
  const { body: data } = req;

  console.log(query);
  console.log(data.platforms);

  res.sendStatus(200);
};
