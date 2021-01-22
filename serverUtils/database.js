/*
    Club penguin private server
    by sej and teo
    ===========================
    filename: serverUtils/database.js
    filedesc: Simple database handler
*/

/*
    Each function will return a "true" (or what its meant to return, such as the key value) 
    if its successful or "false" if it failed.
*/

const fs = require('fs');
var databaseDirectory = process.cwd() + "/database/";
var dbLock = false;

async function printExceptions(exceptionTag) {
    console.log(`Exception whilst executing database operation. \nError: ${exceptionTag.message}\nStack Trace:\n${exceptionTag.stack}`); // if error, output useful error info
    process.exit();
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}   

async function initialiseDb() {
    // if database is non-existent, create and set it up.
    try {
        if (!fs.existsSync(databaseDirectory)) {
            fs.mkdirSync(databaseDirectory);
        }
        console.log("\nRunning DB tests... this will take approx. 4-5 seconds.\nLocking Database temporarily...");
        dbLock = true; // lock db
        // do startup checks
        var sc1 = addKey("DATABASE_STARTUP_CHECKS_DONT_REMOVE", "TESTVALUE", true); // should return "true"
        process.stdout.write("CHK_1 Complete... ");
        await sleep(1000);
        var sc2 = setKey("DATABASE_STARTUP_CHECKS_DONT_REMOVE", "TESTVALUE2", true); // should return "true"
        process.stdout.write("CHK_2 Complete... ");
        await sleep(1000);
        var sc3 = getKey("DATABASE_STARTUP_CHECKS_DONT_REMOVE", true);  // should return "TESTVALUE2"
        process.stdout.write("CHK_3 Complete... ");
        await sleep(1000);
        var sc4 = delKey("DATABASE_STARTUP_CHECKS_DONT_REMOVE", true); // should return "true"
        process.stdout.write("CHK_4 Complete... ");
        await sleep(1000);
        var sc5 = getKey("DATABASE_STARTUP_CHECKS_DONT_REMOVE", true); // should return "false"
        process.stdout.write("CHK_5 Complete...\n");

        if (sc1 == true && sc2 == true && sc3 == "TESTVALUE2" && sc4 == true && sc5 == false) {
            console.log("Checks done and succeeded! Database is accessible again\n")
            dbLock = false;
            return true;
        } else {
            console.log(":( Database failed startup checks. Database is accessible again\n");
            dbLock = false;
            return false;
        }
    } catch (e) {
        printExceptions(e);
    }
}

function addKey(keyName, keyValue, overrideLock) {
    if (overrideLock === undefined) { overrideLock = false; }
    if (dbLock && overrideLock !== true) {
        console.log("E: Database is locked!");
        return false;
    }
    try {
        fs.writeFileSync(databaseDirectory + keyName + ".dbentry", keyValue);
        return true;
    } catch (e) {
        printExceptions(e);
        return false;
    }
}

function getKey(keyName, overrideLock) {
    if (overrideLock === undefined) { overrideLock = false; }
    if (dbLock && overrideLock !== true) {
        console.log("E: Database is locked!");
        return false;
    }
    if (fs.existsSync(databaseDirectory + keyName + ".dbentry")) {
        try {
            return fs.readFileSync(databaseDirectory + keyName + ".dbentry", 'utf8');
        } catch (e) {
            printExceptions(e);
            return false;
        }
    } else {
        // key does not exist
        return false;
    }
}

function setKey(keyName, keyValue, overrideLock) {
    if (overrideLock === undefined) { overrideLock = false; }
    if (dbLock && overrideLock !== true) {
        console.log("E: Database is locked!");
        return false;
    }
    // just another name for addKey
    return addKey(keyName, keyValue, overrideLock);
}

function delKey(keyName, overrideLock) {
    if (overrideLock === undefined) { overrideLock = false; }
    if (dbLock && overrideLock !== true) {
        console.log("E: Database is locked!");
        return false;
    }
    // WARNING: IT DOES NOT ASK YOU TO CONFIRM!!
    if (fs.existsSync(databaseDirectory + keyName + ".dbentry")) {
        try {
            fs.rmSync(databaseDirectory + keyName + ".dbentry");
            return true;
        } catch (e) {
            printExceptions(e);
            return false;
        }
    } else {
        return false;
    }
}

module.exports = {
    initialiseDb,
    addKey,
    getKey,
    setKey,
    delKey
}