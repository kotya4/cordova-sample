# Graphics

## To see also:

https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter

## To know:

From sources:
https://stackoverflow.com/a/11915204

Using single canvas instead of multiple (i.e. for updating certain layer of screen) is prefferable.

## Resourses:

All the (third-party) resources are contained in `www/resources/`, each package exists with file `source.txt` containing link to the page where package was stolen. All packages are distributed as-is, might be shrinked to reduce amount of unused files but all the meta information such as readme files are stay untouched.

# Setting up Cordova

## To see also:

https://cordova.apache.org/docs/en/11.x/core/features/splashscreen/index.html

https://cordova.apache.org/docs/en/latest/config_ref/images.html

https://cordova.apache.org/plugins/

## Summary:

Install npm: `sudo apt install npm`. Then cordova with `npm install -g cordova` with global modificator, install Android Studio, this will automaticly install gradle and jdk. If not, install yourself. For cordova-android@10.X.X (target 30-22) do not use jdk higher than 15, and 8 for cordova-android@8.X.X (target 28-19). Set up environment variables as descibed in offitial documentation. Ready to go.

`cordova`

<details>
<summary>Synopsis</summary>

```
    cordova command [options]

Global Commands
    create ............................. Create a project
    help ............................... Get help for a command
    telemetry .......................... Turn telemetry collection on or off
    config ............................. Set, get, delete, edit, and list global cordova options

Project Commands
    info ............................... Generate project information
    requirements ....................... Checks and print out all the requirements
                                            for platforms specified

    platform ........................... Manage project platforms
    plugin ............................. Manage project plugins

    prepare ............................ Copy files into platform(s) for building
    compile ............................ Build platform(s)
    clean .............................. Cleanup project from build artifacts

    run ................................ Run project
                                            (including prepare && compile)
    serve .............................. Run project with a local webserver
                                            (including prepare)

Learn more about command options using 'cordova help <command>'

Aliases
    build -> cordova prepare && cordova compile
    emulate -> cordova run --emulator

Options
    -v, --version ...................... prints out this utility's version
    -d, --verbose ...................... debug mode produces verbose log output for all activity,
    --no-update-notifier ............... disables check for CLI updates
    --nohooks .......................... suppress executing hooks
                                         (taking RegExp hook patterns as parameters)

Examples
    cordova create myApp org.apache.cordova.myApp myApp
    cordova plugin add cordova-plugin-camera
    cordova platform add android
    cordova plugin add cordova-plugin-camera --nosave
    cordova platform add android --nosave
    cordova requirements android
    cordova build android --verbose
    cordova run android
    cordova build android --release -- --keystore="..\android.keystore" --storePassword=android --alias=mykey
    cordova config ls
```

</details>
<br>

I am creating specific cordova project named "gangway" for platform android target 19+ (Android 5.0 Lolipop) now.

From sources:
https://cordova.apache.org/docs/en/11.x/guide/platforms/android/index.html

Prepared: Android Studio, Gradle, jdk, npm, cordova

OS: ubuntu

From sources:
https://cordova.apache.org/docs/en/11.x/guide/cli/

`cordova create gangway com.sluchaynayakotya.gangway Gangway`
```
Creating a new cordova project.
```

`cd gangway           # project contained here`

`cordova platform     # before platform was added`
```
Installed platforms:

Available platforms:
  android ^10.1.1
  browser ^6.0.0
  electron ^3.0.0
```

<details>
<summary>Me installing wrong cordova-android version (skip)</summary>

`cordova platform add android`
```
Using cordova-fetch for cordova-android@^10.1.1
Adding android project...
Creating Cordova project for the Android platform:
	Path: platforms/android
	Package: com.sluchaynayakotya.gangway
	Name: Gangway
	Activity: MainActivity
	Android target: android-30
Subproject Path: CordovaLib
Subproject Path: app
Android project created with cordova-android@10.1.2
```

`cordova platform ls`
```
Installed platforms:
  android 10.1.2
Available platforms:
  browser ^6.0.0
  electron ^3.0.0
```

From sources:
https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html

```
cordova-android Version (current)   10.X.X
Supported Android API-Levels        22 - 30
Equivalent Android Version          5.1 - 11.0.0
```

`sdkmanager "platforms;android-30"`
```
Packages to install: - Sources for Android 30 (sources;android-30) [ which is Android 11.0 (R) ]
```

I use Android Studio for that. If using Android Studio then check only "Android SDK Platform 30" checkbox.

<details>
<summary>Me trying to use older target (fail)</summary>

Run instead:

`sdkmanager "platforms;android-22"`
```
Packages to install: - Sources for Android 22 (sources;android-22) [ which is Android 5.1 (Lolipop) ]
```

Now I experiensing
```
Android target: not installed
Please install the Android SDK Platform "platforms;android-30"
```
using command `cordova requirements`. I want specific platform to be used (android-22), not suggested by cordova itself.

