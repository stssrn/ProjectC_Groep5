# Antes Onboarding App

## Building the app

First install the required build tools **npm** and **dotnet**.

After installing the build tools, install the npm dependencies of the frontend app.

```sh
cd frontend
npm i
```

Then, move into the backend directory and build the C# project. You cannot build the frontend without building the backend first, because the backend generates types and fetching functions for the frontend.


```sh
cd ../backend
dotnet build --configuration Gen
```
