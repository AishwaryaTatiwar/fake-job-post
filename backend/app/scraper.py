import re
import json
import ast
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
from .chatbot import initialize_chatbot, get_chatbot_response
import pickle
import numpy as np
import os


class JobScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.chatbot = initialize_chatbot()

    @staticmethod
    def parse_salary(salary_text):
        if not salary_text or not isinstance(salary_text, str):
            return 0
            
        dollar_rate = 83
        numbers = []
        current_number = ""
        i = 0
        n = len(salary_text)
        
        print(f"Debug - Original salary text: '{salary_text}'")
        
        while i < n:
            if salary_text[i].isdigit() or salary_text[i] == ',':
                current_number += salary_text[i]
                i += 1
            else:
                # Check for separator ('-' or 'to')
                if (salary_text[i] == '-' or 
                    (i+2 < n and salary_text[i:i+2].lower() == 'to')):
                    
                    if current_number:
                        numbers.append(current_number.replace(',', ''))
                        current_number = ""
                    
                    # Skip the separator
                    if salary_text[i] == '-':
                        i += 1
                    else:  # 'to'
                        i += 2
                else:
                    if current_number:
                        numbers.append(current_number.replace(',', ''))
                        current_number = ""
                    i += 1
        
        # Add the last number if exists
        if current_number:
            numbers.append(current_number.replace(',', ''))
        
        print(f"Debug - Extracted numbers: {numbers}")
        
        try:
            if len(numbers) >= 2:
                # Calculate difference between max and min in USD
                salary = (int(numbers[-1]) - int(numbers[0])) / dollar_rate
                return round(salary, 2)
            elif len(numbers) == 1:
                # Single number - convert to USD
                return round(int(numbers[0]) / dollar_rate, 2)
            else:
                return 0
        except (ValueError, IndexError) as e:
            print(f"Error converting numbers: {e}")
            return 0

    def clean_text(self, text):
        if not text:
            return ''
        return ' '.join(text.split())

    def scrape_job(self, url=None, post_text=None , has_logo=False , experience=None, education=None, employment=None , hasQuestion=None):
        print("hasQuestion: ",hasQuestion)
        global logoValue
        global exp
        global edu
        global emp
        global has_questions
        has_questions = 1 if (hasQuestion=="true") else 0
        exp = experience
        edu = education
        emp = employment
        logoValue = has_logo  # ✅ Store toggle value globally
        print(logoValue)
        try:
            job_data = {
                'job_title': '',
                'job_location': '',
                'department': '',
                'range_of_salary': '',
                'profile': '',
                'job_description': '',
                'requirements': '',
                'job_benefits': '',
                'telecommunication': 0,
                'company_logo': 0,
                'type_of_employment': '',
                'experience': '',
                'qualification': '',
                'type_of_industry': '',
                'operations': '',
                'fraudulent': 'Yes'
            }

            if url:
                if 'linkedin.com' in url:
                    job_data.update(self._scrape_naukri(url))
                elif 'internshala.com' in url:
                    job_data.update(self._scrape_naukri(url))
                elif 'naukri.com' in url:
                    job_data.update(self._scrape_naukri(url))
                elif 'unstop.com' in url:
                    job_data.update(self._scrape_naukri(url))
            elif post_text:
                job_data.update(self._analyze_post_text(post_text))

            self._enrich_job_data(job_data)
            return job_data

        except Exception as e:
            print(f"Error scraping job: {str(e)}")
            return None

    def _analyze_post_text(self, post_text):
        data = {
            'job_title': '',
            'job_location': '',
            'department': '',
            'range_of_salary': '',
            'profile': '',
            'job_description': '',
            'requirements': '',
            'job_benefits': '',
            'telecommunication': 0,
            'company_logo': 0,
            'type_of_employment': '',
            'experience': '',
            'qualification': '',
            'type_of_industry': '',
            'operations': '',
            'fraudulent': 'No'
        }
        
        try:
            extracted_data = get_chatbot_response(self.chatbot, post_text)
            print("The extracted data is: ",extracted_data)
            fraud_value = "No"
            
            fraud_patterns = [
                r'"Fraudulent":\s*"(Yes|No)"',
                r'"Fraudulent":\s*(Yes|No)',
                r'Fraudulent:\s*(Yes|No)',
                r'"Is Fraudulent":\s*"(Yes|No)"',
                r'"Scam":\s*"(Yes|No)"',
                r'"Likely Fraud":\s*"(Yes|No)"',
                r'is_fraudulent:\s*(true|false)',
                r'"high_risk":\s*(true|false)'
            ]
            
            for pattern in fraud_patterns:
                match = re.search(pattern, extracted_data, re.IGNORECASE)
                if match:
                    value = match.group(1).lower()
                    fraud_value = "Yes" if value in ['yes', 'true'] else 'No'
                    break
            
            if fraud_value == "No":
                fraud_indicators = [
                    'high risk', 'scam', 'fraud', 'too good to be true',
                    'upfront payment', 'money transfer', 'payment required'
                ]
                if any(indicator in extracted_data.lower() for indicator in fraud_indicators):
                    fraud_value = "Yes"
            
            data['fraudulent'] = fraud_value

            if "[" in extracted_data and "]" in extracted_data:
                try:
                    array_pattern = re.search(r'\[.*\]', extracted_data, re.DOTALL)
                    if array_pattern:
                        array_content = array_pattern.group(0)
                        try:
                            extracted_values = json.loads(array_content)
                        except json.JSONDecodeError:
                            extracted_values = ast.literal_eval(array_content)

                        extracted_keys = [
                            "Job Title", "Job Location", "Department", "Range of Salary",
                            "Profile", "Job Description", "Requirements", "Job Benefits",
                            "Telecommunication", "Company Logo", "Type of Employment",
                            "Experience", "Qualification", "Type of Industry", "Operations"
                        ]

                        extracted_values = (extracted_values + [""] * len(extracted_keys))[:len(extracted_keys)]
                        extracted_values[8] = 1 if str(extracted_values[8]).lower() in ["yes", "true", "1"] else 0
                        extracted_values[9] = 1 if str(extracted_values[9]).lower() in ["yes", "true", "1"] else 0

                        data.update({
                            'job_title': extracted_values[0],
                            'job_location': extracted_values[1],
                            'department': extracted_values[2],
                            'range_of_salary': str(extracted_values[3]).replace("Salary range: ", ""),
                            'profile': extracted_values[4],
                            'job_description': extracted_values[5],
                            'requirements': extracted_values[6],
                            'job_benefits': extracted_values[7],
                            'telecommunication': int(extracted_values[8]),
                            'company_logo': int(extracted_values[9]),
                            'type_of_employment': extracted_values[10],
                            'experience': extracted_values[11],
                            'qualification': extracted_values[12],
                            'type_of_industry': extracted_values[13],
                            'operations': extracted_values[14]
                        })

                except (json.JSONDecodeError, ValueError, SyntaxError, IndexError) as e:
                    print(f"Error parsing array data: {str(e)}")
                
            print(logoValue)
            self._enrich_job_data(data)

        except Exception as e:
            print(f"Error in post text analysis: {str(e)}")

        return data


    def _enrich_job_data(self, job_data):
        if not job_data['profile'] and job_data['job_title']:
            job_data['profile'] = job_data['job_title']
        
        if not job_data['type_of_industry'] and job_data['job_description']:
            industries = ['IT', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail']
            for industry in industries:
                if industry.lower() in job_data['job_description'].lower():
                    job_data['type_of_industry'] = industry
                    break
        
        if not job_data['operations'] and job_data['job_description']:
            operations = ['Customer Service', 'Sales', 'Support', 'Development', 'Research']
            for operation in operations:
                if operation.lower() in job_data['job_description'].lower():
                    job_data['operations'] = operation
                    break
        
        if not job_data['department'] and job_data['job_title']:
            departments = {
                'IT': ['developer', 'engineer', 'programmer'],
                'HR': ['hr', 'human resources', 'recruitment'],
                'Marketing': ['marketing', 'brand', 'social media'],
                'Sales': ['sales', 'business development'],
                'Finance': ['finance', 'accounts', 'accounting']
            }
            for dept, keywords in departments.items():
                if any(keyword in job_data['job_title'].lower() for keyword in keywords):
                    job_data['department'] = dept
                    break
        
        for key in job_data:
            if job_data[key] is None:
                job_data[key] = ''

    
        global Dept_Project_Management
        global Dept_Hospitality_Food_Services 
        global Dept_Product_Management_Development 
        global Dept_Government_Public_Sector 
        global Dept_Human_Resources
        global Dept_Operations 
        global Dept_Logistics_Supply_Chain 
        global Dept_Administrative
        global Dept_Education_Training 
        global Dept_Customer_Service
        global Dept_Research_Development
        global Dept_Retail_Consumer
        global Dept_Finance_Accounting
        global Dept_Healthcare
        global Dept_Quality_Assurance_Testing
        global Dept_IT
        global Dept_Engineering
        global Dept_Technology
        global Dept_Creative_Design 
        global Dept_Legal_Compliance 
        global Dept_Marketing
        global Dept_Media_Communications
        global Dept_Business_Consulting
        global employment_encoded
        global salary_diff
        global Dept_Manufacturing_Production 
        global has_questions
        global has_company_logo
        global telecommuting
        global job_desc_length
        global education_encoded 
        global Dept_Sales
        global experience_encoded
        global Dept_Not_Provided

        # Define the orders and mapping
        experience_order = [
            'Not Provided', 'Not Applicable', 'Internship', 'Entry level',
            'Associate', 'Mid-Senior level', 'Director', 'Executive'
        ]

        education_order = [
            'Not Provided', 'Unspecified', 'Some High School Coursework', 'High School or equivalent',
            'Vocational - HS Diploma', 'Some College Coursework Completed', 'Certification',
            'Vocational', 'Vocational - Degree', 'Associate Degree', "Bachelor's Degree",
            "Master's Degree", 'Doctorate', 'Professional'
        ]

        employment_order = ['Not Provided', 'Other', 'Temporary', 'Contract',
                            'Part-time', 'Full-time']

        department_mapping = {
            "Marketing": ["Marketing", "MKT", "MKTG", "Marketing and Communications", "Marketing – Pame Stoixima",
                        "Marketing & Sales", "Marketing / Customer Service", "Marketing Department", "Marketing team",
                        "Marketing & Design", "Marketing, Sales", "Marketing Intern"],

            "Sales": ["Sales", "Sales and Business Development", "Sales and Marketing", "Sales & Marketing",
                    "Sales Team", "Inside Sales", "Inside Sales Team", "Local Sales", "New Business Sales",
                    "Field Sales", "Sales - USA", "Sales Department", "Sales / BD", "Sales / Marketing",
                    "Sales&Support", "Sales/Marketing", "Sales / Engineering", "Outbound Sales"],

            "Human Resources": ["HR", "Human Resources", "Recruiting HR", "HR Manager", "Recruitment",
                                "Recruitment ", "People & Culture", "Organisational Development"],

            "Customer Service": ["Customer Service", "Customer Care", "Servicing-Customer Care",
                                "Customer Support", "Customer and Compliance", "Client Services",
                                "Member Services", "Client Success", "CustomerSuccess", "Customer Experience",
                                "Customer Service Rep.", "Customer Champion", "Customer Happiness"],

            "Engineering": ["Engineering", "Engineering ", "Engineeering", "Engineering:Software Engineering",
                            "Engineering:Dev Ops", "Software Engineering", "Electrical", "Engineers",
                            "Engineering - Construction", "Engineering, Pipeline Design", "Design Engineering"],

            "Technology": ["Software Development", "Software Engineering", "Application Development",
                        "Front-End Development", "Back-End Development", "Web Development",
                        "Mobile Development", "Game Design and Development", "Software / IT",
                        "Tech", "Programming", "Engineering: Software Engineering", "Engineering: Dev Ops",
                        "Development", "Technology", "Digital Design", "UI/UX Design",
                        "UX Practice", "UX/API", "Digital Marketing", "Digital Department",
                        "Dev and Software QA", "Dev - Web Team"],

            "IT": ["IT", "IT Department", "IT Team", "IT Solution", "IT Sales",
                "Information Technology", "Information Technology Group",
                "Computer / Software", "IT Support", "IT Services", "IT Operations",
                "Server Administration", "Infrastructure & Operations", "Infrastructure Support Services",
                "Network Operations Center", "System Operations", "Technical Support",
                "Security", "Cybersecurity", "Cloud Services", "CloudSpotter Technologies",
                "Admin/Clerical", "Help Desk"],

            "Operations": ["Operations", "Operations ", "Infrastructure & Operations",
                        "Infrastructure Support Services", "Field Operations", "Online Operations",
                        "Business Operations", "Businessfriend.com", "Platform", "Business Development",
                        "Strategic Initiatives", "Facility", "Facilities / Maintenance"],

            "Finance & Accounting": ["Finance", "Financial", "Finance/Securities", "Finance and Operations",
                                    "Accounting", "Accounting / Finance", "Accounting & Finance",
                                    "Finance & Accounting", "Financial Services"],

            "Product Management & Development": ["Product", "Product Management", "Product Team",
                                                "Product Marketing", "Product & Innovation",
                                                "Product Development", "Product Development Team",
                                                "Product Innovation", "Product Development - Test"],

            "Research & Development": ["R&D", "R&D Department", "Research", "Research & Development",
                                        "Development", "Development ", "Development Dpt", "Development & Support"],

            "Manufacturing & Production": ["Manufacturing", "Manufacturing & Production", "Production",
                                            "Production ", "Manufacturing - Quality"],

            "Legal & Compliance": ["Legal", "Legal Services", "Finance, legal & compliance",
                                    "Compliance", "RISK MANAGEMENT ", "Contracts", "AML", "FRAUD DEPT"],

            "Administrative": ["Admin", "Administration", "Administrative", "Administrative Office",
                            "Administration ", "Management", "Management Team", "Upper Level Management",
                            "Lower Level Management", "Entry Level Supervision"],

            "Healthcare": ["Medical", "Healthcare", "Health Services", "Health and Social", "Health and Social ",
                        "Family Medicine", "Nursing", "Physical Therapy", "Healthcare Industries"],

            "Creative & Design": ["Creative", "Creative Services", "Creative Department", "Design",
                                "Designing", "Graphic Design", "Digital Design", "Design & Interface",
                                "Design & Marketing", "Design/Architecture"],

            "Media & Communications": ["Media", "Social Media", "Social Media Promotion",
                                        "Social Media Services", "Public Relations", "PR",
                                        "Public Relations & Communication", "Marketing & Communications",
                                        "Content Programming", "Broadcasting"],

            "Project Management": ["Project Management", "Project Management ", "Projects",
                                    "Program", "Programs", "Campaigns", "Partnerships"],

            "Retail & Consumer": ["Retail", "Retail Pharmacy", "Grocery Stores", "Merchandising",
                                "Merchandising ", "Consumer", "Auto Sales"],

            "Business Consulting": ["Consulting", "Professional Services", "Professional Services Team",
                                    "Business Consultancy", "Advisory", "Business Intelligence"],

            "Education & Training": ["Education", "Instructor", "Academic", "Student Financial Services",
                                    "Community Training Center", "Training"],

            "Logistics & Supply Chain": ["Logistics", "Supply", "Supply & Chain", "Transport",
                                        "Shipping", "Warehouse", "Warehouse "],

            "Hospitality & Food Services": ["Catering", "Food", "Food and Beverage", "Restaurant",
                                            "Hotel", "Hospitality"],

            "Quality Assurance & Testing": ["Quality Assurance", "Quality Engineering", "QA",
                                            "Testing", "Solution Test", "Integration & Testing"],

            "Government & Public Sector": ["Government", "Public Affairs", "Administration support",
                                            "Head Office", "State of Indiana"]
        }

        # --- Encode experience ---
        try:
            experience_encoded = experience_order.index(exp)
        except ValueError:
            experience_encoded = 0  # 'Not Provided'

        # --- Encode education ---
        try:
            education_encoded = education_order.index(edu)
        except ValueError:
            education_encoded = 0

        # --- Encode employment ---
        try:
            employment_encoded = employment_order.index(emp)
        except ValueError:
            employment_encoded = 0

        # --- Set telecommuting & company logo flags ---
        telecommuting = job_data['telecommunication']
        has_company_logo = logoValue
        job_data["company_logo"] = 1 if logoValue else 0


        # --- Job description length ---
        description_without_spaces=job_data['job_description']
        description_without_spaces.replace(" ","")
        job_desc_length = len(description_without_spaces)

        # --- Initialize department flags to 0 ---
        Dept_Project_Management = 0
        Dept_Hospitality_Food_Services = 0
        Dept_Product_Management_Development = 0
        Dept_Government_Public_Sector = 0
        Dept_Human_Resources = 0
        Dept_Operations = 0
        Dept_Logistics_Supply_Chain = 0
        Dept_Administrative = 0
        Dept_Education_Training = 0
        Dept_Customer_Service = 0
        Dept_Research_Development = 0
        Dept_Retail_Consumer = 0
        Dept_Finance_Accounting = 0
        Dept_Healthcare = 0
        Dept_Quality_Assurance_Testing = 0
        Dept_IT = 0
        Dept_Engineering = 0
        Dept_Technology = 0
        Dept_Creative_Design = 0
        Dept_Legal_Compliance = 0
        Dept_Marketing = 0
        Dept_Media_Communications = 0
        Dept_Business_Consulting = 0
        Dept_Manufacturing_Production = 0
        Dept_Sales = 0
        Dept_Not_Provided = 0


        matched = False
        dept_name = job_data['department'].strip().lower()
        for dept, values in department_mapping.items():
            if any(dept_name == val.strip().lower() for val in values):
                var_name = "Dept_" + dept.replace(" & ", "_").replace(" ", "_")
                if var_name in globals():
                    globals()[var_name] = 1
                    matched = True
                break

        if not matched:
            Dept_Not_Provided = 1

        # For placeholder variables not part of mapping
        # salary_diff = self.parse_salary()  
        salary_text = job_data.get('range_of_salary', '')
        salary_diff = self.parse_salary(salary_text)

        print("Dept_Project_Management:", Dept_Project_Management)
        print("Dept_Hospitality_Food_Services:", Dept_Hospitality_Food_Services)
        print("Dept_Product_Management_Development:", Dept_Product_Management_Development)
        print("Dept_Government_Public_Sector:", Dept_Government_Public_Sector)
        print("Dept_Human_Resources:", Dept_Human_Resources)
        print("Dept_Operations:", Dept_Operations)
        print("Dept_Logistics_Supply_Chain:", Dept_Logistics_Supply_Chain)
        print("Dept_Administrative:", Dept_Administrative)
        print("Dept_Education_Training:", Dept_Education_Training)
        print("Dept_Customer_Service:", Dept_Customer_Service)
        print("Dept_Research_Development:", Dept_Research_Development)
        print("Dept_Retail_Consumer:", Dept_Retail_Consumer)
        print("Dept_Finance_Accounting:", Dept_Finance_Accounting)
        print("Dept_Healthcare:", Dept_Healthcare)
        print("Dept_Quality_Assurance_Testing:", Dept_Quality_Assurance_Testing)
        print("Dept_IT:", Dept_IT)
        print("Dept_Engineering:", Dept_Engineering)
        print("Dept_Technology:", Dept_Technology)
        print("Dept_Creative_Design:", Dept_Creative_Design)
        print("Dept_Legal_Compliance:", Dept_Legal_Compliance)
        print("Dept_Marketing:", Dept_Marketing)
        print("Dept_Media_Communications:", Dept_Media_Communications)
        print("Dept_Business_Consulting:", Dept_Business_Consulting)
        print("employment_encoded:", employment_encoded)
        print("salary_diff:", salary_diff)
        print("Dept_Manufacturing_Production:", Dept_Manufacturing_Production)
        print("has_questions:", has_questions)
        print("has_company_logo:", has_company_logo)
        print("telecommuting:", telecommuting)
        print("job_desc_length:", job_desc_length)
        print("education_encoded:", education_encoded)
        print("Dept_Sales:", Dept_Sales)
        print("experience_encoded:", experience_encoded)
        print("Dept_Not_Provided:", Dept_Not_Provided)

        BASE_DIR = os.path.dirname(os.path.abspath(__file__))

        # Construct the full path to the model file
        model_path = os.path.join(BASE_DIR, 'new_model.pkl')

        # Load the model
        with open(model_path, 'rb') as file:
            model = pickle.load(file)

            input_data = np.array([[
            Dept_Project_Management,
            Dept_Hospitality_Food_Services,
            Dept_Product_Management_Development,
            Dept_Government_Public_Sector,
            Dept_Human_Resources,
            Dept_Operations,
            Dept_Logistics_Supply_Chain,
            Dept_Administrative,
            Dept_Education_Training,
            Dept_Customer_Service,
            Dept_Research_Development,
            Dept_Retail_Consumer,
            Dept_Finance_Accounting,
            Dept_Healthcare,
            Dept_Quality_Assurance_Testing,
            Dept_IT,
            Dept_Engineering,
            Dept_Technology,
            Dept_Creative_Design,
            Dept_Legal_Compliance,
            Dept_Marketing,
            Dept_Media_Communications,
            Dept_Business_Consulting,
            employment_encoded,
            salary_diff,
            Dept_Manufacturing_Production,
            has_questions,
            has_company_logo,
            telecommuting,
            job_desc_length,
            education_encoded,
            Dept_Sales,
            experience_encoded,
            Dept_Not_Provided
        ]])

        # Predict
        prediction = model.predict(input_data)

        # Print result
        print("Prediction (0: Not Fraud, 1: Fraud):", prediction[0])
        if prediction[0] == 1:
            job_data['fraudulent'] = 'Yes'
        else:
            job_data['fraudulent'] = 'No'


    def _scrape_naukri(self, url):
        data = {}
        try:
            with sync_playwright() as pw:
                browser = pw.chromium.launch(headless=True)
                page = browser.new_page()
                page.goto(url, timeout=60000)
                page.wait_for_selector('body', timeout=10000)
                content = page.content()
                browser.close()
                cleaned_content = self._clean_html_content(content)
                data = self._analyze_post_text(cleaned_content)
        
        except Exception as e:
            print(f"Error scraping Website: {str(e)}")
        
        return data

    def _clean_html_content(self, html_content):
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            text = soup.get_text(separator=' ')
            cleaned_text = re.sub(r'\s+', ' ', text).strip()
            return cleaned_text
        except Exception as e:
            print(f"Error cleaning HTML content: {str(e)}")
            return html_content
            