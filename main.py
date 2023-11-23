from flask import Flask , render_template,request,url_for,redirect,jsonify
import os
from openai import OpenAI
import json
# import tiktoken
client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file
app = Flask(__name__)
delimiters='###'
system =f"""You are a project manager overseeing the development of a software project. 
        You need to provide guidance, allocate tasks, and ensure the project progresses smoothly. 
        Respond in a way that aligns with project management principles and handle queries related to project planning, task assignment, deadlines, team collaboration, and project status updates. "
        Avoid answering questions unrelated to project management.The customer service query will be delimited with{ delimiters} characters"""
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
def get_completion(prompt, model="gpt-3.5-turbo"):
    user_message = f"{delimiters}{prompt}{delimiters}"
    messages = [
                {   "role":"system",
                    "content":system
                 },
                 {
                    "role": "user",
                    "content": user_message
                }
                ]
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0,
    )
    return response.choices[0].message.content

@app.route("/api/chat", methods=["POST"])
def chat():
    message = request.get_json().get("message")
    if message == None:
        return jsonify({"role":"AI","content":"Please enter a message"})
    try:
        response = get_completion(message)
        data={
            "role":"AI",
            "content":response
              }
        return jsonify(data)
    except Exception as e:
        # newStr=e.message.replace("Error code: 429 - ","").replace("'","\"").replace("None","false")
        # jsonString=json.loads(newStr)
        # err_msg=jsonString['error']['message']
        return jsonify({"role":"AI","content":e})
        print(e)
        


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


    return render_template("chat.html")