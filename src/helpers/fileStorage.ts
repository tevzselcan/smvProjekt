import { User } from 'entities/user.entity';
import fs from 'fs';
import Logging from 'library/Logging';
import { diskStorage, Options } from 'multer';
import { extname } from 'path';

export const saveAssignmentFile: Options = {
  storage: diskStorage({
    destination: './files/assignments',
    filename(req, file, callback) {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${uniqueName}${ext}`;
      callback(null, filename);
    },
  }),
};

export const saveSubmissionFile: Options = {
  storage: diskStorage({
    destination: './files/submissions',
    filename(req, file, callback) {
      const user: User = req['user'];
      const uniqueNameSpecial = `${user.last_name}-${user.first_name}`;
      const uniqueName = uniqueNameSpecial.replace(/[^a-zA-Z0-9-]/g, '');
      //const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${uniqueName}${ext}`;
      callback(null, filename);
    },
  }),
};

export const isFileExtensionSafe = (fullFilePath: string): boolean => {
  const ext = extname(fullFilePath).substring(1);
  const validFileExtensions = ['png', 'jpeg', 'jpg', 'docx', 'pdf'];
  return validFileExtensions.includes(ext.toLocaleLowerCase());
};

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (error) {
    Logging.error(error);
  }
};
