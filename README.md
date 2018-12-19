# Summary
Perfrom insertion sort over a large set of numbers e.g 100k in web worker
Additionally, while sorting the UI thread sends a random number to web worker every x ms, this is to be added to sort. Currently specified using the input field in the UI. Default set to 1000ms. Can be any number. No random number is dropped or missed by sorting mechanism.

### Performance can be seen in console.
- Sorting first iteration of random numbers e.g 100k ~5s
- Successive sorting after first sort is completed is around ~300-400ms

### Deployed on: https://awesome-web-worker.herokuapp.com/

### Build Process
1. npm install
2. To run server: npm run start
3. To build dev: npm run build:dev
4. To build prod: npm run build:prod
