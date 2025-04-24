const express = require('express');
const multer = require('multer');
const fs = require('fs');
const s3 = require('./minioClient');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(cors());

app.post('/upload', upload.single('image'), async (req, res) => {
  const { name, description } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'Image file is required.' });

  const fileContent = fs.readFileSync(file.path);
  const fileKey = Date.now() + '-' + file.originalname;

  try {
    // Upload to MinIO
    await s3.putObject({
      Bucket: process.env.MINIO_BUCKET,
      Key: fileKey,
      Body: fileContent,
      ContentType: file.mimetype,
    }).promise();

    fs.unlinkSync(file.path); // clean up temp

    // Save metadata to DB
    const saved = await prisma.file.create({
      data: {
        name,
        description,
        imageUrl: fileKey,
      },
    });

    res.json({ message: 'Uploaded successfully', data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/files', async (req, res) => {
    try {
      const files = await prisma.file.findMany({
        orderBy: { createdAt: 'desc' },
      });
  
      const signedFiles = await Promise.all(
        files.map(async (file) => {
          // Generate a presigned URL from MinIO
          const url = await s3.getSignedUrlPromise('getObject', {
            Bucket: process.env.MINIO_BUCKET,
            Key: file.imageUrl,
            Expires: 60 * 60, // 1 hour
          });
  
          return {
            ...file,
            imageUrl: url,
          };
        })
      );
  
      res.json(signedFiles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch files' });
    }
  });
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
