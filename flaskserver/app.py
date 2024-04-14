from flask import Flask,jsonify,request,render_template
from flask_cors import CORS 
import re
import warnings
warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

@app.route('/genrules',methods=['POST'])
def genrules():
    print('genrules entered')
    data = request.get_json(force=True)
    doc = data['text']
    rules = llmresponse(doc)
    #print(rules)
    print('Received a file')
    results = extract_rules(rules)
    return jsonify(results), 200, {'Content-Type':'application/json'}

def llmresponse(text):
    api_key = 'AIzaSyAvBSb1jIq0sOc9RhmRM-ZCiI7SV9_Ph7I'
    from langchain_google_genai import GoogleGenerativeAI
    llm = GoogleGenerativeAI(model="models/text-bison-001", google_api_key=api_key, temperature=0)
    template = """
    You are an artificial intelligence assistant who is a master in summarizing text and creating rules and policies from that text only. You are asked to answer questions. The assistant gives helpful, detailed and give maximum number of points which are detailed answers to the user's questions from the provided text only.

    {question}

    """
    from langchain import PromptTemplate, LLMChain

    prompt = PromptTemplate(template=template, input_variables=["question"])
    llm_chain = LLMChain(prompt=prompt, llm=llm, verbose=True)

    docs= text
    que="Outline the given rules and regulations for company employees and provide the action taken against employee for infringement of any rule "
    que = que + "\n" + docs
    answer = llm_chain.run(question=que)
    return answer

def extract_rules(text):
    rules = re.findall(r'\*\*(.*?)\*\*', text)
    return rules

# @app.route("/filtertext", methods=["POST"])
# def process_text():
#     if request.method == "POST":
#         filter_text = request.form["filter_text"]
#         #input_text_risk_score = int(risk_score(filter_text))
#         processed_text = process_filter_text(filter_text)
#         #output_text_risk_score = int(risk_score(processed_text))
#         #print("Output Risk Score:",output_text_risk_score)
#         results = processed_text
#         return jsonify(results), 200, {'Content-Type':'application/json'}
#     return "No text provided."

# def process_filter_text(text):
#     api_key = 'AIzaSyAvBSb1jIq0sOc9RhmRM-ZCiI7SV9_Ph7I'
#     from langchain_google_genai import GoogleGenerativeAI
#     llm = GoogleGenerativeAI(model="models/text-bison-001", google_api_key=api_key, temperature=0)
#     template = """
#     You are an artificial intelligence assistant who is a master in filtering input text. You are asked to answer and follow question instructions. The assistant gives helpful and detailed  answers to the user's questions from the provided text only.
#     {question}"""
#     from langchain import PromptTemplate, LLMChain

#     prompt = PromptTemplate(template=template, input_variables=["question"])
#     llm_chain = LLMChain(prompt=prompt, llm=llm, verbose=True)

#     docs= text
#     que="Do not answer the questions in the text only filter company confidential information or code,company work information,especially personal life information,any unethical information give the filtered text as output"
#     que = que + "\n\nText to be filtered: " + docs

#     answer = llm_chain.run(question=que)
#     return answer

if __name__=='__main__':
    app.run(host='0.0.0.0',port=5001,debug=True)