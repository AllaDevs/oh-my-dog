# First time project initialization

> Obiously you need to have nodejs installed in your computer, a database created and cloned this repository.

## 1. Install dependencies

```bash
npm i
```

## 2. .env file

Create a .env file in the root of the project with the following content.

> Replace {{prisma schema url}} with your prisma schema url for your database

```bash
DATABASE_URL="{{prisma schema url}}"
LAUNCH_EDITOR=".\.launcheditor.bat"
SENDGRID_SENDER="{{your sendgrid sender email}}}"
SENDGRID_USERNAME="{{your sendgrid username}}"
SENDGRID_PASSWORD="{{your sendgrid password}}"
```

## 3. .launcheditor.bat file

Create a .launcheditor.bat file in the root of the project with the following content.

> Replace {{path to vscode .exe}} with your vscode path

```bat
@echo off
set filename=%1
set line=%2
set column=%3
"%appdata%\..\Local\Programs\{{ruta a vscode}}" -r -g "%filename%":%lineNumber%:%columnNumber%
```

## 4. Generate Prisma client

```bash
npx prisma generate
```

## 5. Start the development server

```bash
npm run dev -- --open
```
