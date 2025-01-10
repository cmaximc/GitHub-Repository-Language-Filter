import xlsx from 'xlsx';
import { config } from '../config/global.js';
import { readExcelFile, extractRepositories, checkRepoLanguages, createOutputData } from '../methods/fetch.js';


// Main function to process repositories and generate output Excel file
(async () => {
    const data = readExcelFile('repositories.xlsx');
    const allRepos = extractRepositories(data, config.languagesToCheck);
    const outputData = createOutputData(data);

    for (const repo of allRepos) {
        const hasAllLanguages = await checkRepoLanguages(repo);
        if (hasAllLanguages) {
            const repoUrl = `https://github.com/${config.organization}/${repo}`;
            const rowIndex = outputData.findIndex(row => config.languagesToCheck.some(language => row[language].v === repo));
            if (rowIndex !== -1) {
                outputData[rowIndex][`${config.languagesToCheck.join('/')}`] = { t: 's', v: repo, l: { Target: repoUrl } };
            }
        }
    }

    // Create a new workbook and add the updated data
    const newWorkbook = xlsx.utils.book_new();
    const newSheet = xlsx.utils.json_to_sheet(outputData);
    xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'Sheet1');

    // Write the new workbook to a file
    xlsx.writeFile(newWorkbook, 'joinedRepositories.xlsx');
})();