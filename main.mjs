// Header: main.mjs
// Authors: Samuel Anaevune, Abigail Bernardeau, Jamie Duncan, Ingrid Mast and Andreas Matejka
// Created: 12/09/2024
// Description: This file holds the javascript code which controls processes running in the background of our application.
// Copyright (c) <2024> <Samuel Anaevune, Abigail Bernardeau, Jamie Duncan, Ingrid Mast and Andreas Matejka>
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Including the needed modules
import path from "path";
import {fileURLToPath} from 'url';
import dirname from 'path';
import sqlite3 from "sqlite3";
import fs from "fs";
import dotenv from "dotenv/config.js";
import express from "express";
import Nylas from "nylas";


// Creates a new Browser whenever we create a new window
import {app, BrowserWindow, ipcMain, shell} from "electron";

// The code below reads data from the database, cleaning and sorting it before it is sent to render files.

// Defining a variable that holds today's date - this is used throughout the file
const today = new Date();

let dbFile = path.join(app.getAppPath(), 'database.db')
// Opening the database
let db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to Lighthouse Grant Management database.');
});

// This function allows us to query the database using the database.all function which gathers all database rows that fit the given parameter. The rows returned by the given sqlite query (passed in parameter sql) are returned in the variable rows.
async function queryDatabase(sql) {
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
        return rows;
    } catch (err) {
        console.error(err);
    }
}

// This function allows us to query the database using database.all with an sqlite query that contains parameters. The text of the query is passed in the parameter sql and the paramters are passed in the variable params. The rows returned by the given sqlite query are returned in the variable rows.
async function singleLineQueryDatabase(sql, param1, param2) {
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all(sql, [param1, param2], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
        return rows;
    } catch (err) {
        console.error(err);
    }
}

