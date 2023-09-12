1.Setting app severs
serverless login
cd backend
npm install .
npm update --save
npm audit fix
serverless
serverless deploy --verbose

2. Setting interface app
cd client
npm update --save
npm audit fix --legacy-peer-deps
npm install --save-dev
npm run start
