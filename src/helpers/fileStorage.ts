const FileType = import('file-type');
import fs from 'fs';
import Logging from 'library/Logging';
import { diskStorage, Options } from 'multer';
import { extname } from 'path';

type validFileExtensionsType = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtensionsType[] = ['png', 'jpeg', 'jpg'];
const validMimeTypes: validMimeType[] = [
  'image/jpeg',
  'image/jpg',
  'image/png',
];

export const saveAssignmentFile: Options = {
  storage: diskStorage({
    destination: './files/assignments',
    filename(req, file, callback) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;

      callback(null, filename);
    },
  }),
  fileFilter(req, file, callback) {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype as validMimeType)
      ? callback(null, true)
      : callback(null, false);
  },
};

export const saveSubmissionFile: Options = {
  storage: diskStorage({
    destination: './files/submissions',
    filename(req, file, callback) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;

      callback(null, filename);
    },
  }),
  fileFilter(req, file, callback) {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype as validMimeType)
      ? callback(null, true)
      : callback(null, false);
  },
};

export const isFileExtensionSafe = async (
  fullFilePath: string,
): Promise<boolean> => {
  return (await FileType)
    .fileTypeFromFile(fullFilePath)
    .then((fileExtensionAndMimeType) => {
      if (!fileExtensionAndMimeType?.ext) return false;

      const isFileTypeLegit = validFileExtensions.includes(
        fileExtensionAndMimeType.ext as validFileExtensionsType,
      );
      const isMimeTypeLegit = validMimeTypes.includes(
        fileExtensionAndMimeType.mime as validMimeType,
      );
      const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
      return isFileLegit;
    });
};

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (error) {
    Logging.error(error);
  }
};
