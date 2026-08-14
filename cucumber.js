require('dotenv').config();

module.exports = {
  default: {
    require: ["hooks/**/*.ts", "step-definitions/**/*.ts"],

    requireModule: ["ts-node/register/transpile-only"],

    paths: ["features/**/*.feature"],

    format: ["progress", "html:reports/cucumber-report.html"],

    publishQuiet: true,

    timeout: 30000,
  },
};