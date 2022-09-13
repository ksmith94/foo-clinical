# FooClinical
FooClinical (fooclinical.com) is a sample EHR-like application using Medplum. It demonstrates the ease with which an EHR application can be built by using Medplum. It was built using Medplum App and Medplum UI React Componenets. Medplum is a developer platform for medical apps.

## Table of Contents
- [Getting Started](#getting-started)
- [Running App Locally](#running-app-locally)
- [Testing](#testing)
- [Running App to Vercel](#running-app-to-vercel) (Optional)
- [Setting Up SonarSource](#setting-up-sonarsource) (Optional)

## Getting Started
First, you will need to fork and clone the repo from Github. Once this is complete, execute the below command in your terminal to install the necessary packages.

```javascript
npm install
```

## Running App Locally
To run the app on a local host, execute the below command in your terminal.

```javascript
npm run dev
```

This app should run on `http://localhost:3000/`

## Testing
To run tests, execute either of the below command in your terminal:
```
npm run test
```
or
```
npm t
```
This will run all tests in your repo. Tests for FooClinical are run using Jest and Testing Library for React. 

** Note** 
If you want to use `@testing-library/jest-dom` matchers (for example, `toHaveClass` or `toBeInTheDocument`), there is an additional step that needs to be taken. This is already installed, but needs additional configuration. 

If you do not already have one, create a `jest.config.json` file and add the below to it.
```javascript
{
    "testEnvironment": "jsdom",
    "transform": {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    },
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    "moduleNameMapper": {
        "\\.css$": "identity-obj-proxy"
    },
    "testMatch": [
        "**/src/**/*.test.ts",
        "**/src/**/*.test.tsx"
    ],
    "setupFilesAfterEnv": [
        "./src/test.setup.ts"
    ],
    "coverageDirectory": "coverage",
    "coverageReporters": [
        "lcov",
        "json",
        "text"
    ],
    "collectCoverageFrom": [
        "**/src/**/*"
    ]
}
```
Additionally, you will need to add a `test.setup.ts` file if you do not already have one. Add the below to the file: 
```javascript
import '@testing-library/jest-dom';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
```
Once this is done, your configuration is ready, but `identity-obj-proxy` will still need to be installed so that jest knows to ignore any css files you may have. To install run the following in your console:
```javascript
npm install --save-dev identity-obj-proxy
```
Your testing environment should now be set up!

## Running App to Vercel
We will be using Vercel to set up a build view of the application. Go to `vercel.com`, where you will need to create an account if you do not already have one. 

Once you have an account, click on the `+ New Project` button. Choose the `foo-clinical` repository from the drop down. It should appear in your list. 

Click on the `Import` button, which will bring you to a new page where you can change details of your project. Change your name to whatever you would like. Your framework preset should be set to `Vite` as a default, but please select that if it is not. Everything else can be left as its default. Click on the `Deploy` button. 

Vercel should now start deploying your application. This may take a few minutes, but once it is finished click the `Go to Dashboard` button. This will bring you to the dashboard, where you can see previews or visit the domain generated for your website.


## Setting Up SonarSource
SonarCloud is a service that will automatically check your code for bugs, and security issues. To implement it, go to `sonarcloud.io`. You will need to create an account if you do not already have one. Additionally, prior to proceeding, add a file to your project titled `sonar-project.properties`. This can be left empty for now.

Once your account is created, click on the `Analyze new project` button, then the `Import new organization from Github` button. You will then need to choose your Github organization that you forked `foo-clinical` to. Your forked repo will need to be public so that you can access the free version of SonarCloud for open source projects. In the `Repository Access` section, select `only select repositories` and choose `foo-clinical`. Click `save`.

Create a new SonarCloud organization to import your repository to. The only necessary field is to give it a new name. Click `Continue`. Choose the free plan, and click `Create Organization`.

On the next page, choose your repo and click the `Set Up` button. This should begin the analysis of your project, which may take a minute. Once your analysis is available, hover over `Administration` in the menu on the left hand side of the screen and select `New Code`. Here you can select how often your code is analyzed. `Previous Version` is recommended. 

Once this is complete, SonarSource will be set up, but coverage data will still need to be added. On you SonarCloud page, hover over `Administration` and click on `Analysis Method`. Click `Follow the Tutorial` for Github Actions, and follow the provided tutorial.

When you have finished the tutorial, there is still a bit of work to do. You will need to add coverage to your build process. In your `.github/workflows/build.yml` file, under `steps`, add the below:
```javascrip
- name: Install dependencies
   run: yarn
- name: Test and coverage
   run: yarn jest --coverage
```
If you find yourself running into any issues, there are detailed instructions here: `https://docs.sonarcloud.io/enriching/test-coverage/javascript-typescript-test-coverage/`.

## FAQ
- Using `@testing-library/jest-dom`