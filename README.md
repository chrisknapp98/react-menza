# Menza 

Dieses Projekt wurde im Rahmen der Lehrveranstaltung Programmierung mobiler Anwendungen bei Alexander Barge und Matthias Koslowski bearbeitet.
Wir sind Gruppe 06 bestehend aus:

- Anne Schatz
- Patrick Pister
- Christopher Knapp

Es wurde mit den Frameworks React.js, Material-UI gearbeitet.
Alle Daten über Mensa und Speisen werden von der OpenMensa API gezogen.
Beim ersten Start werden jedoch alle Mensen der API in dem ObjectStore bzw. der Tabelle `mensaDB` in indexedDB gepeichert und diese wird dann für alle weiteren Aktivitäten im Bezug auf Mensen verwendet.
Benutzereinstellungen wie 'Meine Mensa', 'Lieblingsmensen' und 'Lieblingsspeisen' werden im ObjectStore `userPreferences` in ihren jeweiligen Tabellen gespeichert.


## Benachrichtigungen
Benachrichtigungen sind leider nicht ganz funktional.
Unser Plan war ursprünglich jeden Tag um 11 Uhr morgens eine Benachrichtigung rauszuschicken, falls eine der gespeicherten Lieblingsspeisen in 'Meiner Mensa' verfügbar ist.
Zunächst war die Ueberlegung einfach mit setInterval zu arbeiten, was aber keine allzu gute Idee ist. Für kurze Intervalle hat das auch funktioniert aber für längere dürfte es Probleme geben, da der ServiceWorker ja nicht ewig am laufen gehalten werden kann. 
Und dazu kam noch wie beachten wir die Nutzereinstellungen bezüglich Benachrichtigungen. Man hat ja im ServiceWorker keinen Zugriif auf localStorage.
Also müsste man einen EventListener für 'message' machen und basierend darauf Benachrichtigungen aktivieren/deaktivieren? 
periodicSync haben wir auch erfolglos ausprobiert. Hatten jedoch dann mit mehr Aufwand dasselbe Problem mit den Einstellungen.

Die beste Loesung wäre wohl bspw. einen Firebase Server aufzusetzen und deren Notifications zu abonnieren. Dann gibt es jedoch das Problem: 
Woher weiss der Firebase Server welches 'Meine Mensa' und was 'Meine Lieblingsspeisen' sind. 
Dann müsste man jedes mal den Notification service mit den neuen Einstellungen abonnieren. Also dann warum nicht gleich deren Datenbank nutzen...
Firebase hätte wohl wirklich den Rahmen gesprengt.


## Bugs

- Manche Speisen haben, obwohl es die gleiche Speise ist, unterschiedliche IDs
- BottomNavigation ist manchmal breiter als es sein sollte (Home und Einstellungen kleiner als die anderen Tabs [bei iPhone 6/7/8])


  

&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;


# Repl.it Text

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
