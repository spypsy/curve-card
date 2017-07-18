# curve-card
A simple webview that connects to an API which mocks online cards with balances and transactions with a merchant.
The merchant and card user have different APIs to resemble reality. When acting as the merchant, you'll need to click on "Update Card" to see the differences reflected in the card balance.

This boilerplate was used to set the project up: https://github.com/spypsy/spyroplate

A high-level overview of packages used:
- [yarn](https://yarnpkg.com/en/) for package management
- [express](https://expressjs.com) for the NodeJS API
- [React](https://facebook.github.io/react/) for the front end
- [webpack](https://webpack.js.org/) to transpile JS && CSS
- [LESS](http://lesscss.org/) for styles

## Run Locally
To run locally, clone the repo: `https://github.com/spypsy/curve-card`
Then run: `yarn` to install all packages.
then:
```
yarn build
yarn start
```

*NOTE*: You'll need a to be running a local version of mongoDB in the background


