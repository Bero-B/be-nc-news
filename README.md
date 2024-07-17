# Northcoders News API
You can find the hosted APIs for this project here: https://nc-news-7fn6.onrender.com 

The endpoint '/api' will give you an overview of all the available endpoints you can use and the queries that certain endpoints accept. 

This is a project for a news website called NC News. 

If you wish to clone the repo, do the following:
1. Click the <Code> button and copy the HTTPS URL of the repo
2. Open your terminal and run the command 'git clone <HTTPS address>' - paste the URL of the repo copied in the previous step
3. Once you open the repo in your code editor, follow the below steps to install the required dependencies:
    - run command 'npm install express' 
    - run command 'npm install pg'
    - run command 'npm install pg-format'
4. Next, run the command 'npm run setup-dbs' to create the databases on your local machine
5. To create the tables inside the databases, run the command 'npm run seed'
6. In order to connect the two databases locally, you will need to create two .env files, namely: .env.test and .env.development. To do so:
    - run 'npm install dotenv --save' in the command line and create the two files mentioned above.
    - Once created, inside the '.env.test' file type in 'PGDATABASE=<name of test database>' and inside the '.env.development' file type in 'PGDATABASE=<name of development database>' - you can get the names of the databases from the 'setup.sql' file inside the 'db' folder.
    - Add the two .env files created above to a .gitignore file

If you wish to run the app.test.js file to run the tests inside it, follow the below steps:
1. Run the command 'npm install --save-dev jest'
2. Next, run the command 'npm install supertest'
3. Finally, run the command 'npm install jest-sorted'
4. To run the tests inside the app.test.js file, run the command 'npm test app.test.js' - this will set up your node environment to test and will run the tests against the test database. This will ensure that the development database is not getting affected by the tests.

The minimum version of Node.js required to run this project is 12.0.0 and the minimum version of Postgres needed is 9.5.