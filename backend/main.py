

from flask import Flask, request, jsonify
from serpapi import GoogleScholarSearch
import requests
import os
from bs4 import BeautifulSoup
from transformers import pipeline
import nltk
import fitz
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
import base64

app = Flask(__name__)

def extract_methodology(text, keywords):
  # sentences = text.split(".")  # Split into sentences (replace with proper tokenization)
  method_sentences = []
  current_methodology = False  # Flag to track methodology context

  for sentence in text:
    processed_sentence = sentence.lower().strip()
    if any(keyword in processed_sentence for keyword in keywords):
      current_methodology = True
      method_sentences.append(sentence)
    elif current_methodology:  # Only include surrounding sentences if in methodology context
      method_sentences.append(sentence)
      # Limit including surrounding sentences to a window of 2 (adjust as needed)
      if len(method_sentences) - 1 >= 2:
        current_methodology = False  # Exit methodology context after 2 surrounding sentences
  return method_sentences


def is_pdf_url(url):
  """Checks if a URL likely points to a PDF file using a HEAD request.
  try:
    response = requests.head(url)
    response.raise_for_status()  # Raise an exception for non-2xx status codes
    content_type = response.headers.get("Content-Type", "").lower()
    return content_type == "application/pdf"
  except requests.exceptions.RequestException as e:
    print(f"Error checking URL: {e}")
    return False """
  
  lower_url = url.lower()
  return lower_url.endswith(".pdf")

#-------------------------------------------------------------------------------------------------------------------------------------------


@app.route('/process_data', methods=['POST'])
def index1():
  input_data = request.get_json()
  GoogleScholarSearch.SERP_API_KEY = "bd8c69ff377583d0cddf7004fac543cac3bb60cbd250381b4dfbcb4355bddc25"
  page = input_data['page']*10 - 10
  # Process the input data using your Python code
  #processed_data = {"output": "Hello from Python! " + input_data["name"]}
  search = GoogleScholarSearch({"q": input_data["name"], "start": page, "serp_api_key": "f16ae244415e1e24abd8c69ff377583d0cddf7004fac543cac3bb60cbd250381b4dfbcb4355bddc25  "})
  data = search.get_dict()
  pdf_links = {}
  html_links = {}
 # no = 1
  print(data)
  for record in data["organic_results"]:
    if record.get("resources") is not None:
        if record["resources"][0]["file_format"] == "PDF":
            pdf_links[record.get("title", "No title")] = record['resources'][0]['link']#record["link"]
        else:
           html_links[record.get("title","No title")] = record['link']
    else:
       html_links[record.get("title","No title")] = record.get('link')
            #break # Only add the first PDF link
  # print(pdf_links)
  # print(html_links)
  response = jsonify({
        "pdf_links": pdf_links,
        "html_links": html_links
    })
  response.headers['Access-Control-Allow-Origin'] = '*'
  return response


#-------------------------------------------------------------------------------------------------------------------------------------------

@app.route("/")
def index2():
    return "Loading Research Assistant app..."


#--------------------------------------------------------------------------------------------------------------------

@app.route('/process_summary', methods=['POST'])
def index3():
  print('in summary')
  input_data = request.get_json()
  header = {
    "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="99", "Microsoft Edge";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "Windows",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/99.0.1150.30"
}
  print(input_data)
  url = input_data['name']
  #if is_pdf_url(url):
  get = requests.get(url,headers=header)
  print(get.status_code)
  if get.status_code == 200:
      pdf_file_name = input_data['title'].replace('?','_').replace(' ','_').replace('\'','_').replace(':','_').replace('\\','_').replace('/','_')
      pdf_file_name = pdf_file_name.replace(' ','_')
      print(pdf_file_name)
      paragraph = 'downloaded' + input_data['title']
      # Save in current working directory
      folder_path = os.path.join(os.getcwd(), "pdfs_folder")
# Check if the folder exists, create it if not
      if not os.path.exists(folder_path):
        os.makedirs(folder_path)
