🚀 Web Server Setup for Unity Builds
====================================

This project provides a simple web server to run Unity builds in the browser using Node.js and Express. The server serves the Unity build files and automatically opens the browser to the homepage.

🔧 Prerequisites
----------------

Make sure you have the following installed:

*   [Node.js](https://nodejs.org/) (version 14 or higher)
    
*   [Unity](https://unity.com/) with WebGL build support
    

📝 Setup Instructions
---------------------

1.  Clone the repository to your computer ```git clone https://github.com/your-username/repository-name.gitcd repository-name```
    
2.  Navigate to the project folder and install the dependencies ```npm install```
    
3.  **Add the Unity Build**
    
    *   Open your Unity project and create a WebGL build.
        
    *   After the build is created, copy the Builds/Web/Server/app folder into your project folder (where the index.js file is located).
        
4.  Now, you can start the development server. Run ```start-server.bat``` index.js. The server will start, and you'll see a message in the console with the address. The browser will open automatically with the server URL.
    
5.  After starting the server, open the browser and visit the following ```http://localhost:1000``` The game should load directly in the browser!
    

⚠️ Common Issues
----------------

*   **Port in use**: If port 1000 is already being used by another process, the server will automatically try to open on another port. Alternatively, the server can ask if you'd like to try a different port or close the previous process.
    

🔄 Contributing
---------------

Feel free to open **issues** and **pull requests** if you'd like to contribute to the project! We appreciate any contributions.
