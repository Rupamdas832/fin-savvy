import bcrypt from "bcrypt";

const saltRounds = 10;

export const hash = async (password: string): Promise<string> => {
  return new Promise((res, rej) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) rej(err);

      res(hash);
    });
  });
};

export const compare = async (userInput: string, userHash: string) => {
  return new Promise((res, rej) => {
    bcrypt.compare(userInput, userHash, function (err, result) {
      if (err) rej(err);

      res(result);
    });
  });
};
