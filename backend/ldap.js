const ldap = require('ldapjs');
const moment = require('moment');
require('dotenv').config();
const ldapURL = process.env.LDAP_URL;
const ldapDN = process.env.LDAP_DN;
const ldapUser = process.env.LDAP_USER;
const ldapPassword = process.env.LDAP_PASSWORD;

async function getEmails() {
    const client = ldap.createClient({
        url: ldapURL,
    });

    let allResults = [];
    try{
        for(let i = 0; i < 4; i++) {
            let year = (parseInt(moment().format('YY'))+42-i).toString();
            const opts = {
                filter: `(mail=${year}*)`,
                scope: 'sub',
                attributes: ['mail']
            };

            await new Promise((resolve, reject) => {
                client.bind(ldapUser, ldapPassword, (err, sample) => {  // Replace 'username' and 'password'
                    if(err) {
                        console.log('Error in bind operation:', err);
                        return reject(err);
                    }
                    else{
                        console.log('Successfully bound to server');
                    }

                    client.search(ldapDN, opts, (err, search) => {
                        let results = [];

                        search.on('searchEntry', (entry) => {
                            let emails = entry.attributes[0].values;
                            results.push(...emails);
                        });

                        search.on('end', () => {
                            if (results.length > 0) {
                                console.log('Search successful, found:', results.length, 'result(s)');
                                allResults.push(...results);
                            } else {
                                console.log('No results found');
                            }
                            resolve();
                        });

                        search.on('error', (err) => {
                            console.log(err);
                            reject(err);
                        });
                    });
                });
            });
        } 
    } catch (err) {
        console.error('Error :', err);
    } finally {
        client.unbind((err) => {
            if(err) {
                console.log('Error in unbind operation:', err);
            } else {
                console.log('Successfully unbound from server');
            }
        });
    }

    return allResults;
}

async function getNonStudentEmails() {
    const client = ldap.createClient({
        url: ldapURL,
    });

    let allResults = [];
    try {
        const opts = {
            filter: '(mail=*@it.kmitl.ac.th)', 
            scope: 'sub',
            attributes: ['mail']
        };

        await new Promise((resolve, reject) => {
            client.bind(ldapUser, ldapPassword, (err, sample) => {  // Replace 'username' and 'password'
                if(err) {
                    console.log('Error in bind operation:', err);
                    return reject(err);
                }
                else{
                    console.log('Successfully bound to server');
                }

                client.search(ldapDN, opts, (err, search) => {
                    let results = [];

                    search.on('searchEntry', (entry) => {
                        let emails = entry.attributes[0].values;
                        results.push(...emails);
                    });

                    search.on('end', () => {
                        if (results.length > 0) {
                            console.log('Search successful, found:', results.length, 'result(s)');
                            allResults.push(...results);
                        } else {
                            console.log('No results found');
                        }
                        resolve();
                    });

                    search.on('error', (err) => {
                        console.log(err);
                        reject(err);
                    });
                });
            });
        });
    } catch (err) {
        console.error('Error :', err);
    } finally {
        client.unbind((err) => {
            if(err) {
                console.log('Error in unbind operation:', err);
            } else {
                console.log('Successfully unbound from server');
            }
        });
    }

    return allResults;
}

module.exports = { getEmails, getNonStudentEmails };