from flask import Flask,jsonify,request,render_template
from flask_cors import CORS 
import re
import warnings
import spacy
warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

@app.route('/genrules',methods=['POST'])
def genrules():
    print('genrules entered')
    data = request.get_json(force=True)
    doc = data['text']
    if len(doc)>7000:
        doc = doc[:6500]
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

import random
def anonymize_text(text):
        doc = nlp(text)
        anonymized_tokens = []
        substitution_dict = {}
        for token in doc:
            if token.ent_type_ == "ORG":
                dummy_string = "Mycompany" + str(random.randint(1000, 9999))
                anonymized_tokens.append(dummy_string)
                substitution_dict[dummy_string] = token.text
            elif token.ent_type_ == "NORP":
                dummy_string = "Nation" + str(random.randint(1000, 9999))
                anonymized_tokens.append(dummy_string)
                substitution_dict[dummy_string] = token.text
            elif token.ent_type_ == "FACILITY":
                dummy_string = "place" + str(random.randint(1000, 9999))
                anonymized_tokens.append(dummy_string)
                substitution_dict[dummy_string] = token.text
            elif token.ent_type_ == "PER":
                dummy_string = "person" + str(random.randint(1000, 9999))
                anonymized_tokens.append(dummy_string)
                substitution_dict[dummy_string] = token.text
            elif token.ent_type_ == "FAC":
                dummy_string = "bulding" + str(random.randint(1000, 9999))
                anonymized_tokens.append(dummy_string)
                substitution_dict[dummy_string] = token.text
            elif token.ent_type_ == "GPE":
                dummy_string = "Country" + str(random.randint(1000, 9999))
                anonymized_tokens.append(dummy_string)
                substitution_dict[dummy_string] = token.text
            elif token.ent_type_ == "RELIGION":
                dummy_string = "religion" + str(random.randint(1000, 9999))
                anonymized_tokens.append(dummy_string)
                substitution_dict[dummy_string] = token.text
            elif token.like_email:
                anonymized_tokens.append("dummy_email")
            elif token.like_url:
                anonymized_tokens.append("dummy_url")
            else:
                anonymized_tokens.append(token.text)
        return ' '.join(anonymized_tokens), substitution_dict

filterchoice = 1
@app.route("/filtertext", methods=["POST"])
def filtertext():
    print('filter text entered')
    global filterchoice
    data = request.get_json(force=True)
    filter_text = data['text']
    #input_text_risk_score = int(risk_score(filter_text))
    if filterchoice==1:
        processed_text = process_filter_text(filter_text)
    elif filterchoice==2:
        processed_text,subdict = anonymize_text(remove_special_characters(process_filter_text(filter_text)))
        print("Mapping Dictionary for Query:",subdict)
    else:
        processed_text = "Text Error"
    #output_text_risk_score = int(risk_score(processed_text))
    #print("Output Risk Score:",output_text_risk_score)
    results = remove_special_characters(processed_text)
    return jsonify(results), 200, {'Content-Type':'application/json'}

def process_filter_text(text):
    api_key = 'AIzaSyAvBSb1jIq0sOc9RhmRM-ZCiI7SV9_Ph7I'
    from langchain_google_genai import GoogleGenerativeAI
    llm = GoogleGenerativeAI(model="models/text-bison-001", google_api_key=api_key, temperature=0)
    template = """
    You are an artificial intelligence assistant who is a master in filtering input text. You are asked to answer and follow question instructions. The assistant gives helpful and detailed  answers to the user's questions from the provided text only.
    {question}"""
    from langchain import PromptTemplate, LLMChain

    prompt = PromptTemplate(template=template, input_variables=["question"])
    llm_chain = LLMChain(prompt=prompt, llm=llm, verbose=True)

    docs= text
    que="Do not answer the questions only filter company confidential information or code,company work information,especially personal life information,any unethical information give the filtered text as output"
    #Follow these strict instructions that Do not at all answer or repsond to the questions in the text.Only filter company confidential information or code,company work information,especially filter personal life information,any unethical information give the filtered text as output only nothing else."
    
    que = que + "\n\nText to be filtered: " + docs

    answer = llm_chain.run(question=que)
    return answer

def remove_special_characters(text):
    pattern = r'[^a-zA-Z\s:]'
    filtered_text = re.sub(pattern, '', text)
    return filtered_text

@app.route("/riskscore", methods=["POST"])
def riskscore():
    print('risk score entered')
    data = request.get_json(force=True)
    text = data['text']
    user_prompt = text
    max_possible_score = 30  # Adjust according to your maximum possible risk score
    risk_score = calculate_risk_score(user_prompt)
    normalized_score = normalize_risk_score(risk_score, max_possible_score)
    normalized_score = round_to_2_decimal_places(normalized_score)
    return jsonify(normalized_score), 200, {'Content-Type':'application/json'}

