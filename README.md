# TODO

## Bugs

- Manche Speisen haben, obwohl es die gleiche Speise ist, unterschiedliche IDs
- ~~EntfernungsIcon wird beim zweiten mal laden angezeigt bzw nicht angezeig~~ schneint gefixed zu sein
- BottomNavigation ist manchmal breiter als es sein sollte (Home und Einstellungen kleiner als die anderen Tabs [bei iPhone 6/7/8])
- SpeiseCard füllt teilweise nicht 100% des Bereichs aus

## Design überarbeiten

- Logo überarbeiten? 

## Service Worker 

- ~~Caching Strategien für Offline Funktionalität, was eigentlich sinnlos ist~~
- ~~Bei App.js ne MUI Snackbar über der BottomNavigation anheften, wenn keine Verbindung zum Internet besteht~~
- Implementierung des Benachrichtigungsservice -->

## Benachrichtigungen

- Benachrichtigungen ~~ausgewählter~~ aller Speisen für MyMensa (+ Favourite Mensen) hinzufügen
  - jeden Tag pullen...? 
- ~~Page erstellen Verlinkung über Einstellungen -> Lieblingsspeisen -> Speise~~
  Actually keine eigene Page dafür. Wir machen einfach eine Selection für Lieblingsspeisen-Benachrichtigung On/Off, die für alle gilt
- Datenbankeintrag um Benachrichtigungseinstellungen zu speichern...?


## Getter und Setter für Datenbankeinträge

- vielleicht noch letzte 10 Mensen für SearchPage
  


<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="https://www.gstatic.com/firebasejs/8.3.1/firebase-analytics.js"></script>

<script>
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyAMplnJJrND-lej_kfNqxjl8P--Kzout4I",
    authDomain: "menza-d5177.firebaseapp.com",
    projectId: "menza-d5177",
    storageBucket: "menza-d5177.appspot.com",
    messagingSenderId: "239329027194",
    appId: "1:239329027194:web:45604edd3803e20e8fc7c3",
    measurementId: "G-4MG48GZT1L"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
</script>






&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;


# Stock Text

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Running on Repl.it

Simply hit run once and start coding. Will hot reload the web view. 

## Running Scripts

You can open a new shell window by hitting command+shift+S on macOS or control+shift+S (you can also access shortcuts from the `?` in the bottom right corner).

When in the shell you can run any of the following scripts:

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
