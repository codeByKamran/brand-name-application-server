import { axiosDefault } from "../../axios/index.js";
import env from "../../config/env.js";
import { goDaddyAPIEndpoint } from "../../lib/static/domains_check.js";
import { generateDomainsList } from "../../utils/domain-checker/index.js";
import { chunkifyArray } from "../../utils/utilities.js";

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

export const filterByDomainAvailabilityController = async (req, res) => {
  const { names, extensions } = req.body;
  console.log("Query Names", names);
  console.log("Query Domain Extensions", extensions);

  let domains = [];
  extensions.forEach((ext, i) => {
    let domainsTemp = names.map((word) => {
      let hostname = word;
      let extension = ext;
      return hostname + extension;
    });
    domains = domains.concat(domainsTemp);
  });

  const chunkedDomains = chunkifyArray(domains, 500);

  try {
    const headers = {
      Authorization: `sso-key ${env.GODADDY_API_KEY}:${env.GODADDY_SECRET}`,
    };

    const response = await Promise.allSettled(
      chunkedDomains.map((domainSet) =>
        axiosDefault.post(goDaddyAPIEndpoint, domainSet, {
          headers,
        })
      )
    );

    let completeData = [];

    for (let i = 0; i < chunkedDomains.length; i++) {
      let resultTemp = response[i].value.data;
      let resultFinal = [];
      if (resultTemp?.errors && resultTemp?.errors.length > 0) {
        // error for some domains
        resultFinal = resultTemp?.domains; // [...resultTemp.errors, ...resultTemp?.domains];
      } else {
        resultFinal = resultTemp?.domains;
      }
      completeData = completeData.concat(resultFinal);
    }

    let finalResult = [];
    names.forEach((name, i) => {
      const wordDomains = completeData.filter(({ domain }) =>
        String(domain).includes(name)
      );

      let nameNameResult = {};

      wordDomains.forEach((nameDomain) => {
        nameNameResult = {
          ...nameNameResult,
          name,
          show: nameDomain.available ? true : false,
          result: wordDomains,
        };
      });

      finalResult = finalResult.concat([nameNameResult]);
    });
    res.status(200).json(finalResult);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