def round_to_2_decimal_places(number):
    rounded_number = round(number, 2)
    return rounded_number
#requirement - python -m spacy download en_core_web_sm
nlp = spacy.load("en_core_web_sm")
def calculate_risk_score(text):
    prompt = text
    doc = nlp(prompt)
    risk_score = 0
    
   # Rule 1: Named Entities
    for entity in doc.ents:
        if entity.label_ in ["ORG", "PERSON", "DATE"]:
            risk_score += 3  # Higher risk for company names, personal names, and dates
        elif entity.label_ == "CARDINAL":
            risk_score += 5  # Higher risk for numerical data like financial figures
    
    # Rule 2: Keywords indicating sensitive information
    if "password" in prompt.lower() or "login" in prompt.lower():
        risk_score += 10  # Higher risk if login credentials are mentioned
        
    if "confidential" in prompt.lower() or "top secret" in prompt.lower():
        risk_score += 8  # Higher risk if terms indicating confidentiality are mentioned
    
    # Rule 3: References to projects, clients, or products
    if "project" in prompt.lower() or "client" in prompt.lower():
        risk_score += 3  # Moderate risk for project or client references
    
    # Rule 4: Tone and Intent
    if "struggle" in prompt.lower() or "trouble" in prompt.lower():
        risk_score += 2  # Slight risk if the tone indicates difficulty
        
    if "request for help" in prompt.lower() or "assistance" in prompt.lower():
        risk_score += 3  # Moderate risk if the intent is seeking assistance
    
    # Rule 5: Compliance with policies
    if "violate policy" in prompt.lower() or "against rules" in prompt.lower():
        risk_score += 7  # Higher risk if there's an indication of policy violation
    
    # Add more rules based on tone, intent, compliance, etc.
    return risk_score


def normalize_risk_score(risk_score, max_possible_score):
    normalized_score = (risk_score / max_possible_score) * 100
    return normalized_score
    #print("Normalized Risk Score (%):", normalized_score)

@app.route("/llmanswer", methods=["POST"])
def llmanswer():
    print('llm query entered')
    data = request.get_json(force=True)
    text = data['text']
    results = chatquery(text)
    results = remove_special_characters(results)
    return jsonify(results), 200, {'Content-Type':'application/json'}

import openai
def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
    model=model,
    messages=messages,
    temperature=0,
    )
    return response.choices[0].message["content"]

@app.route("/apichoice",methods=['POST'])
def apichoice():
    data = request.get_json(force=True)
    text = data['APIChoice']
    global filterchatchoice
    if text=='ChatGPT':
        filterchatchoice = 'b'
        print("Current API : ChatGPT")
    else:
        filterchatchoice = 'a'
        print("Current API : Google-Palm")
    results = "API choice changed"
    return jsonify(results), 200, {'Content-Type':'application/json'}

filterchatchoice = 'a'
def chatquery(text):
    if filterchatchoice=='b':
        import os
        import pandas as pd
        import time
        
        text = "Do not respond at all to any secret information,specially personal life information or unethical information if present in the following query\nThe Query:" + text
        answer = get_completion(text)
    else:
        api_key = 'AIzaSyAvBSb1jIq0sOc9RhmRM-ZCiI7SV9_Ph7I' # put your API key here
        from langchain_google_genai import GoogleGenerativeAI
        llm = GoogleGenerativeAI(model="models/text-bison-001", google_api_key=api_key, temperature=0)

        template = """
        You are an artificial intelligence assistant to a company employee. You are asked to answer questions. The assistant gives helpful, detailed, and polite answers to the user's questions.
        {question}
        """

        from langchain import PromptTemplate, LLMChain

        prompt = PromptTemplate(template=template, input_variables=["question"])
        llm_chain = LLMChain(prompt=prompt, llm=llm, verbose=True)

        que = text

        answer = llm_chain.run(question=que)
    return answer

totalrules = []
filenames = []

@app.route('/storerules',methods=['POST'])
def storerules():
    global totalrules,filenames
    print('store rules entered')
    data = request.get_json(force=True)
    totalrules = data['totalrules']
    filenames = data['filenames']

    print(filenames)
    results = "Data stored at flask"
    return jsonify(results), 200, {'Content-Type':'application/json'}

@app.route('/gettherules',methods=['POST'])
def gettherules():
    global totalrules,filenames
    print('get the rules entered')
    data = request.get_json(force=True)

    results = {"totalrules":totalrules,"filenames":filenames}
    return jsonify(results), 200, {'Content-Type':'application/json'}


if __name__=='__main__':
    app.run(host='0.0.0.0',port=5001,debug=True)
