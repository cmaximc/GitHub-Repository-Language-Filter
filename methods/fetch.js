import { Octokit } from "@octokit/rest";
import * as XLSX from 'xlsx';
import { config } from "../config/global.js";
import xlsx from 'xlsx';

const octokit = new Octokit({
    auth: config.authToken
});

export async function getRepositories(organization, languages) {
    try {
        let repositories = {};
        languages.forEach(language => {
            repositories[language] = [];
        });

        let page = 1;
        let hasNextPage = true;

        while (hasNextPage) {
            const response = await octokit.request('GET /orgs/{org}/repos', {
                org: organization,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                },
                per_page: 100,
                page: page
            });

            const data = response.data;
            languages.forEach(language => {
                repositories[language] = repositories[language].concat(
                    data.filter(repo => repo.language === language).map(repo => ({
                        name: repo.name,
                        url: repo.html_url
                    }))
                );
            });

            if (data.length < 100) {
                hasNextPage = false;
            } else {
                page++;
            }
        }

        // Create Excel file
        const workbook = XLSX.utils.book_new();
        const header = languages;
        const worksheetData = [
            header,
            ...Array.from({ length: Math.max(...languages.map(language => repositories[language].length)) }, (_, i) =>
                languages.map(language =>
                    repositories[language][i] ? { t: 's', v: repositories[language][i].name, l: { Target: repositories[language][i].url } } : ''
                )
            )
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Repositories');

        // Write to file
        XLSX.writeFile(workbook, 'repositories.xlsx');

        console.log('Excel file created successfully.');
    } catch (error) {
        console.error(error);
        return null;
    }
}

export function readExcelFile(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
}

export function extractRepositories(data, languages) {
    const repos = languages.flatMap(language => data.map(row => row[language]).filter(Boolean));
    return [...new Set(repos)];
}

export async function checkRepoLanguages(repo) {
    try {
        const repoName = repo;
        console.log(`Checking repository: Owner - ${config.organization}, Repo - ${repoName}`);
        const { data: languages } = await octokit.repos.listLanguages({ owner: config.organization, repo: repoName });
        return config.languagesToCheck.every(language => languages[language]);
    } catch (error) {
        console.error(`Error checking repository ${repo}:`, error);
        return false;
    }
}

export function createOutputData(data) {
    return data.map(row => {
        const newRow = {};
        config.languagesToCheck.forEach(language => {
            newRow[language] = row[language] ? { t: 's', v: row[language], l: { Target: `https://github.com/${config.organization}/${row[language]}` } } : '';
        });
        newRow[`${config.languagesToCheck.join('/')}`] = '';
        return newRow;
    });
}