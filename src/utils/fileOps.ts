import fs from 'fs';
import path from 'path';

export const getFile = (filePath: string) => {
  const file = fs.readFileSync(path.resolve('.', filePath)).toString();
  return file;
};

export const setFile = (filePath: string, fileContents: string) => {
  try {
    fs.writeFileSync(filePath, fileContents);
  } catch (e) {
    console.error(e);
  }
};
