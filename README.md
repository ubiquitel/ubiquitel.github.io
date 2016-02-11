## Ubiquitel website dev environment setup instructions
1. Install Node.js, this project is dependent on v4.2.3 LTS as of February 7, 2016.
You can find a link to download the package through this url:  
https://nodejs.org

2. Clone the repository to your local. Run this command below on your terminal.  
`git clone https://github.com/ubiquitel/ubiquitel.github.io.git`   
You may be required to input your github account credential.

3. Change directory to your local repository. As default you should be in your user folder. In that case, just  
`cd ubiquitel.github.io.git`

4. Install gulp globally with the command below.
`npm install gulp -g`
If you are a Mac user, you may need to root access permission. If so you can alternatively run this command.
`sudo npm install gulp -g`

5. `npm install`  
on your terminal to install all node module dependencies.

6. `gulp dev`
on your terminal to start gulp task for development.  
Input `localhost:5000` in your browser.
