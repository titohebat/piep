### Dependencies
```
npm init
npm install pg
npm install admin-lte@^3.2 --save
npm install tabulator-tables --save
npm install --save @fortawesome/fontawesome-free
npm install sweetalert2
npm install --save express body-parser
```
### Run Script
node index

### Run at GCloud
create file app.yaml  
make sure has this script `"start": "node index.js"` in package.json. example below :
```
"scripts": {
    "start": "node index.js",
  },
```
cd piep  
~/piep $ gcloud app deploy app.yaml
