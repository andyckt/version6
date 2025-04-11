import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { IncomingForm, File as FormidableFile } from 'formidable';
import { mkdir, stat } from 'fs/promises';

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types for images
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',  // iPhone images
  'image/heif',  // iPhone images
];

// Custom file type for our processed files
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  path: string;
  size: number;
  filename: string;
}

/**
 * Handle file upload for Next.js API routes using formidable
 */
export function withUpload(fieldName: string, maxCount = 1) {
  return async function handleUpload(request: NextRequest) {
    try {
      // Ensure temp directory exists
      const uploadDir = join(tmpdir(), 'bobe-uploads');
      try {
        await stat(uploadDir);
      } catch (e) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Get the form data using formidable
      const formData = await parseForm(request, uploadDir);
      
      // Get files from the form data
      const files: UploadedFile[] = [];
      
      // Process files from formidable format to our format
      if (formData.files[fieldName]) {
        const fileArray = Array.isArray(formData.files[fieldName]) 
          ? formData.files[fieldName] 
          : [formData.files[fieldName]];
          
        // Take only up to maxCount files
        const processableFiles = fileArray.slice(0, maxCount);
        
        for (const file of processableFiles) {
          // Check file size
          if (file.size > MAX_FILE_SIZE) {
            return {
              files: [],
              fields: formData.fields,
              error: `File ${file.originalFilename} exceeds the maximum size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
            };
          }

          // Check mime type
          if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype || '')) {
            return {
              files: [],
              fields: formData.fields,
              error: `File ${file.originalFilename} has unsupported type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
            };
          }

          // Add to our files array in the format we want
          files.push({
            fieldname: fieldName,
            originalname: file.originalFilename || 'unknown',
            encoding: 'utf-8',
            mimetype: file.mimetype || 'application/octet-stream',
            path: file.filepath,
            size: file.size,
            filename: file.newFilename || 'unknown',
          });
        }
      }
      
      return {
        files,
        fields: formData.fields,
      };
    } catch (error) {
      console.error('Error in file upload:', error);
      return {
        files: [],
        fields: {},
        error: error instanceof Error ? error.message : 'Unknown upload error',
      };
    }
  };
}

/**
 * Parse the form data from a NextRequest using formidable
 */
async function parseForm(req: NextRequest, uploadDir: string) {
  const form = new IncomingForm({
    multiples: true,
    keepExtensions: true,
    uploadDir,
    maxFileSize: MAX_FILE_SIZE,
  });

  // Convert NextRequest to ReadableStream and then to Blob for processing
  const formData = await req.formData();
  const files: Record<string, FormidableFile | FormidableFile[]> = {};
  const fields: Record<string, string> = {};

  // Process the formData entries
  for (const entry of Array.from(formData.entries())) {
    const [key, value] = entry;
    
    if (value instanceof File) {
      // Handle file entry
      const buffer = Buffer.from(await value.arrayBuffer());
      const filename = `${Date.now()}-${value.name}`;
      const filepath = join(uploadDir, filename);
      
      // Write the file to disk
      await fs.writeFile(filepath, buffer);
      
      // Create file entry in the format formidable would provide
      const file = {
        filepath,
        originalFilename: value.name,
        newFilename: filename,
        mimetype: value.type,
        size: value.size,
      } as FormidableFile;
      
      // Add to files object
      if (!files[key]) {
        files[key] = [];
      }
      
      if (Array.isArray(files[key])) {
        (files[key] as FormidableFile[]).push(file);
      } else {
        files[key] = [file];
      }
    } else {
      // Handle regular field
      fields[key] = value.toString();
    }
  }

  return { files, fields };
}

export default { withUpload }; 