// This function allows us to query the sqlite database with 4 parameters
async function manyParamQueryDatabase(sql, param1, param2, param3, param4) {
    try {
        const rows = await new Promise((resolve, reject) => {
            db.get(sql, [param1, param2, param3, param4], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
        return rows;
    } catch (err) {
        console.error(err);
    }
}

// This function allows us to query the database using database.all with an sqlite query that contains one parameter. The text of the query is passed in the parameter sql and the paramters are passed in the variable params. The rows returned by the given sqlite query are returned in the variable rows.
async function singleParamQueryDatabase(sql, param1) {
    try {
        const rows = await new Promise((resolve, reject) => {
            db.get(sql, [param1], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
        return rows;
    } catch (err) {
        console.error(err);
    }
}

// This function added parsed notification information to the parsed_notification database. Using this function ensures that the query is completed before other code executes, preventing errors
async function insertNotificationData(name, foundation, status, thisDate, finalDate, isReminder, reminderType) {
  try {
    await new Promise((resolve, reject) => {
      db.run('INSERT INTO parsed_notifications (grant_name, grant_status, foundation_name, this_date, final_date, isReminder, reminder_type) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, status, foundation, thisDate, finalDate, isReminder, reminderType], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// This function determines the dates on which emails for a given reminder should be sent based on the reminder deadline, the number of reminders requested, and the requested date of the first reminder
// Parameters: a string representing the date of the first reminder, a string representing the reminder deadline and the number of reminders
// Returns: an array with strings representing the dates on which each email/calendar notification will be provided for a given reminder
function determineReminderDates(firstDate, deadline, reminderNumber) {
    let finalDates = [firstDate]
    let days = findNumberOfDays(firstDate, deadline)
    let interval = Math.round(days/reminderNumber)

    // Subtracting a reminder to account for the first reminder which was already added to the list
    reminderNumber -= 1
    let pastDate = new Date(firstDate)

    // Adding dates to the list at evenly dispersed intervals (a reminder will be provided on the deadline which is not included in this list)
    while(reminderNumber > 0) {
       days -= interval
       let thisDate = pastDate
       thisDate.setDate(thisDate.getDate() + interval)
       let presentableDate = thisDate.getFullYear() + "-" + (thisDate.getMonth() + 1) + "-" + thisDate.getDate()
       finalDates.push(presentableDate)
       reminderNumber -= 1
    }
    return finalDates
}

// This function finds the number of days between two given days
// Parameters: strings that represent two different days
// Returns: the number of days between those two days
function findNumberOfDays(first, second) {
    let startDate = new Date(first)
    let endDate = new Date(second)
    let timeDifferenceSeconds = endDate.getTime() - startDate.getTime()
    let numberOfDays = timeDifferenceSeconds/(24 * 3600 * 1000)
    return numberOfDays
}

//This function gets the relevant grant info from the database for the View All Grants Page
async function getDatabaseGrants() {
    let rows = await queryDatabase("SELECT foundation_name, grant_name, grant_status, id FROM all_grants ORDER BY foundation_name COLLATE NOCASE");
    let grantList = rows.flatMap(Object.values);
    return grantList;
};

// This function is called by viewAll.js; it gets the relevant grant data for the selected grant.
async function getGrantData(event, id, grant_status) {
    let grantData = []
    if (grant_status === "inConcept") {
        let rows = await singleParamQueryDatabase("SELECT project_director, requested_amount, due_by, notes FROM all_grants WHERE id = ?", id)
        grantData = Object.values(rows)
    }
    else if (grant_status === "pending") {
        let rows = await singleParamQueryDatabase("SELECT project_director, requested_amount, expected_amount, hear_by_date, notes FROM all_grants WHERE id = ?", id)
        grantData = Object.values(rows)
    }
    else if (grant_status === "active") {
        let rows = await singleParamQueryDatabase("SELECT project_director, amount_awarded, end_date, notes FROM all_grants WHERE id = ?", id)
        grantData = Object.values(rows)
    }
    else if (grant_status === "expiredA") {
        let rows = await singleParamQueryDatabase("SELECT project_director, amount_awarded, date_expired, notes FROM all_grants WHERE id = ?", id)
        grantData = Object.values(rows)
    }
    else if (grant_status === "expiredR") {
        let rows = await singleParamQueryDatabase("SELECT project_director, date_applied, requested_amount, notes FROM all_grants WHERE id = ?", id)
        grantData = Object.values(rows)
    }
    return grantData
}

// This function removes entries from the notification table which have deadlines that occured before the current date. This prevents large numbers of unneeded notifications from piling up in the database.
async function cleanNotificationTable() {
    let monthAgo = new Date()
    monthAgo.setTime(today.getTime() - (86400000 * 30)) // setting the variable to the time a month ago

    //Gathering the notification deadlines from the database
    let dates = await queryDatabase("SELECT id, notification_deadline FROM notifications");

    // Iterating through the dates returned
    let rowsToDelete = []
    for(let counter = 0; counter < dates.length; counter++) {
        let info = Object.values(dates[counter])
        let thisDate = new Date(info[1])
        if(thisDate.getTime() < monthAgo.getTime()) {
            rowsToDelete.push(info[0])
        }
    }

    let numberToDelete = (rowsToDelete.length - 1)
    while(numberToDelete > -1) {
        let idVar = rowsToDelete[numberToDelete]
        db.run('DELETE FROM notifications WHERE id = ?', [idVar])
        numberToDelete -= 1
    }
}

// This function removes entries from the parsed notification table which have final dates that occured before the current date. This prevents large numbers of unneeded notifications from piling up in the database.
async function cleanParsedNotificationTable() {
    let monthAgo = new Date()
    monthAgo.setTime(today.getTime() - (86400000 * 30)) // setting the variable to the time a month ago

    //Gathering the notification deadlines from the database
    let dates = await queryDatabase("SELECT id, final_date FROM parsed_notifications");

    // Iterating through the dates returned
    let rowsToDelete = []
    for(let counter = 0; counter < dates.length; counter++) {
        let info = Object.values(dates[counter])
        let thisDate = new Date(info[1])
        if(thisDate.getTime() < monthAgo.getTime()) {
            rowsToDelete.push(info[0])
        }
    }

    let numberToDelete = (rowsToDelete.length - 1)
    while(numberToDelete > -1) {
        let idVar = rowsToDelete[numberToDelete]
        db.run('DELETE FROM parsed_notifications WHERE id = ?', [idVar])
        numberToDelete -= 1
    }
}

// This function automatically changes the type of active grants that have expired from "active" to "expiredA"
async function updateGrantTypes() {
    // Getting all active grants from the database
    let newValues = await queryDatabase("SELECT grant_status, id, end_date FROM all_grants WHERE grant_status == 'active'");
    let validDates = Object.values(newValues)
    for(let counter = 0; counter < validDates.length; counter++) {
        let infoList = Object.values(validDates[counter])
        let endDate = new Date(infoList[2])
        if(infoList[2] != null){
            if(endDate.getTime() < today.getTime()) {
                // The grant has expired and the status is changed
                db.run('UPDATE all_grants SET grant_status = ? WHERE id = ?', ['expiredA', infoList[1]])
            }
        }
    }
}

// This function gathers all of the entries in the parsed notification table
async function getParsedNotifications() {
    let notifications = await queryDatabase("SELECT * FROM parsed_notifications ORDER BY this_date");
    return notifications;
}

// The following code is all for scheduling emails to send
const nylasConfig = {
  clientId: process.env.CLIENT_ID,
  apiKey: process.env.API_KEY,
  apiUri: "https://api.us.nylas.com",
};

const nylas = new Nylas({
  apiKey: nylasConfig.apiKey,
  apiUri: nylasConfig.apiUri,
});

//Essential email verification information - stored as a github secret
let $CLIENTIDENTIFIER = process.env.CLIENT_IDENTIFIER
let $RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL

// This function returns the body of the reminder email based on the reminder's type and the name of the grant it is associated with
function selectCorrectTemplate(template, foundationName, typeName, dueDate) {
    let email = ""
    if(template == "deadline") {
        email = 'This is a reminder that a grant under ' + foundationName + " has a " + typeName + " reminder with a deadline of today, " + dueDate + ".\nOpen the Lighthouse application for more information."
    } else {
        email = 'This is a reminder that a grant under ' + foundationName + " has a " + typeName + " reminder with a deadline of " + dueDate + ".\nOpen the Lighthouse application for more information."
    }
    return email
}

// This function returns the subject line of the reminder email based on the reminder's type and the name of the grant it is associated with
function getSubject(template, foundationName) {
    let subject = ""
    if(template == "deadline") {
        subject = foundationName + " Deadline Reminder"
    } else {
        subject = foundationName + " Reminder"
    }
    return subject
}

// This function is used to send emails with a specified subject and body on the specified date
const sendEmail = async (subject, body, date, rowId) => {
    try {
    // Scheduling an email to send on the specified date
    const sentMessage = await nylas.messages.send({
        identifier: $CLIENTIDENTIFIER,
        requestBody: {
            to: [{ email: $RECIPIENT_EMAIL}],
            replyTo: [{ name: "Lighthouse Grant Management", email: $RECIPIENT_EMAIL}],
            subject: subject,
            body: body,
            sendAt: Math.floor(date.getTime()/1000)
        },
    })
    db.run('UPDATE parsed_notifications SET message_id = ? WHERE id = ?', [sentMessage.data.scheduleId, rowId])
    } catch (error) {
        console.error('Error creating draft:', error)
    }
}

// This function schedules emails for all reminders which are 30 days away
async function scheduleEmails() {
    let dates = await queryDatabase("SELECT * FROM parsed_notifications WHERE job_id IS NULL OR job_id = 'NULL'");

    // Determining which reminders are 30 days away or less and can be scheduled
    let datesToSchedule = []
    let dateToScheduleBy = new Date()
    dateToScheduleBy.setDate(dateToScheduleBy.getDate() + 30)

    for(let counter = 0; counter < dates.length; counter++) {
        let thisArray = Object.values(dates[counter])
        let reminderDate = new Date(thisArray[4])
        // Scheduling the email if it is within the 30-day window
        if(reminderDate.getTime() < dateToScheduleBy.getTime()) {
            let deadlineDate = new Date(thisArray[5])
            let subject = ""
            let body = ""
            let type = ""

            // Adjusting the values of each reminder type so they will make sense in the email
            if(thisArray[7] == "noteExpires") {
                type = "expires"
            } else if(thisArray[7] == "noteApplicationDue") {
                type = "application due"
            } else if(thisArray[7] == "noteHearBy") {
                type = "hear by"
            } else if(thisArray[7] == "noteLookAt") {
                type = "look at"
            } else {
                type = "report due"
            }

            // Determining which email subject and body the email should use based on whether or not the reminder has a due date of that day
            if(reminderDate.getTime() == deadlineDate.getTime()) {
                subject = getSubject("deadline", thisArray[2])
                body = selectCorrectTemplate("deadline", thisArray[2], type, thisArray[5])
            } else {
                subject = getSubject("not deadline", thisArray[2])
                body = selectCorrectTemplate("not deadline", thisArray[2], type, thisArray[5])
            }

            // Creating the date object for when the email will be sent
            let stringDate = thisArray[4] + " 08:00:00"
            let sendDate = new Date(stringDate)

            sendEmail(subject, body, sendDate, thisArray[0])

            // Updating the database so it's clear the email has been scheduled
            db.run('UPDATE parsed_notifications SET job_id = ? WHERE id = ?', ["yes", thisArray[0]])
        }
    }
}

// This function stops emails from being send if they have already been scheduled - it is called when a reminder is deleted
async function cancelEmailSend(id) {
    let thisValue = await singleParamQueryDatabase("SELECT message_id FROM parsed_notifications WHERE id = ?", id)
    let messageID = Object.values(thisValue)

    // If the reminder has an message id value, the email has been scheduled to send. The code below cancels the scheduled email
    if(messageID[0] !== null && messageID[0] != "NULL") {
        try {
        const result = await nylas.messages.stopScheduledMessage({
          identifier: $CLIENTIDENTIFIER,
          scheduleId: messageID[0],
        });

        } catch (error) {
            console.error("Error deleting message:", error);
        }
    }

    return true
}

// This function cancels all emails reminders associated with a grant that is about to be deleted
async function cancelGrantEmails(name, foundation) {
    let idNums = await singleLineQueryDatabase("SELECT id FROM parsed_notifications WHERE grant_name = ? AND foundation_name = ?", name, foundation)
    let cancelNums = idNums.flatMap(Object.values)
    for(let i = 0; i < cancelNums.length; i++) {
        // Forcing this function to wait for the cancelEmailSend function to work in full before continuing
        let waitUp = await cancelEmailSend(cancelNums[i])
    }
    return true
}

// This function deletes a grant from the database and cancels any reminder emails associated with it that were scheduled
async function deleteGrant(name, foundation) {
    // Making sure that all of the scheduled emails are cancelled and that the program waits for this to happen before the notification information is deleted
    let allCancelled = await cancelGrantEmails(name, foundation)
    deleteGrantsForReal(name, foundation, allCancelled)
}

// This function deletes entries in the reminder database associated with the grant that is being deleted
function deleteGrantsForReal(name, foundation, emailsCancelled) {
    // Deleting all instances of this grant in the database
    db.run("DELETE FROM notifications WHERE foundation_name = ? AND grant_name = ?", [foundation, name])
    db.run("DELETE FROM parsed_notifications WHERE foundation_name = ? AND grant_name = ?", [foundation, name])
}

// This function checks the database to see if a grant with the given name and foundation name already exists in the database. A boolean value is returned based on whether or not it does
async function checkForExistingGrant(event, grantName, foundationName) {
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all("SELECT id FROM all_grants WHERE grant_name = ? AND foundation_name = ?", [grantName, foundationName], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
        let length = rows.length
        if(length > 0) {
            return true
        } else {
            return false
        }
    } catch (err) {
        console.error(err);
    }
}

// Function to export data to CSV
async function exportToCSV() {
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const fileName = `ExportedGrants_${currentDate}.csv`;

    // Query to get the relevant data from the database
    db.all("SELECT foundation_name, grant_name, grant_status, requested_amount, expected_amount, amount_awarded, project_director, due_by, hear_by_date, end_date, date_applied, date_expired, notes FROM all_grants", (error, rows) => {
        if (error) {
            console.error("Error fetching grant data:", error);
            return;
        }

        // Convert data to CSV format
        let csvContent = "Foundation Name, Grant Name, Status, Requested Amount, Expected Amount, Awarded Amount, Project Director, Due By, Hear By, End Date, Date Applied, Date Expired, Notes\n";

        rows.forEach(row => {
            csvContent += `"${row.foundation_name}","${row.grant_name}","${row.grant_status}","${row.requested_amount}","${row.expected_amount}","${row.amount_awarded}","${row.project_director}","${row.due_by}","${row.hear_by_date}","${row.end_date}","${row.date_applied}","${row.date_expired}","${row.notes}"\n`;
        });

        // Write CSV content to file
        const filePath = `./ExportedGrants/${fileName}`;
        fs.writeFile(filePath, csvContent, (err) => {
            if (err) {
                console.error("Error writing CSV file:", err);
            } else {
                console.log("CSV file has been saved to:", filePath);
            }
        });
    });
}

// This function adjusts information that was edited for a grant in the notification and parsed_notification tables
async function changeReminderInfo(id, type, updates, typeChange) {
    // Getting the grant name and foundation name which will be used when adjusting information for the reminders tables
    let names = await singleParamQueryDatabase("SELECT grant_name, foundation_name FROM all_grants WHERE id = ?", id)
    let justNames = Object.values(names)

    // Code to change deadline dates and cancel any scheduled deadline emails if the grant type remains the same
    if(typeChange == false) {
        if(type == "active") {
            let reminderID = await manyParamQueryDatabase("SELECT id FROM parsed_notifications WHERE foundation_name = ? AND grant_name = ? AND reminder_type = ? AND isReminder = ?", justNames[1], justNames[0], "noteExpires", "false")
            let idAlone = Object.values(reminderID)
            cancelEmailSend(idAlone[0])
            db.run('UPDATE parsed_notifications SET this_date = ?, final_date = ?, job_id = ? WHERE foundation_name = ? AND grant_name = ? AND reminder_type = ? AND isReminder = ?', [updates["ed"], updates["ed"], "NULL", justNames[1], justNames[0], "noteExpires", "false"])
            db.run('UPDATE parsed_notifications SET final_date = ? WHERE foundation_name = ? AND grant_name = ? AND reminder_type = ?', [updates["ed"], justNames[1], justNames[0], "noteExpires"])
        } else if(type == "inConcept") {
            let reminderID = await manyParamQueryDatabase("SELECT id FROM parsed_notifications WHERE foundation_name = ? AND grant_name = ? AND reminder_type = ? AND isReminder = ?", justNames[1], justNames[0], "noteApplicationDue", "false")
            let idAlone = Object.values(reminderID)
            cancelEmailSend(idAlone[0])
            db.run('UPDATE parsed_notifications SET this_date = ?, final_date = ?, job_id = ? WHERE foundation_name = ? AND grant_name = ? AND reminder_type = ? AND isReminder = ?', [updates["db"], updates["db"], "NULL", justNames[1], justNames[0], "noteApplicationDue", "false"])
            db.run('UPDATE parsed_notifications SET final_date = ? WHERE foundation_name = ? AND grant_name = ? AND reminder_type = ?', [updates["db"], justNames[1], justNames[0], "noteApplicationDue"])
        } else if(type == "pending") {
            let reminderID = await manyParamQueryDatabase("SELECT id FROM parsed_notifications WHERE foundation_name = ? AND grant_name = ? AND reminder_type = ? AND isReminder = ?", justNames[1], justNames[0], "noteHearBy", "false")
            let idAlone = Object.values(reminderID)
            cancelEmailSend(idAlone[0])
            db.run('UPDATE parsed_notifications SET this_date = ?, final_date = ?, job_id = ? WHERE foundation_name = ? AND grant_name = ? AND reminder_type = ? AND isReminder = ?', [updates["hbd"], updates["hbd"], "NULL", justNames[1], justNames[0], "noteHearBy", "false"])
            db.run('UPDATE parsed_notifications SET final_date = ? WHERE foundation_name = ? AND grant_name = ? AND reminder_type = ?', [updates["hbd"], justNames[1], justNames[0], "noteHearBy"])
        }
    } else {
        let linesToDelete = await singleLineQueryDatabase('SELECT id FROM parsed_notifications WHERE grant_name = ? AND foundation_name = ?', [justNames[0], justNames[1]])
        let idsToDelete = Object.values(linesToDelete)
        for(let i = 0; i < idsToDelete.length; i++) {
            cancelEmailSend(idsToDelete[i])
        }

        // Code to add deadline dates if the grant type is changed - reminders under that same grant with a different type are also changed
        if(type == "inConcept") {
            db.run('DELETE FROM parsed_notifications WHERE grant_name = ? AND foundation_name = ?', [justNames[0], justNames[1]])
            db.run('DELETE FROM notifications WHERE grant_name = ? AND foundation_name = ?', [justNames[0], justNames[1]])
            db.run('INSERT INTO parsed_notifications (grant_name, foundation_name, grant_status, this_date, final_date, isReminder, reminder_type) VALUES (?, ?, ?, ?, ?, ?, ?)', [updates["gn"], updates["fn"], type, updates["db"], updates["db"], "false", "noteApplicationDue"])
        } else if(type == "pending") {
            db.run('DELETE FROM parsed_notifications WHERE grant_name = ? AND foundation_name = ?', [justNames[0], justNames[1]])
            db.run('DELETE FROM notifications WHERE grant_name = ? AND foundation_name = ?', [justNames[0], justNames[1]])
            db.run('INSERT INTO parsed_notifications (grant_name, foundation_name, grant_status, this_date, final_date, isReminder, reminder_type) VALUES (?, ?, ?, ?, ?, ?, ?)', [updates["gn"], updates["fn"], type, updates["hbd"], updates["hbd"], "false", "noteHearBy"])
        } else if(type == "active") {
            db.run('DELETE FROM parsed_notifications WHERE grant_name = ? AND foundation_name = ?', [justNames[0], justNames[1]])
            db.run('DELETE FROM notifications WHERE grant_name = ? AND foundation_name = ?', [justNames[0], justNames[1]])
            db.run('INSERT INTO parsed_notifications (grant_name, foundation_name, grant_status, this_date, final_date, isReminder, reminder_type) VALUES (?, ?, ?, ?, ?, ?, ?)', [updates["gn"], updates["fn"], type, updates["ed"], updates["ed"], "false", "noteExpires"])
        }
    }

    db.run('UPDATE notifications SET foundation_name = ?, grant_name = ?, grant_status = ? WHERE foundation_name = ? AND grant_name = ?', [updates["fn"], updates["gn"], type, justNames[1], justNames[0]])
    db.run('UPDATE parsed_notifications SET foundation_name = ?, grant_name = ?, grant_status = ? WHERE foundation_name = ? AND grant_name = ?', [updates["fn"], updates["gn"], type, justNames[1], justNames[0]])
}

// The code below runs when a window for our application is created. Here, all of the functions that need to be run as soon as the application starts up are called. Many of these functions send data from this file to render files where the data will be displayed for the user.
function createMainWindow() {
    // Creating a new BrowserWindow object
    const mainWindow = new BrowserWindow({
        title: 'Lighhouse Grant Management',
        width: 1200,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(import.meta.dirname, './preload.js')
        }
    });

    // Using the IPC connector through main to gather user input stored in variables. This is done through the 'gather-essential-info' key defined in our preload.js file
    ipcMain.on('gather-essential-info', (event, name, foundation, type, awarded, notes, director, request, expect, awardedAmount, beforeDate, endDate, expiredDate, reminderNum) => {
        if (type === "inConcept") {
            db.run('INSERT INTO all_grants (foundation_name, grant_name, grant_status, requested_amount, project_director, due_by, number_of_reminders, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [foundation, name, type, request, director, beforeDate, reminderNum, notes], function(err) {});
        } else if (type === "pending") {
            db.run('INSERT INTO all_grants (foundation_name, grant_name, grant_status, requested_amount, expected_amount, project_director, hear_by_date, number_of_reminders, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [foundation, name, type, request, expect, director, beforeDate, reminderNum, notes], function(err) {});
        } else if (type === "active") {
            db.run('INSERT INTO all_grants (foundation_name, grant_name, grant_status, amount_awarded, project_director, end_date, number_of_reminders, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [foundation, name, type, awardedAmount, director, endDate, reminderNum, notes], function(err) {});
        } else {
            if (awarded === "yes") {
                db.run('INSERT INTO all_grants (foundation_name, grant_name, grant_status, amount_awarded, project_director, date_expired, notes) VALUES (?, ?, ?, ?, ?, ?, ?)', [foundation, name, type, awardedAmount, director, expiredDate, notes], function(err) {});
            } else {
                db.run('INSERT INTO all_grants (foundation_name, grant_name, grant_status, requested_amount, date_applied, notes) VALUES (?, ?, ?, ?, ?, ?)', [foundation, name, type, request, expiredDate, notes], function(err) {});
            }
        }
    });

    // Gathers changes to a grant's data from user input and updates database accordingly.
    ipcMain.on("gather-grant-data-input", (event, id, status, updates, typeChange) => {
        // Calling a function that changes the information in the reminder tables
        changeReminderInfo(id, status, updates, typeChange)

        if (status === 'inConcept') {
            db.run('UPDATE all_grants SET grant_status = ?, foundation_name = ?, grant_name = ?, due_by = ?, project_director = ?, requested_amount = ?, notes = ? WHERE id = ?', [status, updates["fn"], updates["gn"], updates["db"], updates['pd'], updates["ra"], updates["no"], id], (error) => {
                if (error) {
                    console.log(error);
                }
            });
        } else if (status === 'pending') {
            db.run('UPDATE all_grants SET grant_status = ?, foundation_name = ?, grant_name = ?, hear_by_date = ?, project_director = ?, requested_amount = ?, expected_amount = ?, notes = ? WHERE id = ?', [status, updates["fn"], updates["gn"], updates["hbd"], updates['pd'], updates["ra"], updates["ea"], updates["no"], id], (error) => {
                if (error) {
                    console.log(error);
                }
            });
        } else if (status === 'active') {
            db.run('UPDATE all_grants SET grant_status = ?, foundation_name = ?, grant_name = ?, end_date = ?, project_director = ?, amount_awarded = ?, notes = ? WHERE id = ?', [status, updates["fn"], updates["gn"], updates["ed"], updates['pd'], updates["aa"], updates["no"], id], (error) => {
                if (error) {
                    console.log(error);
                }
            });
        } else if (status === 'expiredA') {
            db.run('UPDATE all_grants SET grant_status = ?, foundation_name = ?, grant_name = ?, date_expired = ?, project_director = ?, amount_awarded = ?, notes = ? WHERE id = ?', [status, updates["fn"], updates["gn"], updates["de"], updates['pd'], updates["aa"], updates["no"], id], (error) => {
                if (error) {
                    console.log(error);
                }
            });
        } else if (status === 'expiredR') {
            db.run('UPDATE all_grants SET grant_status = ?, foundation_name = ?, grant_name = ?, date_applied = ?, project_director = ?, requested_amount = ?, notes = ? WHERE id = ?', [status, updates["fn"], updates["gn"], updates["da"], updates["pd"], updates["ra"], updates["no"], id], (error) => {
                if (error) {
                    console.log(error);
                }
            });
        } else if (status === 'expiredR') {
            db.run('UPDATE all_grants SET foundation_name = ?, grant_name = ?, date_applied = ?, project_director = ?, requested_amount = ?, notes = ? WHERE id = ?', [updates["fn"], updates["gn"], updates["da"], updates["pd"], updates['ra'], updates["no"], id], (error) => {
                if (error) {
                    console.log(error);
                }
            });
        }
    })

    // Changes the folder to the new name
    ipcMain.on('change-folder-name', async (event, oldFound, oldGrant, newFound, newGrant) => {

        const baseDir = path.join(import.meta.dirname, 'Foundations');
        const newFoundFolderPath = path.join(baseDir, newFound);
        const newPath = path.join(newFoundFolderPath, newGrant)
        const oldFoundFolderPath = path.join(baseDir, oldFound);
        const oldPath = path.join(oldFoundFolderPath, oldGrant)
        if (newFoundFolderPath != oldFoundFolderPath) {
            await fs.promises.mkdir(newFoundFolderPath, { recursive: true });
        }
        await fs.rename(oldPath, newPath, function(err) {
            if (err) {
              console.log(err)
            }
          })
    })

    // Opens the folder of the given grantName
    ipcMain.on('send-folder-info', async (event, grantName, foundationName) => {
        const baseDir = path.join(import.meta.dirname, 'Foundations');
        const foundationFolderPath = path.join(baseDir, foundationName);
        const grantFolderPath = path.join(foundationFolderPath, grantName);
        try {
            await fs.promises.access(grantFolderPath, fs.constants.F_OK);
        } catch (err) {
            try {
                await fs.promises.mkdir(grantFolderPath, { recursive: true });
            } catch (mkdirErr) {
                console.error('Error creating folder:', mkdirErr);
            }
        }
        shell.openPath(grantFolderPath) // Open the given file in the desktop's default manner.
    })

    ipcMain.on('delete-notification-in-main', (event, notificationID) => {
        cancelEmailSend(notificationID)
        db.run('DELETE FROM parsed_notifications WHERE id = ?', [notificationID])
    })

    ipcMain.on('send-files', async (event, fileData) => {
        const foundAndGrantName = fileData[0];
        const parts = foundAndGrantName.split("_")
        let foundationName = parts[0]
        let grantName = parts[1]
        const files = fileData.slice(1);

        try {
            //Where the attachments will be copied to
            const baseDir = path.join(import.meta.dirname, 'Foundations');

            //Create the folder for the grant
            const foundationFolderPathFolderPath = path.join(baseDir, foundationName);
            const grantFolderPath = path.join(foundationFolderPathFolderPath, grantName);
            await fs.promises.mkdir(grantFolderPath, { recursive: true });

            //Actually copying the file and its data to the folder
            for (const file of files) {
                const fileName = file.name;
                const fileData = file.data;
                const destinationPath = path.join(grantFolderPath, fileName);

            try {
                const buffer = Buffer.from(fileData);
                await fs.promises.writeFile(destinationPath, buffer);
            } catch (error) {
                console.error(`Error copying ${fileName}:`, error);
            }
        }
          event.reply('send-files-success', { success: true, message: 'Files sent successfully.' });
        } catch (error) {
          console.error('Error during file sending:', error);
          event.reply('send-files-error', { success: false, message: 'Failed to send files.' });
       }
    });

    // Using IPC connector through main to delete a grant the User specifies.
    ipcMain.on('remove-grant', (event, grant_id, name, foundation) => {
        deleteGrant(name, foundation)
        db.run('DELETE FROM all_grants WHERE id = ?', [grant_id]);
    });

    // Getting user input from the reminders section of the add grant page and adding it to the notification table in our database
    ipcMain.on('gather-notification-input', (event, name, foundation, status, reminderType, deadline, number, first) => {
        db.run('INSERT INTO notifications (foundation_name, grant_name, grant_status, notification_type, notification_deadline, number_of_reminders, first_reminder_date) VALUES (?, ?, ?, ?, ?, ?, ?)', [foundation, name, status, reminderType, deadline, number, first])
    });

    // Getting user input from the reminders section of the add grant page and adding it to the notification table in our database
    ipcMain.on('gather-parsed-notification-input', async (event, name, foundation, status, thisDate, finalDate, isReminder, reminderType) => {
        await insertNotificationData(name, foundation, status, thisDate, finalDate, isReminder, reminderType)
        scheduleEmails()
    });

    ipcMain.on('export-csv', async (event) => {
        await exportToCSV();
    });

  cleanNotificationTable()
  cleanParsedNotificationTable()
  updateGrantTypes()
  scheduleEmails()
  mainWindow.loadFile(path.join(import.meta.dirname, './calendar.html'));
}

// Checks to see if the start command has been provided and then calls the createMainWindow function
app.whenReady().then(() => {
    // Getting the email value stored in the database
    ipcMain.handle('getDatabaseGrants', getDatabaseGrants)
    ipcMain.handle('getGrantData', getGrantData)

    // Sending the notification dates to calendarRender.js
    ipcMain.handle('getParsedNotifications', getParsedNotifications)

    // Calling a function that will check in a grant with the given grant name and foundation name (passed in preload.js) exists in the database
    ipcMain.handle("getInfoToCheck", checkForExistingGrant)

    createMainWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    });
});

// Ensures that the application closes correctly based on the opperating system it is being used on
app.on('window-all-closed', () => {
    // Checks to see if the application is a Mac and if not, closes the application. On a Mac, windows are left open even after the user closes an application.
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
