import csv
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

image = Image.open('data\\sample1.png')

myconfig = r"--psm 1 --oem 3"

text = pytesseract.image_to_string(image,config=myconfig)

lines = text.splitlines()

csv_file_path = 'output.csv'

with open(csv_file_path, 'w', newline='', encoding='utf-8') as csv_file:
   
    csv_writer = csv.writer(csv_file)

    
    for line in lines:
        
        fields = [line]
        
        csv_writer.writerow(fields)

print(f'Data has been successfully stored in {csv_file_path}')

# print(text)