From sources:
https://stackoverflow.com/a/33000822
https://stackoverflow.com/questions/29542008/changing-the-android-target-of-a-cordova-project#comment47408281_29543385
https://stackoverflow.com/a/32672214
https://stackoverflow.com/a/30029371

Variants:
  1. remove android platform via `cordova platform rm android`, then install platform using current target version I need ( `cordova platform add android@4.1.0` );
  2. make changes in `platforms/android/project.properties` and `platforms/android/CordovaLib/project.properties`, additionally in file `platfomrs/android/AndroidManifest.xml` (which is not exist in my case);
  3. install specific cordova version using target I need by default.

Results:
  1. `cordova platform update android@4.1.0` or `cordova platform add android@4.1.0` giving
```
The package at "/home/USER/cordova/gangway/node_modules/cordova-android" does not appear to implement the Cordova Platform API.
Error: Package name must look like: com.company.Name
```
  2. does nothing;
  3. do not want.

Also experimenting with first variant fricked up JAVA_HOME variable lol.

So the solution is to install required target and chill.

-------------------

</details>
<br>

`cordova requirements`
```
Requirements check results for android:
Java JDK: installed 17.0.5
Android SDK: installed true
Android target: installed android-33,android-32,android-30,android-22,android-15,Google Inc.:Google APIs:15
Gradle: installed /home/USER/Programs/gradle-7.5.1/bin/gradle
```

If `Android SDK: not installed` then check `ANDROID_SDK_ROOT` variable, path must be global. Checkout ~/.bashrc for given variables (or /etc/profile ?), save via `source ~/.bashrc`.
F.e. `~/Android/Sdk` should become `/home/USER/Android/Sdk`.
Same for `Gradle: not installed` message.

`less ~/.bashrc`
```
GRADLE_HOME="/home/USER/Programs/gradle-7.5.1/bin"
export PATH="$GRADLE_HOME:$PATH"
export JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
export ANDROID_SDK_ROOT="/home/USER/Android/Sdk"
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools/
export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator/
export PATH=$PATH:$ANDROID_SDK_ROOT/build-tools/
```

Ensure that `java-17-openjdk-amd64` is wrong and causes errors shown below.

`cordova build`

<details>
<summary>Unsupported class file major version 61</summary>

```
Checking Java JDK and Android SDK versions
ANDROID_SDK_ROOT=/home/USER/Android/Sdk (recommended setting)
ANDROID_HOME=undefined (DEPRECATED)
Using Android SDK: /home/USER/Android/Sdk
Starting a Gradle Daemon (subsequent builds will be faster)

Deprecated Gradle features were used in this build, making it incompatible with Gradle 8.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

See https://docs.gradle.org/7.5.1/userguide/command_line_interface.html#sec:command_line_warnings

BUILD SUCCESSFUL in 31s
1 actionable task: 1 executed
Subproject Path: CordovaLib
Subproject Path: app
Downloading https://services.gradle.org/distributions/gradle-7.1.1-all.zip
..............10%...............20%...............30%...............40%..............50%...............60%...............70%...............80%..............90%...............100%

Welcome to Gradle 7.1.1!

Here are the highlights of this release:
 - Faster incremental Java compilation
 - Easier source set configuration in the Kotlin DSL

For more details see https://docs.gradle.org/7.1.1/release-notes.html

Starting a Gradle Daemon (subsequent builds will be faster)

FAILURE: Build failed with an exception.

* Where:
Settings file '/home/USER/cordova/gangway/platforms/android/settings.gradle'

* What went wrong:
Could not compile settings file '/home/USER/cordova/gangway/platforms/android/settings.gradle'.
> startup failed:
  General error during conversion: Unsupported class file major version 61

...

BUILD FAILED in 4m 55s
Command failed with exit code 1: /home/USER/cordova/gangway/platforms/android/gradlew cdvBuildDebug -b /home/USER/cordova/gangway/platforms/android/build.gradle
```

Solution:

From sources:
https://stackoverflow.com/a/70621309

Add `org.gradle.java.home=/usr/lib/jvm/java-16-openjdk-amd64` in file `/home/USER/cordova/gangway/platforms/android/gradle.properties`.

Ensure that `java-16-openjdk-amd64` is wrong and causes errors shown below.

-------------------

</details>
<br>

<details>
<summary>processDebugMainManifest FAILED</summary>

Using gradle-7.1.1 gives nothing.

