from flask import Flask , render_template,request,url_for,redirect
import os
from openai import OpenAI
import json
# import tiktoken
client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file

# client.api_key  = os.environ['OPENAI_API_KEY']
def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0,
    )
    return response.choices[0].message.content

app = Flask(__name__)

messages = []
@app.route("/", methods=["GET"])
def home():
    # if request.method == "POST":
    #     message = request.form.get("message")
    #     messages.append({"role":"user","content":message})
    #     try:
    #         response = get_completion(message)
    #         messages.append({"role":"AI","content":response})
    #     except Exception as e:
    #         # newStr=e.message.replace("Error code: 429 - ","").replace("'","\"").replace("None","false")
    #         # jsonString=json.loads(newStr)
    #         # err_msg=jsonString['error']['message']
    #         messages.append({"role":"AI","content":e})
    #         print(e)


    return render_template("chat.html", messages=messages)