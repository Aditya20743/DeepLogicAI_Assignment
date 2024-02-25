const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const cors = require('cors');
const { log } = require('console');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

process.env.PATH += ';C:/Program Files/Tesseract-OCR';


app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    const inputFilePath = path.join(__dirname, req.file.originalname);
    fs.writeFileSync(inputFilePath, req.file.buffer);
  
    console.log(`File Extension: ${path.extname(req.file.originalname)}`);
    console.log(`File Size: ${req.file.size} bytes`);
  
    const pythonProcess = spawn('python', ['main.py', inputFilePath]);
  
    let extractedText = '';
    let errorOccurred = false;
  
    pythonProcess.stdout.on('data', (data) => {
      extractedText += data.toString();
    });
  
    pythonProcess.stderr.on('data', (data) => {
      console.error(data.toString());
      errorOccurred = true;
    });
  
    pythonProcess.on('close', (code) => {
      if (code === 0 && !errorOccurred) {
        res.json({ data: extractedText });
      } else {
        console.log('Script execution failed');
        res.status(500).json({ error: 'Script execution failed' });
      }
    });
  });
  

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
