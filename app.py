from flask import Flask , render_template,request,url_for,redirect,jsonify
import os
import openai
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
        Avoid answering questions unrelated to project management.The customer service query will be delimited with{ delimiters} characters. Your output have to be in a beautiful markdown format."""
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
def get_completion(prompt, model="gpt-3.5-turbo"):
    # user_message = f"{delimiters}{prompt.content}{delimiters}"
    messages = [
                {   "role":"system",
                    "content":system
                 }
                ]
    messages=messages + prompt
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0,
    )
    return response.choices[0].message

@app.route("/api/chat", methods=["POST"])
def chat():
    message = request.get_json()
    data={}
    if message == None:
        return jsonify({"role":"AI","content":"Please enter a message"})
    try:
        response = get_completion(message)
        data={
            "role":response.role,
            "content":response.content
              }
    except (openai.APIError,openai.APIConnectionError,openai.RateLimitError ) as e:
    #Handle API error here, e.g. retry or log
        data={"role":"assistant","content":f"Error: {e}"}
    
    # except openai.APIConnectionError as e:
    #     #Handle connection error here
    #     data ={"role":"assistant","content":f"Failed to connect {e}"}

    # except openai.RateLimitError as e:
    #     #Handle rate limit error (we recommend using exponential backoff)
    #     data ={"role":"assistant","content":f"Request exceeded rate limit{e}"}
    except Exception as e:
        data ={"role":"assistant","content":f"something went wrong"}
    finally:
        return jsonify(data)
        


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