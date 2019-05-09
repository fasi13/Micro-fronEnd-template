# ForgeWebsite

Admin Tools - Forge Website

## Getting Started 
In order to start with Admin Tools project we require some knowledge and environment setup that will be detailed below

### Required Knowledge
Below is detailed the required knowledge to get start working on a feature of Admin Tools, make sure to review each section.

#### Angular
We are using the latest version of angular and we try to keep that up to date, so we would recommend to review the following links to get introduced to the framework and its cool features

* https://www.typescriptlang.org/docs/home.html ( Angular uses typescript and as a team we enforce the use of it so would suggest to take a quick review over the features/types )
* https://angular.io/tutorial ( If didn't worked with Angular yet, we suggest to make this tutorial, where will provide the required knowledge )
* https://angular.io/docs ( The best place to review any feature )
* https://www.tutorialspoint.com/angular4/

After you review those links, we would suggest to review the docs of angular-cli, since we are using all the amazing features to easily create components, pipes and directives across the application.

* https://angular.io/cli

So now you're ready to start working with Angular!

#### Ngrx(Store and Effects)
Ngrx provies us a way to manage the state of the application in a reactive way, so Ngrx its a redux-based implementation handled by observables of actions to your store. Before you go deeper on Ngrx we suggest to review some core concepts/libs that uses behind the scenes

* https://redux.js.org/ ( Since ngrx is a redux-based implementation, you must review this docs from official redux's site, here you'll find some concepts like middlewares, actions that will be renamed by ngrx implementation )
* https://rxjs-dev.firebaseapp.com/ ( Angular uses rxjs to handle its data between services and the components, but we would suggest to go a bit deeper on some operators like switchMap, forkJoin, tap )

With that core concepts, you'll be able to review the Ngrx docs, but currently we are not using all the ngrx libs, the most important ones that we are using in the project are:

* https://github.com/ngrx/platform/tree/master/modules/store
* https://github.com/ngrx/platform/tree/master/modules/effects (Almost same concept as Redux Middlewares)
* https://ngrx.io/ ( So take a look at some examples from docs )

#### Bootstrap
Our UI is currently using the bootstrap library, but since we are using Angular to develop our component and all that stuff we use another libraries along with that. So before we review that if you didn't worked with bootstrap we would suggest to review the following links

* https://sass-lang.com/guide ( Used for our custom/overwrite styles )
* https://getbootstrap.com/docs/4.1/getting-started/introduction/

Then you can take a look at the ng-bootstrap library, that library provides us an Angular Components using the bootstrap's look and feel. As a suggestion we always try to use ng-bootstrap components.

* https://ng-bootstrap.github.io/#/home

### Environment Setup
In order run the Admin Tools site you'll require packages/programs installed

* Node.js v8.x - https://nodejs.org/es/ (Make sure you get the LTS version)
* [Optional] nvm - https://github.com/creationix/nvm (To easily switch between Node.js versions)
* Angular CLI - https://angular.io/cli
* Git - https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
* IDE for Web Development (I.E VsCode, Submlime Text, WS)

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
* Go to ``localhost:4200``

