import { google } from 'googleapis';
import { Readable } from 'stream';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || '{}'),
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

export async function uploadToGoogleDrive(files: File[], folderUrl: string): Promise<string[]> {
  const folderId = folderUrl.split('/').pop();
  if (!folderId) throw new Error('Invalid folder URL');

  const uploadPromises = files.map(async (file) => {
    const buffer = await file.arrayBuffer();
    const stream = new Readable();
    stream.push(Buffer.from(buffer));
    stream.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [folderId],
      },
      media: {
        body: stream,
      },
    });

    return `https://drive.google.com/uc?id=${response.data.id}`;
  });

  return Promise.all(uploadPromises);
}

export async function deleteFromGoogleDrive(fileUrl: string): Promise<void> {
  const fileId = fileUrl.split('id=').pop();
  if (!fileId) throw new Error('Invalid file URL');

  await drive.files.delete({ fileId });
}