# Create the full path for the PDF file within the folder
      filepath = os.path.join(folder_path, pdf_file_name+'.pdf')
  #filepath = os.path.join(os.getcwd(), pdf_file_name)
      with open(filepath, 'wb') as pdf_object:
        pdf_object.write(get.content)
      # nltk.download('punkt')

      try:
          doc = fitz.open(filepath)
          # Process the PDF document using doc object
          print("PDF opened successfully!")
      except fitz.FileDataError as e:
          print(f"Error opening PDF: {e}")
          # Handle the error gracefully (e.g., log the error, display a message to the user)
          paragraph = "PDF not in readable format"
          processed_data = {"output": paragraph}  #"Hello from Python! " + str(get.status_code) 

          return jsonify(processed_data)

      doc = fitz.open(filepath)
      file1 = open('pdftotext.txt','w',encoding='utf-8')
      for page in doc:
          text=page.get_text()
          file1.write(text)
      file1.close()
      file1 = open('pdftotext.txt','r',encoding='utf-8')
      with open("pdftotext.txt", "r") as f:
          lines = file1.read()
      
      word2 = 'REFERENCES'
      flag = 0
      file2 = open('methodology.txt','w',encoding='utf-8')
      for line in lines:
          # copy = line.lower()
          index2 = line.find(word2)
          line = line.replace('\n', ' ')
          line = line.replace('.','.\n')
          if index2!=-1:
              break
          else:
              file2.writelines(line)
          
      file2.close()
      file2=open('methodology.txt','r',encoding='utf-8')
      text = file2.read()
      
      text = text.split(".")  # Split into sentences (replace with proper tokenization)

      chunks = [
            " ".join(text[i:i + 3]) for i in range(0, len(text), 3)
        ]
      #print(chunks)

      sentences = []
      for text in chunks:
        print(text)
        sentence = summarizer(text, max_length=150, min_length=30, do_sample=False)[0]["summary_text"].lstrip().capitalize()
        #print(sentence)
        #print('-----------------------------------------------------------------------------------------------')
        sentences.append(sentence)
      #print(sentences)
      
      print("SUMMARY OVER")
      final_summary = sentences
      while len(final_summary)>=18:
        print('combined summaries')
        summaries = []
        current_summary = []
        for sentence in final_summary:
          current_summary.append(sentence)
          if len(current_summary) ==2:
            summary = summarizer(" ".join(current_summary), max_length=70, min_length=30, do_sample=False)[0]["summary_text"].lstrip().capitalize()
            #print(summary)
            summaries.append(summary)
            current_summary = []
        # Handle remaining sentences (less than 3)
        if current_summary:
          summary = summarizer(" ".join(current_summary), max_length=70, min_length=30, do_sample=False)[0]["summary_text"].lstrip().capitalize()
          summaries.append(summary)
        final_summary = summaries#' '.join([elem for elem in summaries])
      
      paragraph = ' '.join([elem for elem in final_summary])
      print('final summary')
      print(final_summary) 
      if not final_summary:
        paragraph = 'pdf not readable'

  else:
    paragraph = "PDF can't be accessed please use the resource link"
  # else:
  #   paragraph = "PDF unavailable link is not pdf "
  processed_data = {"output": paragraph}  #"Hello from Python! " + str(get.status_code) 

  return jsonify(processed_data)



#------------------------------------------------------------------------------------------------------------



@app.route('/process_methodology', methods=['POST'])
def index4():
  input_data = request.get_json()
  header = {
    "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="99", "Microsoft Edge";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "Windows",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.30"
}
  url = input_data['name']
  get = requests.get(url,headers=header)
  if get.status_code == 200:
      pdf_file_name = input_data['title'].replace('?','_').replace(' ','_').replace('\'','_').replace(':','_').replace('\\','_').replace('/','_')
      print(pdf_file_name)
      # Save in current working directory
      folder_path = os.path.join(os.getcwd(), "pdfs_folder")
# Check if the folder exists, create it if not
      if not os.path.exists(folder_path):
        os.makedirs(folder_path)
# Create the full path for the PDF file within the folder
      filepath = os.path.join(folder_path, pdf_file_name+'.pdf')
  #filepath = os.path.join(os.getcwd(), pdf_file_name)
      with open(filepath, 'wb') as pdf_object:
        pdf_object.write(get.content)
      # nltk.download('punkt')


      try:
          doc = fitz.open(filepath)
          # Process the PDF document using doc object
          print("PDF opened successfully!")
      except fitz.FileDataError as e:
          print(f"Error opening PDF: {e}")
          # Handle the error gracefully (e.g., log the error, display a message to the user)
          paragraph = "PDF not in readable format"
          processed_data = {"output": paragraph}  #"Hello from Python! " + str(get.status_code) 

          return jsonify(processed_data)

      doc = fitz.open(filepath)
      file1 = open('pdftotext.txt','w',encoding='utf-8')
      for page in doc:
          text=page.get_text()
          file1.writelines(text)
      file1.close()
      file1 = open('pdftotext.txt','r',encoding='utf-8')
      with open("pdftotext.txt", "r") as f:
          lines = file1.read()
      
      word2 = 'REFERENCES'
      flag = 0
      file2 = open('methodology.txt','w',encoding='utf-8')
      for line in lines:
          # copy = line.lower()
          index2 = line.find(word2)
          line = line.replace('\n', ' ')
          line = line.replace('.','.\n')
          if index2!=-1:
              break
          else:
              file2.writelines(line)
          
      file2.close()
      file2=open('methodology.txt','r',encoding='utf-8')
      text = file2.read()
      
      text = text.split(".") 
      
      keywords = ['mechanism',"methods", "methodology", "experimental design", "software", "analysis","technique","design","system","model",'approach',
            'approaches','steps','metrics','modeling','material','equation','laboratory','technology','measurement','examination','computation',
            'theory','metrics','procedure','algorithm','estimation','concepts','scientific','statistical','tool','execution','performance','function',
            'action', 'control', 'mechanics', 'approach', 'solution', 'reasoning', 'formulation','methodologies','techniques','example','determine','analyze','perform','measure']

