from flask import Blueprint, request, jsonify
from app.scraper import JobScraper

main = Blueprint('main', __name__)
scraper = JobScraper()

@main.route('/api/analyze2', methods=['POST'])
def analyze_job():
    data = request.get_json()
    url = data.get('url')
    job_post = data.get('job_post')
    has_logo = data.get('has_logo') 
    experience= data.get('experience')
    education= data.get('education')
    employment= data.get('employment')
    hasQuestion= data.get('hasQuestion')

    if not url and not job_post:
        return jsonify({'error': 'Please provide either a URL or job post'}), 400

    try:
        if url:
            job_data = scraper.scrape_job(url=url, has_logo=has_logo , experience=experience, education=education, employment=employment , hasQuestion=hasQuestion)  
        else:
            job_data = scraper.scrape_job(post_text=job_post, has_logo=has_logo, experience=experience, education=education, employment=employment , hasQuestion=hasQuestion)  

        if not job_data:
            return jsonify({'error': 'Failed to extract job data'}), 400

        print("Fraudulent value being returned:", job_data.get("fraudulent"))
        return jsonify(job_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