Along with that we have some enviroment configured with npm scripts. (For more details please see https://angular.io/guide/build#configuring-application-environments)

To run using configured environments:

* Run development server using the qa configuration.
```
npm run start:qa
```
* Run development server using the uat configuration.
```
npm run start:uat
```
* Run development server using the production configuration.
```
npm run start:prod
```

To build using configured environments:

* Build application using the qa configuration.
```
npm run build:qa
```
* Build application using the uat configuration.
```
npm run build:uat
```
* Build application using the production configuration
```
npm run build:prod
```

Al the environments configurations are located under: ``src/environments`` and the npm scrips could be found under: ``package.json``

## Project Structure
The project structure is focused on follow the suggested best practices proposed by the Angular Team along with some custom practices for building scalable Angular Architectures.

The file structure is a module-based arquitecture, where each module should be lazy loaded with a custom loading strategy. The main goal of this structure is to have the specific functionality under each module and the core and shared under their respective module. This file structure can be changed however we need. Below detailed the most important folders

```
website-forge
├── dist/                           # Folder create when run the build scripts
├── e2e/                            # End to end testing folder
├── node_modules/                   # Global Node.js modules
├── src/                            # Source folder of Angular application
│   ├── app/                        
│   │   ├── featureModule1/         # Common feature module (More details under Feature Module section)
│   │   ├── core/                   # Core module (More details under Core Module section)
│   │   ├── shared/                 # Sahred module (More details under Shared Module section)
│   │   ├── app-routing.module.ts   # Main routing module, should have a lazy loaded configuration
│   │   ├── app.component.html      # Main application component
│   │   ├── app.component.scss      # Main application scss file
│   │   ├── app.component.ts        # Main application ts file
│   │   ├── app.module.ts           # Main application module
│   │   └── ng-bootstrap.module.ts  # Bootstrap module imports
│   ├── assets/                     
│   │   ├── fonts                   # Place where is the custom fonts along with font-awesome fonts
│   │   └── img                     # Images used across the application
│   ├── environments/               # Environments configuration folder where is the prod, qa and uat configs
│   ├── imgs/                       # Specific folder for some dynamic resources provided by backend (should not be modified)
│   ├── scss/                       # Stylesheet filed that has its own file structure (More details under Styles section)
│   ├── browserslist                # Css autoprefixer file
│   ├── favicon.ico
│   ├── index.html
│   ├── karma.conf.js
│   ├── main.ts
│   ├── pollyfills.ts               # Enabled pollyfills to support some legacy browsers
│   ├── test.ts
│   ├── tsconfig.app.json           # Specific compiler flags for app
│   ├── tsconfig.spec.json          # Specific compiler flags for tests
│   └── tslint.json                 # Specific compiler flags for app
├── .gitignore
├── angular.json                    # Angular CLI workspace file (more details: https://github.com/angular/angular-cli/wiki/angular-workspace)
├── package.json                    # Node.js dependencies file, place where is the npm scripts
├── tsconfig.json                   # Typescript compiler flags
└── tslint.json                     # TsLint configuration rules      
```

### Core Module
The core module contains code that will be used to instantiate the application and load some core funciontality, so it would be singleton module. Its file structure is detailed below.

```
├── ...
├── core/
│   ├── guards/                     # Guards used across the application
│   ├── interceptors/               # Interceptors used across the application
│   ├── layout/                     # Layout templates used for different states of application I.E Authorized/Unathorized user
│   ├── models/                     # Data models/types of data provided by api
│   ├── services/                   # Singleton services
│   ├── store/                      # Ngrx store files per section
│   ├── core.module.ts              # Core module definition
│   └── index.ts                    # Entry file for js module exports
├── ...
```

### Shared Module
The shared module contains code that will be used across the modules in the applications, we should put commonly used directives, pipes and components into this module and then import just that module whenever we need it. Its file structure is detailed below.

```
├── ...
├── shared/
│   ├── components/                  
│   │   ├── ...
│   │   ├── sidebar/                # Application sidebar component
│   │   ├── splash-screen/          # Splash screen component
│   │   └── ...
│   ├── directives/                 # Directives
│   ├── pipes/                      # Pipes
│   ├── index.ts                    # Entry file for js module exports
│   └── shared.module.ts            # Shared module definition
├── ...
```


### Feature Module
The feature module contains code that will be used inside the module (routing, components) in order to get implemented a new feature/section in the application, it could use some shared component to get that done.

```
├── ...
├── featureModuleA/
│   ├── _guards/                    # Store dispatcher guards
│   ├── featureA1/                  # Small feature(component) that belongs to current module, usually represent a route
│   ├── featureA2/
│   ├── shared/                  
│   │   ├── ...
│   │   ├── shared-component-a/     # Shared component used only on feature module
│   │   ├── shared-component-b/
│   │   └── ...
│   └── featureA.module.ts          # Feature A module definition with its route configuration
├── ...
```

### Styles
The structure of styles in admin tools is a bit different than Angular suggests, because instead of having a scss file per component in the same folder, we created another folder outside the component definition(located under `src/scss`) who has its own structure per module/feature/section in the application that in order to maintain and scale in a easy way.

```
├── ...
├── scss/
│   ├── components/                 # Styles per component/module/feature
│   │   ├── ...
│   │   ├── _autorization.scss       
│   │   ├── _sidebar.scss       
│   │   └── ...
│   ├── _base-styles.scss
│   ├── _base-variables.scss
│   ├── _helpers.scss
│   ├── _mixins.scss
│   ├── _overwrite.scss
│   ├── _scrollbar.scss
│   ├── _table.scss
│   ├── _variables.scss
│   └── index.scss                 # Styles entry file, here should be imported each .scss file. This file is used in Angular.json configuration file
├── ...
```

Along with that we are using BEM for our custom styles. Please see http://getbem.com/introduction/ for more details.

Also for every UI that we implement we have a styleguide that we must follow. Please see http://wiki/display/SS/DESIGN+GUIDE+for+i3+and+the+New+Tools+site