#keywords = ['mechanism',"methods", "methodology", "experimental design", "software", "analysis","technique","design","system","model",'approach','approaches','steps','metrics','modeling','material','equation']

      methodology_sentences = extract_methodology(text, keywords)
      output = ''
      file3 = open('methodsumm.txt','w',encoding='utf-8')
      for sent in methodology_sentences:
          output+=sent
          file3.writelines(sent)
      #print(output)
      file3.close()
      file3 = open('methodsumm.txt','r',encoding='utf-8')
      text = file3.readlines()
      # text = text.split(".")  # Split into sentences (replace with proper tokenization)
      print(len(text))
      print(len(text))
# output = output.replace('\n', '')
      chunks = [
            " ".join(text[i:i + 3]) for i in range(0, len(text), 3)
        ]
      #print(chunks)

      sentences = []
      for text in chunks:
        print(text)
        sentence = summarizer(text, max_length=150, min_length=30, do_sample=False)[0]["summary_text"].lstrip().capitalize()
        #print(sentence)
        #print('-----------------------------------------------------------------------------------------------')
        sentences.append(sentence)
      #print(sentences)
      
      print("SUMMARY OVER")
      final_summary = sentences
      while len(final_summary)>=18:
        print('combined summaries')
        summaries = []
        current_summary = []
        for sentence in final_summary:
          current_summary.append(sentence)
          if len(current_summary) ==5:
            summary = summarizer(" ".join(current_summary), max_length=70, min_length=30, do_sample=False)[0]["summary_text"].lstrip().capitalize()
            #print(summary)
            summaries.append(summary)
            current_summary = []
        # Handle remaining sentences (less than 3)
        if current_summary:
          summary = summarizer(" ".join(current_summary), max_length=70, min_length=30, do_sample=False)[0]["summary_text"].lstrip().capitalize()
          summaries.append(summary)
        final_summary = summaries#' '.join([elem for elem in summaries])
      
      paragraph = ' '.join([elem for elem in final_summary])
      print('final summary')
      print(final_summary) 
      if not final_summary:
        paragraph = 'pdf not readable'

      

      paragraph = final_summary
  else:
    paragraph = "PDF can't be accessed please use the resource link"
  processed_data = {"output": paragraph}  #"Hello from Python! " + str(get.status_code) 

  return jsonify(processed_data)

#---------------------------------------------------------------------------------------------------------
@app.route('/process_images', methods=['POST'])
def index5():
  print('in images')
  input_data = request.get_json()
  header = {
    "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="99", "Microsoft Edge";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "Windows",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.30"
  }
  url = input_data['name']
  print(url)
  get = requests.get(url, headers=header, verify=False)
  if get.status_code == 200:
    pdf_file_name = input_data['title']+'.pdf'
    pdf_file_name = pdf_file_name.replace(' ','_').replace('?','_').replace('\'','_').replace(':','_').replace('\\','_').replace('/','_')
    # Save in current working directory
    folder_path = os.path.join(os.getcwd(), "pdfs_folder")
    # Check if the folder exists, create it if not
    if not os.path.exists(folder_path):
      os.makedirs(folder_path)
    print('download done')
    # Create the full path for the PDF file within the folder
    path = os.path.join(folder_path, pdf_file_name)

    check_file = os.path.isfile(path)
    if not check_file:
      filepath = os.path.join(folder_path, pdf_file_name)
      # Save the downloaded PDF
      with open(filepath, 'wb') as pdf_object:
        pdf_object.write(get.content)

    images_folder = "D:\\Finalyearproject2\\webpage\\frontend\\src\\images"
    os.makedirs(images_folder, exist_ok=True)
    title_folder = input_data['title'].replace('?','_').replace(' ','_').replace('\'','_').replace(':','_').replace('\\','_').replace('/','_')
    output_folder = os.path.join(images_folder, title_folder)
    os.makedirs(output_folder, exist_ok=True)
    print(output_folder)
    # encoded_images = []
    with fitz.open(path) as pdf_document:
      for page_number in range(len(pdf_document)):
        page = pdf_document.load_page(page_number)
        image_list = page.get_images(full=True)
        for image_index, img in enumerate(image_list):
          base_image = pdf_document.extract_image(img[0])
          image_bytes = base_image["image"]
          image_ext = base_image["ext"]

          output_path = os.path.join(output_folder, f'image_page{page_number}_index{image_index}.{image_ext}')
          print(output_path)
          with open(output_path, "wb") as image_file:
            image_file.write(image_bytes)
    print("Done")
    return jsonify({"images": "Done"})
          
  else:
    print('no pdf')
    return jsonify({"images": "PDF was not downloaded"})



#----------------------------------------------------------------------------------------------------------------


if __name__ == '__main__':
  app.run(host="127.0.0.1", debug=True)
  
'''
from flask import Flask

app = Flask(__name__)
'''

'''if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)'''