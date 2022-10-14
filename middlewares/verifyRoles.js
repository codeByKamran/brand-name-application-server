const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      res.statusMessage = "Not authorized! limited permissions!";
      return res.sendStatus(401);
    } // unauthorized

    const rolesArray = [...allowedRoles];
    console.log("Route Allowed Roles", rolesArray);
    console.log("User Roles", req.roles);

    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);

    if (!result) {
      res.statusMessage = "Not authorized! limited permissions!";
      return res.sendStatus(401); // unauthorized
    } else {
      next(); // authorized
    }
  };
};

export default verifyRoles;
