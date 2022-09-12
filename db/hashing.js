const bcrypt = require("bcrypt");

const passwordHash = async (password, saltRounds) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);

    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    console.log(err);
  }
  return null;
};

const comparePasswords = async (password, hash) => {
  try {
    const matchFound = bcrypt.compare(password, hash);
    return matchFound;
  } catch (err) {
    console.log(err);
  }
  return false;
};

module.exports = { passwordHash, comparePasswords };
