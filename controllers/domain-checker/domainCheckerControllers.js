import { io } from "../../server.js";

export const checkDomainsController = async (req, res) => {
  const { query: username } = req.params;
  const { domains } = req.body;
  console.log("Username to check", username);
  console.log("Domains to check", domains);

  res.sendStatus(200);
};
