import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from '../core/error.response';

export interface UploadConfig {
  maxFileSize: number;
  allowedMimeTypes: string[];
  destination: string;
  fileFieldName: string;
  maxFiles?: number;
}

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export const uploadConfigs = {
  // Config cho upload ảnh
  image: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    destination: 'uploads/images',
    fileFieldName: 'image'
  } as UploadConfig,

  // Config cho upload document
  document: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    destination: 'uploads/documents',
    fileFieldName: 'document'
  } as UploadConfig,

  // Config cho upload avatar
  avatar: {
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    destination: 'uploads/avatars',
    fileFieldName: 'avatar'
  } as UploadConfig,

  // Config cho multiple files
  gallery: {
    maxFileSize: 5 * 1024 * 1024, // 5MB per file
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    destination: 'uploads/gallery',
    fileFieldName: 'images',
    maxFiles: 10
  } as UploadConfig
};

class UploadMiddleware {
  private createStorage(config: UploadConfig) {
    return multer.diskStorage({
      destination: (_req: Request, _file: Express.Multer.File, cb) => {
        const uploadPath = config.destination;

        // Tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      },
      filename: (_req: Request, file: Express.Multer.File, cb) => {
        // Tạo tên file unique với UUID + timestamp
        const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      }
    });
  }

  private createFileFilter(config: UploadConfig) {
    return (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
      if (config.allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        const error = new BadRequestError(`Invalid file type. Allowed types: ${config.allowedMimeTypes.join(', ')}`);
        cb(error);
      }
    };
  }

  // Tạo multer instance
  private createMulter(config: UploadConfig) {
    return multer({
      storage: this.createStorage(config),
      fileFilter: this.createFileFilter(config),
      limits: {
        fileSize: config.maxFileSize,
        files: config.maxFiles || 1
      }
    });
  }

  // Upload single file
  public single(config: UploadConfig) {
    const upload = this.createMulter(config);
    return upload.single(config.fileFieldName);
  }

  // Upload multiple files (same field)
  public array(config: UploadConfig) {
    const upload = this.createMulter(config);
    return upload.array(config.fileFieldName, config.maxFiles || 10);
  }

  // Upload multiple files (different fields)
  public fields(configs: { name: string; maxCount: number; config: UploadConfig }[]) {
    const firstConfig = configs[0].config;
    const upload = this.createMulter(firstConfig);

    const fields = configs.map((item) => ({
      name: item.name,
      maxCount: item.maxCount
    }));

    return upload.fields(fields);
  }

  // Upload với memory storage (không lưu file)
  public memory(config: UploadConfig) {
    const upload = multer({
      storage: multer.memoryStorage(),
      fileFilter: this.createFileFilter(config),
      limits: {
        fileSize: config.maxFileSize,
        files: config.maxFiles || 1
      }
    });
    return upload.single(config.fileFieldName);
  }

  // Upload multiple files với memory storage
  public memoryArray(config: UploadConfig) {
    const upload = multer({
      storage: multer.memoryStorage(),
      fileFilter: this.createFileFilter(config),
      limits: {
        fileSize: config.maxFileSize,
        files: config.maxFiles || 10
      }
    });
    return upload.array(config.fileFieldName, config.maxFiles || 10);
  }

  // Upload multiple fields với memory storage
  public memoryFields(configs: { name: string; maxCount: number; config: UploadConfig }[]) {
    const firstConfig = configs[0].config;
    const upload = multer({
      storage: multer.memoryStorage(),
      fileFilter: this.createFileFilter(firstConfig),
      limits: {
        fileSize: firstConfig.maxFileSize,
        files: configs.reduce((total, item) => total + item.maxCount, 0)
      }
    });

    const fields = configs.map((item) => ({
      name: item.name,
      maxCount: item.maxCount
    }));

    return upload.fields(fields);
  }
}

export const uploadMiddleware = new UploadMiddleware();
