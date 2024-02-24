import fitz 
import pytesseract
import csv
from PIL import Image
import io
import os

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text_from_pdf_or_image(file_path):
    _, file_extension = os.path.splitext(file_path.lower())

    if file_extension == '.pdf':
        return extract_text_from_pdf(file_path)
    elif file_extension in ['.png', '.jpg', '.jpeg']:
        return extract_text_from_image(file_path)
    else:
        return "Unsupported file format"

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)

    text_output = ""
    myconfig = r"--psm 1 --oem 3"

    for page_number, page in enumerate(doc):
        text_page = page.get_text()

        if not text_page.strip():
            images = page.get_images(full=True)

            for img_index, img in enumerate(images):
                base_image = doc.extract_image(img[0])
                image_bytes = base_image["image"]

                pil_image = Image.open(io.BytesIO(image_bytes))

                image_text = pytesseract.image_to_string(pil_image, config=myconfig)

                text_output += f"OCR Result (Page {page_number + 1}, Image {img_index + 1}):\n{image_text}\n\n"

    doc.close()

    return text_output

def extract_text_from_image(image_path):
    image = Image.open(image_path)
    myconfig = r"--psm 1 --oem 3"
    text = pytesseract.image_to_string(image, config=myconfig)
    return text

file_path = 'data\\sample4.pdf'  # Replace with your file path
extracted_text = extract_text_from_pdf_or_image(file_path)

# print(extracted_text)

csv_file_path = 'output.csv'
lines = extracted_text.splitlines()

with open(csv_file_path, 'w', newline='', encoding='utf-8') as csv_file:
    csv_writer = csv.writer(csv_file)
    for line in lines:
        fields = [line]
        csv_writer.writerow(fields)

print(f'Data has been successfully stored in {csv_file_path}')
