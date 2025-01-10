# Repository Language Checker

This project provides scripts to generate and read a list of repositories from a GitHub organization, filtering them by specified programming languages.

## Prerequisites

- Node.js installed on your machine
- GitHub personal access token with the necessary permissions

## Configuration

1. Create a `config.js` file in the root directory with the following content:

    ```javascript
    // filepath: /c:/Users/claudiu_maxim/Desktop/ah_repos/config.js
    export const config = {
        authToken: 'your_github_personal_access_token',
        organization: 'your_github_organization',
        languagesToCheck: ['Java', 'PLSQL'] // Add or modify languages as needed
    };
    ```

2. Replace `your_github_personal_access_token` with your actual GitHub personal access token.
3. Replace `your_github_organization` with the name of your GitHub organization.
4. Modify the [languagesToCheck](http://_vscodecontentref_/0) array to include the languages you want to filter by.

## Scripts

### 1. Generate the List of Repositories

The [writeFile.js](http://_vscodecontentref_/1) script generates a list of repositories from the specified GitHub organization and filters them by the specified languages.

#### Usage

```bash
node writeFile.js

### 2. Generate the List of Repositories

The [readFile.js](http://_vscodecontentref_/1) will create an Excel file named your_organization-Java-PLSQL.xlsx (or similar, based on your configuration) containing the joined repositories.