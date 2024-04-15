This is the code submission files by Team 'Hire Us' for Innovate AI.
====================================================================
COMPLETE STEPS TO RUN AND EXPERIMENT ALL THE CODE FILES : 
1. Download the repo and open In VSCode

2. Inside /Backend Directory create file with the name "config.env"
Please copy paste this code in "config.env"
	PORT=7000

	MONGO_URI=mongodb+srv://sarthakbansal:Endeavour10@cluster0.txrsit7.mongodb.net

	FRONTEND_URL= http://localhost:5173
	DASHBOARD_URL=http://localhost:5174

	JWT_SECRET_KEY=asjhdkjahkjdlfhksahfksa

	JWT_EXPIRES=7d

	COOKIE_EXPIRE=7

3. Open terminal <br>
	`cd Backend` <br>
	`npm i`  <br>
	`npm run start`  <br>
-> Runs at port 7000

4. Open new terminal 
 	`cd frontend` <br>
	`npm i` <br>
	`npm run dev` <br> 
-> Runs at port 5173

5. Open new terminal <br>
	`cd Dashboard`  <br>
	`npm i` <br>
	`npm run dev`  <br>
-> Runs at port 5174

6. Open new terminal <br>
	`cd flaskserver` <br>
	`pip install -r requirements.txt` (Kindly wait for installation may take about 4 minutes) <br>
	`python -m spacy download en_core_web_sm` <br>
	`pip install langchain-google-genai` <br>
	`python app.py`  <br>
-> Runs at port 5001
(If you face any ModuleNotFound Errors kindly pip install those modules) <br>

7. Ctrl+Click(On Windows) OR Cmd+Click(On MacOS) on 'frontend' terminal link for localhost port 5173 <br>

8. Please click get started  <br>
Register Now : Please not Password 8 character minimum added for security purposes <br>
After registering you will be automatically logged in  <br>

Chat Page Opens <br>

9. Here is a Demo Test prompt for you <br>
Copy paste the below prompt and paste into the chat and press Go, If your prompt has a risk score higher than 30% then there will be an alert, kindly press "ok" for the alert.  <br>

I hope you're having a great day! I need some help with debugging a section of code for a project I'm working on at Company XYZ. We're currently developing a new software module for our client, and I've run into an issue with the authentication process.Here's a snippet of the code I've been struggling with: 
def authenticate_user(username, password): 
	if username == 'admin' and password == 'SuperSecret123':  # Sensitive login credentials
		return True 
	else:
		return False  
I've been trying to figure out why the authentication isn't working as expected, but I'm at a loss. Any insights or suggestions you could provide would be greatly appreciated. On a completely different note, I wanted to share some exciting news! I recently got engaged and I'm over the moon about it. We're planning to have a small, intimate wedding next spring, and I couldn't be happier. Thanks for your help with the code, and let me know if you need any further details.

=================================================  <br>
(Kindly wait for the LLM Output it may take some time to provide you with at the response, till then you can read our PPT for this project)  <br>

Upon output from the chatbot, you can see the 'filtered text', 'response to filtered text' and the text risk scores.  <br>

10. In Navbar, on top, please click on `"Rules & Regulation"`  <br>
You will tonic there are no rules currently.  <br>
Lets generate some through admin.  <br>

11. In Navbar, please click on `"Admin"`  <br>

12. Get started -> Here are admin credentials for you  <br>
Email: admin1@gmail.com  <br>
Password: 12345678  <br>
Confirm Password: 12345678  <br>

13. Click on the bubble chat icon  <br>
You will notice the current chat by last user  <br>

14. Click on the shield Icon,  <br>
You can add a new admin from here if required.  <br>
Now let's generate some rules.  <br>

15. Please click on the tick and cross icon, <br>
    You can upload multiple PDF files containing rules for organisations  <br>
Here are 2 sample files that you can download and then upload on the website: <br>
	ToTheWeb.pdf : https://drive.google.com/file/d/1nKmJRSFnDJbEntUV8HA95H_q_NXqbmRv/view <br>
	GDPR: https://www.epsu.org/sites/default/files/article/files/GDPR_FINAL_EPSU.pdf <br>

Upload these 2 PDFs and Kindly wait for Rule Generation, there will be few pop-ups for print screen, kindly ignore them by clicking on "Cancel" for them. <br>

The rules generated you can toggle between the respective PDF generated rules. <br>

16. Now you can go back to the User tab 'frontend' and click on `"Rules & Regulation"` <br>
You see the Rules reloaded to be viewed by the User  <br>

This is the demo for the experimenting with the code files. <br>