Result after using `org.gradle.java.home=/usr/lib/jvm/java-16-openjdk-amd64`:
```
Checking Java JDK and Android SDK versions
ANDROID_SDK_ROOT=/home/USER/Android/Sdk (recommended setting)
ANDROID_HOME=undefined (DEPRECATED)
Using Android SDK: /home/USER/Android/Sdk
Subproject Path: CordovaLib
Subproject Path: app
Starting a Gradle Daemon, 1 incompatible Daemon could not be reused, use --status for details
Warning: Mapping new ns http://schemas.android.com/repository/android/common/02 to old ns http://schemas.android.com/repository/android/common/01

...

Warning: unexpected element (uri:"", local:"base-extension"). Expected elements are <{}codename>,<{}layoutlib>,<{}api-level>
> Task :app:processDebugMainManifest FAILED

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:processDebugMainManifest'.
> Unable to make field private final java.lang.String java.io.File.path accessible: module java.base does not "opens java.io" to unnamed module @5cbd3c8a

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

Deprecated Gradle features were used in this build, making it incompatible with Gradle 8.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

See https://docs.gradle.org/7.1.1/userguide/command_line_interface.html#sec:command_line_warnings

BUILD FAILED in 6m 49s
16 actionable tasks: 16 executed
Command failed with exit code 1: /home/USER/cordova/gangway/platforms/android/gradlew cdvBuildDebug -b /home/USER/cordova/gangway/platforms/android/build.gradle
```

Solution:

From sources:
https://stackoverflow.com/a/70563876

Use jdk-15

-------------------

</details>
<br>

```
Checking Java JDK and Android SDK versions
ANDROID_SDK_ROOT=/home/USER/Android/Sdk (recommended setting)
ANDROID_HOME=undefined (DEPRECATED)
Using Android SDK: /home/USER/Android/Sdk
Subproject Path: CordovaLib
Subproject Path: app
Starting a Gradle Daemon, 2 incompatible Daemons could not be reused, use --status for details
Warning: Mapping new ns http://schemas.android.com/repository/android/common/02 to old ns http://schemas.android.com/repository/android/common/01

...

Warning: unexpected element (uri:"", local:"base-extension"). Expected elements are <{}codename>,<{}layoutlib>,<{}api-level>

> Task :CordovaLib:compileDebugJavaWithJavac
Note: Some input files use or override a deprecated API.
Note: Recompile with -Xlint:deprecation for details.

Deprecated Gradle features were used in this build, making it incompatible with Gradle 8.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

See https://docs.gradle.org/7.1.1/userguide/command_line_interface.html#sec:command_line_warnings

BUILD SUCCESSFUL in 1m 37s
48 actionable tasks: 33 executed, 15 up-to-date
Built the following apk(s):
        /home/USER/cordova/gangway/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

Good!

Ok, but my machine has Android 5.0 so min target must be android-19, and current target has to be android-28 according to cordova-android@8.1.0.

So I must do this all over again...

`cordova platforms rm android`
```
Removing android from cordova.platforms array in package.json
```

-------------------

</details>
<br>

From sources:
https://cordova.apache.org/announcements/2019/09/17/cordova-android-release-8.1.0.html

`cordova platforms add android@8.1.0`
```
Using cordova-fetch for cordova-android@8.1.0
Adding android project...
Creating Cordova project for the Android platform:
	Path: platforms/android
	Package: com.sluchaynayakotya.gangway
	Name: Gangway
	Activity: MainActivity
	Android target: android-28
Subproject Path: CordovaLib
Subproject Path: app
Android project created with cordova-android@8.1.0
```

`cordova requirements`

<details>
<summary>Requirements check results</summary>

```
Requirements check results for android:
Java JDK: installed 17.0.5
Android SDK: not installed
Failed to find 'ANDROID_HOME' environment variable. Try setting it manually.
Detected 'avdmanager' command at /home/USER/Android/Sdk/cmdline-tools/latest/bin but no 'tools/bin' directory found near.
Try reinstall Android SDK or update your PATH to include valid path to SDK/tools/bin directory.
Android target: not installed
Please install Android target / API level: "android-28".

Hint: Open the SDK manager by running: /home/USER/Android/Sdk/cmdline-tools/latest/bin/sdkmanager
You will require:
1. "SDK Platform" for API level android-28
2. "Android SDK Platform-tools (latest)
3. "Android SDK Build-tools" (latest)
Gradle: installed /home/USER/Programs/gradle-7.1.1/bin/gradle
Some of requirements check failed
```

cordova-android@8.1.0 need ANDROID_HOME variable to be set; target android-28 need to be installed.

See how all it's done in summary "Me installing wrong cordova-android version".

-------------------------

</details>
<br>

`cordova build`

<details>
<summary>Requirements check failed for JDK 8 ('1.8.*')! Detected version: 17.0.5</summary>

```
Checking Java JDK and Android SDK versions
ANDROID_SDK_ROOT=/home/USER/Android/Sdk (recommended setting)
ANDROID_HOME=/home/USER/Android/Sdk (DEPRECATED)
Requirements check failed for JDK 8 ('1.8.*')! Detected version: 17.0.5
Check your ANDROID_SDK_ROOT / JAVA_HOME / PATH environment variables.
```

cordova-android@8.1.0 need JDK version 8.

From sources:
https://stackoverflow.com/a/60964530

`sudo update-alternatives --config java`

`sudo update-alternatives --config javac`

----------------

</details>
<br>

... gradle-4.10.3 will be downloaded ...

Done!

Takes a lot of time to build first time (around 20 minutes in my case), without any response to the stdout, be patient.
