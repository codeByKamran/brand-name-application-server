import { axiosDefault } from "../../axios/index.js";
import env from "../../config/env.js";
import {
  domainsAPIEndpoint,
  goDaddyAPIEndpoint,
} from "../../lib/static/domains_check.js";
import { io } from "../../server.js";
import {
  generateDomainsList,
  getExtensionFromDomainName,
} from "../../utils/domain-checker/index.js";

export const checkDomainsController = async (req, res) => {
  const { query: username } = req.params;
  const { domains: extensions } = req.body;
  console.log("Username to check", username);
  console.log("Domains to check", extensions);

  axiosDefault
    .post(goDaddyAPIEndpoint, generateDomainsList(username, extensions), {
      headers: {
        Authorization: `sso-key ${env.GODADDY_API_KEY}:${env.GODADDY_SECRET}`,
      },
    })
    .then((response) => {
      console.log(response.data.domains);
      if (response.data.errors && response.data.errors.length > 0) {
        // errors occured for some domains

        const domains = [...response.data.domains, ...response.data.errors];

        // inserting extension to each result
        const result = domains.map((domain) => ({
          ...domain,
          extension: domain.replace(username, ""),
        }));

        res.status(200).json({ domains: result });
      } else {
        // all good to go
        res.status(200).json({ domains: response.data.domains });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
};
