export const generateDomainsList = (username, extensions) => {
  const domains = [];
  extensions.forEach((extension) => {
    domains.push(`${username}${extension}`);
  });
  return domains;
};

export const getExtensionFromDomainName = (host, domain) => {
  return domain.replace(host, "");
};
