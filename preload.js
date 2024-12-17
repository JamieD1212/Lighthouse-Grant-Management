// Header: preload.js
// Authors: Samuel Anaevune, Abigail Bernardeau, Jamie Duncan, Ingrid Mast and Andreas Matejka
// Created: 12/09/2024
// Description: This file holds the javascript code that handles communciation between the main and render files for our application.
// Copyright (c) <2024> <Samuel Anaevune, Abigail Bernardeau, Jamie Duncan, Ingrid Mast and Andreas Matejka>
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const {contextBridge, ipcRenderer} = require('electron/renderer');

// Establishing an API with various functions that send different variables to and from the main.js file
contextBridge.exposeInMainWorld('electronAPI', {
    // For gathering user input information about a new grant
    gatherEssentialInfo: (name, foundation, type, awarded, notes, director, request, expect, awardedAmount, beforeDate, endDate, expiredDate, reminderNum) => ipcRenderer.send('gather-essential-info', name, foundation, type, awarded, notes, director, request, expect, awardedAmount, beforeDate, endDate, expiredDate, reminderNum),
    // For gathering notification input for a new grant
    gatherNotificationInput: (name, foundation, status, reminderType, deadline, number, first) => ipcRenderer.send('gather-notification-input', name, foundation, status, reminderType, deadline, number, first),
    // For gathering parsed notification input for the parsed notification table
    gatherParsedNotificationInput: (name, status, foundation, thisDate, finalDate, isReminder, reminderType) => ipcRenderer.send('gather-parsed-notification-input', name, status, foundation, thisDate, finalDate, isReminder, reminderType),
    // For gathering the changes the user has made to a grant's data.
    gatherGrantDataInput: (name, status, updates, typeChange) => ipcRenderer.send('gather-grant-data-input', name, status, updates, typeChange),
    // For sending the grant's name and foundation to the main file so we can check if the grant already exists
    getInfoToCheck: (name, foundation) => ipcRenderer.invoke('getInfoToCheck', name, foundation),
    // For getting all of the entries in the parsed notification table
    getParsedNotifications: () => ipcRenderer.invoke('getParsedNotifications'),
    // For returning the data associated with a Grant Name from the database.
    getGrantData: (id, grant_status) => ipcRenderer.invoke('getGrantData', id, grant_status),
    // For returning the Grant names from the database
    getDatabaseGrants: () => ipcRenderer.invoke('getDatabaseGrants'),
    // For exporting to the csv file
    exportCSV: () => ipcRenderer.send('export-csv'),
    // For sending the attachment to main and copying the file into its folder
    sendFiles: (fileData) => ipcRenderer.send('send-files', fileData),
    // For sending the grant and foundation names into main and opening the folder
    sendFolderInfo: (grantName, foundationName) => ipcRenderer.send('send-folder-info', grantName, foundationName),
    // For deleting a grant from the database
    removeGrant: (id, name, foundation) => ipcRenderer.send('remove-grant', id, name, foundation),
    // For sending the notification to main where it can be deleted
    deleteNotificationInMain: (notificationID) => ipcRenderer.send('delete-notification-in-main', notificationID),
    // For sending new Grant and Foundation names to main, so the folder can be renamed
    changeFolderName: (oldFound, oldGrant, newFound, newGrant) => ipcRenderer.send('change-folder-name', oldFound, oldGrant, newFound, newGrant)
});
