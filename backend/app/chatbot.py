from openai import OpenAI
import os
from dotenv import load_dotenv
import ast

# Load environment variables
load_dotenv()

def initialize_chatbot():
    """Initialize the OpenAI client"""
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY"),
    )
    return client

def get_chatbot_response(client, job_post):
    """Get response from OpenAI model using the existing prompt structure"""
    prompt = f"""Extract the following details from the given job post and return them in an array in the exact order:
1. Job Title
2. Job Location
3. Department
4. Range of Salary
5. Profile
6. Job Description
7. Requirements
8. Job Benefits
9. Telecommuting(work from home / remote) (0 or 1)
10. Company Logo (0 or 1)
11. Type of Employment
12. Experience
13. Qualification
14. Type of Industry
15. Operations

Job Post:
{job_post}

Return only the array of extracted values, with empty strings for missing values. The output must be formatted exactly as follows:

["Job Title", "Job Location", "Department", "Range of Salary", "Profile", "Job Description", "Requirements", "Job Benefits", "Telecommuting", "Company Logo", "Type of Employment", "Experience", "Qualification", "Type of Industry", "Operations"]
"""


    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "http://localhost:5000",
                "X-Title": "Job Post Analyzer",
            },
            model="openai/gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        
        if not completion.choices or len(completion.choices) == 0:
            return "Error: Empty response from API"
            
        return completion.choices[0].message.content
        
    except Exception as e:
        print(f"API Error: {str(e)}")
        if hasattr(e, 'response'):
            print(f"API Response: {e.response.text}")
        return f"Error: {str(e)}"
