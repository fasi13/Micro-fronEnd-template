# Micro Front End Template

Template - Micro Front End

## Getting Started

In order to start with Micro Front End Template project we require some knowledge and environment setup that will be detailed below

### Required Knowledge

Below is detailed the required knowledge to get start working on a feature of This Template, make sure to review each section.

#### React

We are using the latest version of react and we try to keep that up to date, so we would recommend to review the following links to get introduced to the framework and its cool features

* <https://www.typescriptlang.org/docs/home.html> ( React uses javascript and typescript and as a team we enforce the use of typescript. it so would suggest to take a quick review over the features/types )
* <https://reactjs.org/tutorial/tutorial.html> ( If didn't worked with React yet, we suggest to make this tutorial, where will provide the required knowledge )
* <https://reactjs.org/docs/getting-started.html> ( The best place to review any feature )
* <https://www.youtube.com/watch?v=j942wKiXFu8&list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d>

So now you're ready to start working with React!

#### Zustand (Store and Effects)

Zustand provides us a way to manage the state of the application in a reactive way, so Zustand A small, fast and scalable bearbones state-management solution using simplified flux principles. Has a comfy api based on hooks, isn't boilerplatey or opinionated.Before you go deeper on Zustand we suggest to review some core concepts/libs that uses behind the scenes

* <https://github.com/pmndrs/zustand> ( You must review this docs from official Zustand's site, here you'll find some concepts like observable, action and computed )

With that core concepts, you'll be able to review the Zustand docs, the most important ones that we are using in the project are:

* <https://github.com/pmndrs/zustand>
* <https://dev.to/aaronksaunders/managing-react-state-with-zustand-2e8k>
### Environment Setup

In order run the Admin Tools site you'll require packages/programs installed

* Node.js v14.x - <https://nodejs.org/en/> (Make sure you get the LTS version)
* [Optional] nvm - <https://github.com/creationix/nvm> (To easily switch between Node.js versions)
* Git - <https://git-scm.com/book/en/v2/Getting-Started-Installing-Git>
* IDE for Web Development (I.E VsCode, Sublime Text, WS)

### Run Development Server

In order to start the development server, execute the following steps:

* Go to project root and install the dependencies using npm:

```
npm install
```

* Start the development server:

```
npm start
```

* Go to [localhost:3000](http://localhost:3000)

Along with that we have some environment configured with npm scripts. (For more details please see <https://create-react-app.dev/docs/adding-custom-environment-variables/>)

To build using configured environments:

* Build application using the qa configuration.

```
npm run build:qa
```

* Build application using the dev configuration.

```
npm run build:dev
```

* Stage application using the staging configuration.

```
npm run build:staging
```

* Build application using the production configuration

```
npm run build:prod
```

All the environments configurations are located under: ``.env-cmdrc`` and the npm scripts could be found under: ``package.json``

## Project Structure

The project structure is focused on follow the suggested best practices proposed by the React Team along with some custom practices for building scalable React Architectures.

This file structure can be changed however we need. Below detailed the most important folders

```
cxs.admin
├── dist/                           # Folder created when the project builds
├── public/                         # public folder static files for the website
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── node_modules/                   # Global Node.js modules
├──src/
│  ├── App.css                      # Css style for App component
│  ├── App.test.tsx                 # Test file for App component
│  ├── App.tsx                      # App component
│  ├── index.css                    # Css style for global styling
│  ├── index.tsx                    # Root component for cxs.admin project
│  ├── logo.svg                     # Svg logo asset file
│  ├── react-app-env.d.ts
│  ├── reportWebVitals.ts           # Modular library for measuring all the Web Vitals metrics
│  └── setupTests.ts                # Jest testing library setup
├── .editorConfig                   # Editor configuration
├── .env-cmdrc                      # Environments settings
├── .eslintrc.json                  # Configuration file for eslint rules
├── .gitignore
├── .prettierrc                     # Configuration file for prettier
├── package-lock.json
├── package.json                    # Node.js dependencies file, place where is the npm scripts
├── readme.md
├── tailwind.config.js              # Configuration file for tailwindcss
└── tsconfig.json                   # Typescript compiler flags

```
