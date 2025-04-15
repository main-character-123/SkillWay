# SkillWay

## Description

SkillWay is an academic guidance platform designed to assist students in navigating their educational and career paths. By leveraging advanced technologies, SkillWay offers personalized recommendations, resources, and tools to help users make informed decisions about their academic journeys.

## Features

- **Personalized Recommendations**: Tailors academic and career suggestions based on user profiles and interests.
- **Resource Library**: Provides access to a curated collection of educational materials and tools.
- **Interactive Dashboard**: Offers a user-friendly interface to track progress and manage goals.
- **Community Support**: Facilitates connections with mentors, peers, and professionals for guidance and networking.

## Technologies Used

## 🛠️ Frontend Technologies Breakdown

   **🔧 UI & Styling**
   - **Bootstrap / React-Bootstrap** – For responsive components and layout utilities  
   - **SCSS / SASS** – Advanced styling using variables, nesting, and mixins  
   
   **⚙️ State Management**
   - **React Context API** – For managing global state such as auth 
   
   **🔐 Authentication**
   - **JWT (JSON Web Token)** – Secure token-based login system  
   - **Axios** – For making HTTP requests  
   
   **🌍 Routing & Navigation**
   - **React Router** – For page navigation and protected routes  
   
   **🧪 Form Handling & Validation**
   - **Formik** – For building robust, flexible forms  
   - **Yup** – Schema-based form validation  
   
   **⚡ UX Enhancers**
   - **React Icons** – Easily add SVG icons to your project  
   - **React Toastify / Notistack** – Clean and customizable toast notifications  
   - **Framer Motion** – Modern animations and transitions for components  
   - **React Dropzone** – Drag-and-drop file uploads  
   - **Cropper.js / react-easy-crop** – Image cropping (used in every picture upload)  
   
   **📊 Data Visualization**
   - **Recharts / Chart.js / Victory** – For creating interactive charts in dashboards  
   
   **🧠 Editor Integration**
   - **Tiptap** – Rich-text editor used in the blog section  
 

## 🛠️ Backend Technologies Breakdown

   **🔧 Server & Framework**
   - **Node.js** – JavaScript runtime environment for building scalable server-side applications  
   - **Express.js** – Minimal web framework for Node.js, used for building APIs and handling routing  
   
   **💾 Database & ORM**
   - **MongoDB** – NoSQL database for storing data in a flexible, JSON-like format  
   - **Mongoose** – Object Data Modeling (ODM) library for MongoDB, used to interact with the database  
   
   **🔐 Authentication & Security**
   - **JWT (JSON Web Token)** – Secure token-based authentication system  
   - **Bcrypt.js** – For hashing passwords securely  
   - **Helmet.js** – Adds security-related HTTP headers to protect the app from known web vulnerabilities  
   - **Cors** – Middleware for enabling Cross-Origin Resource Sharing, allowing or restricting requests from different origins  
   
   **🌍 API & HTTP**
   - **RESTful API** – Architecture style for designing networked applications, used to handle HTTP requests  
   - **Axios (Backend)** – Used for making HTTP requests from the server, if applicable  
   
   **🧪 Testing**
   - **Jest** – JavaScript testing framework, useful for unit and integration tests  
   - **Supertest** – For testing HTTP requests and responses in Node.js apps  
   - **Mocha & Chai** – Alternative testing libraries for writing and running tests  
   
   **🛠️ Dev Tools & Utilities**
   - **Nodemon** – Utility that automatically restarts the server during development when file changes are detected  
   - **dotenv** – For loading environment variables from a `.env` file into `process.env`  
   - **Morgan** – HTTP request logger middleware for Node.js  
   
   **🧑‍💻 Deployment & Hosting support**
   - **Heroku** – Platform as a service (PaaS) for deploying web applications  
   - **AWS / DigitalOcean / Vercel** – Cloud service providers for hosting and deploying applications  
   
   **📈 Logging & Monitoring**
   - **Winston** – Logger for capturing and storing log information  
   - **Morgan (Backend)** – HTTP request logging for monitoring API calls  
   
   **🧠 Machine Learning & Data Processing**
   - **Python** – For advanced data processing or running machine learning models  
   - **TensorFlow.js** – If machine learning is implemented directly within the Node.js environment


## 🛠️ Model & Data Technologies Breakdown

   **💡 Model & Machine Learning Frameworks**
   - **Python** – Programming language commonly used for machine learning and data science tasks  
   - **Jupyter Notebooks** – Interactive environment for writing and running Python code, often used for prototyping and experimenting with models  
   - **Pandas** – Library for data manipulation and analysis, used for handling large datasets  
   - **NumPy** – Core library for numerical computing, widely used for array-based data operations  
   - **Scikit-learn** – Simple and efficient tools for data mining and data analysis, often used for building machine learning models  
   - **TensorFlow / Keras** – Deep learning libraries (if used for complex model training or neural networks)  
   
   **📊 Data Preprocessing & Visualization**
   - **Matplotlib** – Library for creating static, interactive, and animated visualizations in Python  
   - **Seaborn** – Python data visualization library based on Matplotlib, offering more attractive and informative graphics  
   - **Plotly** – Interactive graphing library (used for interactive visualizations)  
   - **SciPy** – Library for advanced mathematical functions, often used for optimization and scientific computations  
   
   **🚀 Model Deployment & Integration**
   - **Flask / FastAPI** – Lightweight web frameworks for building APIs to serve machine learning models as services  


## Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/main-character-123/SkillWay.git
   ```

2. **Navigate to the project folder**:
   
   ```bash
   cd SkillWay
   ```

3. **Install frontend dependencies**:

   ```bash
   cd front-end
   npm install
   ```

4. **install backend dependencies**:

   ```bash
   cd ../BackEnd
   npm install
   ```
   
5. **install ML Model dependencies**:

   ```bash
   cd ../super CV MODEL
   python -m venv venv
   ```
   ```bash
   .\venv\Scripts\activate
   ```
   ```bash
   pip install -r requirements.txt
   ```
   

6. **Start the development servers**:
   
   - Frontend:
     
   ```bash
   npm start
   ```
   
   - Backend:
     
   ```bash
   npm start
   ```
   
   - ML:
     
   ```bash
   python app.py
   ```

## Folder Structure

- `BackEnd/`: Contains the backend server code, including API routes and database models.
- `front-end/`: Houses the frontend React application.
- `super CV MODEL/`: Includes Jupyter Notebooks and machine learning models for recommendations.
- `README.md`: Project documentation.

## Contact

For inquiries or support, please contact the development team at:  
📧 [academicguidancee@gmail.com](mailto:academicguidancee@gmail.com)


