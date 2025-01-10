import { getRepositories } from '../methods/fetch.js';
import { config } from '../config/global.js';


// Call the getRepositories function
getRepositories(config.organization, config.languagesToCheck).then(() => {
    console.log('Repositories fetched and Excel file created.');
}).catch(error => {
    console.error('Error:', error);
});