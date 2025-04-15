from flask import Flask, request, jsonify
import fitz
import spacy
import re
import pandas as pd
from fuzzywuzzy import fuzz, process
from transformers import T5ForConditionalGeneration, T5Tokenizer
from spacy.matcher import Matcher  # Import Matcher

app = Flask(__name__)

# تحميل الموديلات
nlp = spacy.load("en_core_web_sm")
nlp2 = spacy.load("en_core_web_sm")
ruler2 = nlp2.add_pipe("entity_ruler", before="ner")
ruler2.from_disk("jz_skill_patterns.jsonl")
nlp3 = spacy.load("./output/model-best")  # موديل الشركة والجامعة
tokenizer = T5Tokenizer.from_pretrained("t5-small")
t5_model = T5ForConditionalGeneration.from_pretrained("t5-small")

# Initialize Matcher globally for efficiency
matcher = Matcher(nlp.vocab)
name_pattern = [{'POS': 'PROPN'}, {'POS': 'PROPN'}]
matcher.add('NAME', [name_pattern])

# تحميل البيانات
skills_dataset = pd.read_csv("skills_requird.csv")
courses_dataset = pd.read_csv("skills_youtube_courses (1).csv")

# ------------------------ الدوال ------------------------

def pdf_to_text(file):
    doc = fitz.open(stream=file.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return " ".join(text.split("\n"))

def extract_name(text):
    doc = nlp(text)
    matches = matcher(doc)
    for match_id, start, end in matches:
        return doc[start:end].text
    return None

def extract_email(text):
    doc = nlp(text)
    for token in doc:
        if "@" in token.text:
            return token.text
    return None

def extract_phone(text):
    r = re.compile(r'\+\d{10,15}')
    matches = r.findall(text)
    return matches[0] if matches else None

def extract_job_title(text):
    job_title_pattern = r"(Back[- ]?end Developer\(.NET\)|Back[- ]?end Developer\(.PHP\)|Back[- ]?end Developer\(.Node\)|Back[- ]?end Developer\(.Java\)|Back[- ]?end Developer\(.Flask\)|Back[- ]?end Developer\(.Django\)|Back[- ]?end Developer\(.Go\)|Front[- ]?end Developer\(.React\)|Front[- ]?end Developer\(.Vue\)|Front[- ]?end Developer\(.Anglur\)|Rust Developer|Bun Developer|Front[- ]?end Developer|Full[- ]?stack Developer|Software Engineer|Data Scientist|Machine Learning Engineer|AI Engineer|Project Manager|DevOps Engineer|Database Administrator|Security Engineer|Cloud Engineer|Game Developer|Mobile Developer|UI/UX Designer|QA Engineer|Blockchain Developer|IT Consultant|Data Analyst|Network Engineer|Technical Writer|Business Analyst|Product Manager)"
    match = re.search(job_title_pattern, text, re.IGNORECASE)
    return match.group() if match else None

def extract_skills(text):
    doc = nlp2(text)
    return list(set(ent.text for ent in doc.ents if ent.label_ == "SKILL"))

def extract_summary(text):
    match = re.search(r"(Summary|Professional Summary|Objective|About Me|Overview|Career Summary|Profile|Personal Statement|Experience Summary|Background|Introduction|Mission Statement|Career Goal)\s*[:\n]?\s*(.*?)(\n\n|\Z)", text, re.DOTALL | re.IGNORECASE)
    return match.group(2).strip() if match else "Summary not found"

def improve_summary(text):
    if text == "Summary not found":
        return text
    prompt = f"Improve this CV summary: {text}"
    input_ids = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True, max_length=512).input_ids
    output_ids = t5_model.generate(input_ids, max_length=200, num_beams=3, temperature=0.8, top_k=50)
    return tokenizer.decode(output_ids[0], skip_special_tokens=True)

def find_closest_match(job_title, dataset):
    job_titles = dataset['Job Title'].tolist()
    best_match = process.extractOne(job_title, job_titles, scorer=fuzz.ratio)
    return best_match

def find_missing_skills(extracted_skills, job_title, dataset):
    best_match = find_closest_match(job_title, dataset)
    if best_match:
        job_data = dataset[dataset['Job Title'] == best_match[0]]
        if not job_data.empty:
            required_skills = [skill.strip() for skill in job_data.iloc[0]['Required Skills'].split(',')]
            missing_skills = [skill for skill in required_skills if skill not in extracted_skills]
            return missing_skills
    return []

def get_courses_for_missing_skills(missing_skills, courses_data):
    result = []
    for skill in missing_skills:
        skill = skill.strip().lower()
        escaped_skill = re.escape(skill)  # Escape special characters
        matched_course = courses_data[courses_data['Skill'].str.contains(escaped_skill, case=False, na=False)]
        if not matched_course.empty:
            course_info = matched_course.iloc[0]
            result.append({
                'Skill': skill,
                'Course Title': course_info['Course Title'],
                'YouTube URL': course_info['YouTube URL']
            })
    return result

# ------------------------ API Route ------------------------

@app.route("/analyze_cv", methods=["POST"])
def analyze_cv():
    if 'cv' not in request.files:
        print("No file received in request")  # Debugging line

        return jsonify({"error": "CV file is required"}), 400

    file = request.files['cv']

    print("Received file: {file.filename}") 
    
    try:
        text = pdf_to_text(file)
    except Exception as e:
        return jsonify({"error": f"Failed to process CV: {str(e)}"}), 500

    if not text:
        return jsonify({"error": "No text found in the CV"}), 400

    name = extract_name(text)
    email = extract_email(text)
    phone = extract_phone(text)
    job_title = extract_job_title(text)
    skills = extract_skills(text)
    summary = extract_summary(text)
    improved = improve_summary(summary)
    missing = find_missing_skills(skills, job_title, skills_dataset)
    courses = get_courses_for_missing_skills(missing, courses_dataset)

    return jsonify({
        "name": name,
        "email": email,
        "phone": phone,
        "job_title": job_title,
        "skills": skills,
        "summary": summary,
        "improved_summary": improved,
        "missing_skills": missing,
        "recommended_courses": courses
    })

if __name__ == "__main__":
    app.run(debug=True)
