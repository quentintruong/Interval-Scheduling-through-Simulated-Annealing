//~~~Reminders~~~
//deal w/ trailing spaces
//deal w only 1 day of data vs 2 or 3 days of data
//set sheet to plain data
//
//~~~Notes~~~
//Column H is purely for records, has no real function (currently)
//runs on gScripts


function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Scripts')
        .addItem('processDay', 'processDay')
        .addToUi();
}


//function processDay()//trigger on midnight //regular
//~~~Collect Data~~~
//DataType: array[array[string null, string timeStamp, string email, string length, string d1T, string d2T, string d3T], ...]
//scrapes all data
//
//~~~Filter Irrelevant Data~~~
//filter out satisfied requests (necessary bc fittime and bc forms will always put it +1), only work on unsatisfied requests
//
//~~~Process Data~~~
//prepareData
//scheduleTimes (algorithm)
//
//~~~Output Data~~~
//prepareOutput
//emailDayAndSatisfy
function processDay()
{
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();  
  var allData = [];
  
  
  //~~~Collect data~~~
  for (var a = 2; a <= parseInt(ss.getLastRow()); a++){
    if (sheet.getRange(a, 1).getValue() != ""){
      var rowData = [];
      
      rowData[1] = sheet.getRange(a, 1).getValue();//string timeStamp
      rowData[2] = sheet.getRange(a, 2).getValue();//string email
      rowData[3] = sheet.getRange(a, 3).getValue();//string length
      rowData[4] = sheet.getRange(a, 4).getValue();//string d1T
      rowData[5] = sheet.getRange(a, 5).getValue();//string d2T
      rowData[6] = sheet.getRange(a, 6).getValue();//string d3T
      rowData[7] = sheet.getRange(a, 7).getValue();//string satisfied
            
      allData[a] = rowData;
    }
  }
  //for testing visualization + confirmation
  Logger.log("allData: ");
  Logger.log("numRows: " + ss.getLastRow());
  for (var a = 2; a <= parseInt(ss.getLastRow()); a++){
    Logger.log("row: " + a);
    for (var b = 1; b <= 7; b++){
      Logger.log("  allData[" + a + "][" + b + "]: " + allData[a][b]);
    }
  }
  Logger.log("");
  
  
  //~~~Filter Irrelevant Data~~~
  var relevantData = [];
  for (var a = 2; a < allData.length; a++){
    if (allData[a][7] == "false"){
      relevantData[relevantData.length] = allData[a];
    }
  }
  //for testing visualization + confirmation
  Logger.log("relevantData: ");
  for (var a = 0; a < relevantData.length; a++){
    Logger.log("row: " + a);
    for (var b = 1; b <= 7; b++){
      Logger.log("  relevantData[" + a + "][" + b + "]: " + relevantData[a][b]);
    }
  }
  Logger.log("");
  
  
  //~~~Process Data~~~
  var preparedData = prepareData(relevantData);
  //for testing visualization + confirmation
  for (var a = 0; a < relevantData.length; a++){
    Logger.log("job: " + a);
    Logger.log("  jobPossibilities: " + preparedData[0][a]);
    Logger.log("  jobLength: " + preparedData[1][a]);
    Logger.log("  jobEmailAddress: " + preparedData[2][a]);
  }
  var jobPossibilities = preparedData[0];
  var printingLengths = preparedData[1];
  var emailAddresses = preparedData[2];
  Logger.log("");
  var schedule = scheduleTimes(jobPossibilities, printingLengths, emailAddresses, 1);//possibilities, printingTimes, emails, numPrinters
  Logger.log("SCHEDULE: ");
  Logger.log(jobPossibilities[0]);
  Logger.log(jobPossibilities[1]);
  Logger.log(jobPossibilities[2]);
  Logger.log(jobPossibilities[3]);
  Logger.log(jobPossibilities[4]);
  Logger.log(printingLengths);
  Logger.log(emailAddresses);
  //var schedule = [];
  //             0  1  2  3  4  5  6  7  8  9  10 11 12 13 14            15 16 17 18 19 20            21 22 23
  //schedule[0] = ['','','','','','','','','','','','','','','email addy3','','','','','','email addy2','','','' ];//TEMP WAITING ON ALGORITHM
  
  
  //~~~Output Data~~~
  var preparedOutput = prepareOutput(schedule, emailAddresses, relevantData);
  emailDayAndSatisfy(preparedOutput);
  
  
}


//function processMostRecent()//trigger on formsubmit //lucky
///~~~Collect Data~~~
//scrape most recent line
//DataType: array[string timeStamp, string email, string length, string d1T, string d2T, string d3T]
//
//~~~Process Data~~~
//prepareData
//fitTime
//
//~~~Output Data~~~
//prepareEmail
//emaillMostRecent
//prepareSatisfy
//satisfy
function processMostRecent(){
}


//function prepareData(array[numJobs * array[string null, string timeStamp, string email, string d1T, string d2T, string d3T, string length, string satisfied]])
//return array[array[numJobs * array[24 * bool possibile]], array[numJobs * int hours], array[numJobs * string email], ...]
function prepareData(relevantData)
{
  var preparedData = [];
  var jobPossibilities = [];
  var jobLengths = [];
  var jobEmails = [];
  
  for (var a = 0; a < relevantData.length; a++){
    var possibleStartTimes = [];
    possibleStartTimes = preparePossibleStartTimes(relevantData[a][5]);
    jobPossibilities[a] = possibleStartTimes;
    jobLengths[a] = relevantData[a][6];
    jobEmails[a] = relevantData[a][2];
  }
  
  preparedData[0] = jobPossibilities;
  preparedData[1] = jobLengths;
  preparedData[2] = jobEmails;
  
  return preparedData;
}


//function preparePossibleStartTimes(string availableTimes)
//return array[24 * bool possible]
function preparePossibleStartTimes(availableTimes){
  var boolTimes = [];
  for (var a = 0; a < 24; a++){
    boolTimes[a] = false;
  }
  
  availableTimes = availableTimes.replace(/ /g, "");
  availableTimes = availableTimes.split(",");
  
  for (var a = 0; a < availableTimes.length; a++){
    if (availableTimes[a].indexOf("-") != -1){
      for (var b = availableTimes[a].substring(0, availableTimes[a].indexOf("-")); 
               b < availableTimes[a].substring(availableTimes[a].indexOf("-")+1);
               b++){
        boolTimes[b] = true;     
      }     
    }
    else{
      boolTimes[parseInt(availableTimes[a])] = true;
    }
  }

  return boolTimes;
}


//function fitTime()//lucky algorithm
//


//function prepareOutput(array[numPrinters * array[24 * string jobStart]], array[string email], array[array[string null, string timeStamp, string email, string length, string d1T, string d2T, string d3T], ...])
//return array[numJobs * array[string email, string dateTime, stringPrinter]]
function prepareOutput(schedule, emailAddresses, relevantData){
  var emailsData = [];
  for (var a = 0; a < emailAddresses.length; a++){
    var currEmail = [];
    currEmail[0] = emailAddresses[a];
    currEmail[1] = "";
    currEmail[2] = "";
    
    var printTime;
    for (var b = 0; b < schedule.length; b++){
      printTime = schedule[b].indexOf(emailAddresses[a]);
      if (printTime != -1){
        var jobDate = relevantData[a][1];
        var printTimeDate = new Date();
        printTimeDate.setMonth(jobDate.substring(0, jobDate.indexOf("/")));
        jobDate = jobDate.substring(jobDate.indexOf("/") + 1);
        printTimeDate.setDate(jobDate.substring(0, jobDate.indexOf("/")));
        printTimeDate.setDate(printTimeDate.getDate() + 2);
        jobDate = jobDate.substring(jobDate.indexOf("/") + 1);
        printTimeDate.setYear(jobDate.substring(0, jobDate.indexOf(" ")));
        printTimeDate.setHours(printTime);
        printTimeDate.setMinutes(0);
        printTimeDate.setSeconds(0);
        
        currEmail[1] = printTimeDate.toString();
        currEmail[1] = currEmail[1].substring(0, currEmail[1].indexOf(" GMT"));
        currEmail[2] = b + 1;
        b = schedule.length;//exit
      }
    }
    emailsData[a] = currEmail;
  }
  return emailsData;
}


//function emailDayAndSatisfy(array[numJobs * array[string email, string dateTime, string Printer]])
//return nothing
function emailDayAndSatisfy(emailsData){
  for (var a = 0; a < emailsData.length; a++){
    var currBody = "";
    if (emailsData[a][1] != ""){
      currBody = "Your time to print is: " + emailsData[a][1] + ".";
      satisfy(emailsData[a][0], emailsData[a][1]);
    }
    else{
      currBody = "There are no available times for you to print."
    }
    
    /*
    MailApp.sendEmail({
      to: emailsData[a][0],
      subject: 'UCLA 3D4E Printing Time',
      body: currBody,
    });*/
    Logger.log("currEmail: " + emailsData[a][0]);
    Logger.log("currSubject: UCLA 3D4E Printing Time");
    Logger.log("currBody: " + currBody);
  }
}


//function emaillMostRecent(array[string email, string time, stringPrinter])
//return nothing


//function satisfy(string email, string time)
//returns nothing
function satisfy(email, time){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();  
  var emails = [];
  
  //Collect Data
  for (var a = 2; a <= parseInt(ss.getLastRow()); a++){
    if (sheet.getRange(a, 1).getValue() != ""){
      emails[a] = sheet.getRange(a, 2).getValue();
    }
  }
  
  //Set satisfy to true
  sheet.getRange(emails.indexOf(email), 7).setValue("true");
  sheet.getRange(emails.indexOf(email), 8).setValue(time);
}


function scheduleTimes(possibilities, printingTimes, emails, numPrinters)
{
    const REPEAT_SIMULATION_TIMES = 1000;
  
    for(var i = 0; i < printingTimes.length; i++){
        printingTimes[i] = parseInt(printingTimes[i]);
    }

    //Helper Variables
    var nJobs = printingTimes.length;

    var maxPossibleValue = 0;
    for(var i = 0; i < printingTimes.length; i++){
        maxPossibleValue += printingTimes[i];
    }

    var currentResult = [];
    for(var i = 0; i < numPrinters; i++){
        currentResult[i] = [];

        for(var j = 0; j < 24; j++){
            currentResult[i][j] = "";
        }
    }
    
    //Greedy algorithm, from back
    //Get the latest job from the back that has the longest time
    var latestPrintEndingTimes = [];
    for(var i = 0; i < nJobs; i++){
        for(var j = 23; j >= 0; j--){
            if(possibilities[i][j] === true){
                latestPrintEndingTimes[i] = j + printingTimes[i];
                break;
            }
        }
    } 

    
    var maxLastest = Math.max.apply(null, latestPrintEndingTimes);
    var whichJob = latestPrintEndingTimes.indexOf(maxLastest);

    currentResult[0][maxLastest - printingTimes[whichJob]] = emails[whichJob];
    
    var currTime = maxLastest - printingTimes[whichJob];
    var lastJobTime = currTime;

    var jobTakenAlready = [];
    for(var i = 0; i < nJobs; i++){
        jobTakenAlready[i] = false;
    }
    jobTakenAlready[whichJob] = true;
    
    
    //Try and fit other jobs right before the latest job consecutively
    while(currTime >= 0){
        for(var i = 0; i < nJobs; i++){
            if(possibilities[i][currTime] === true && currTime+printingTimes[i] <= lastJobTime && !jobTakenAlready[i]){
                lastJobTime = currTime;
                currentResult[0][currTime] = emails[i];
                jobTakenAlready[i] = true;
                
            }
        }

        currTime--;
    }

    //console.log(currentResult[0]);

    if(valueOfResult(currentResult, printingTimes, emails) === maxPossibleValue){
        return currentResult;
    }


    //Simulated annealing algorithm to determine more optimal solution
    //Here we go! 
    
    var bestResult = [];
    for(var i = 0; i < currentResult.length; i++){
        bestResult[i] = [];
        for(var j = 0; j < currentResult[i].length; j++){
            bestResult[i][j] = currentResult[i][j];
        }
    }

  
  
    for(var sim = 0; sim < REPEAT_SIMULATION_TIMES; sim++){

        var whichJob = getRandomInt(0, nJobs);

        var possiblePermutations = [];
        for(var i = 0; i < possibilities[whichJob].length; i++){
            if(possibilities[whichJob][i] === true){
                possiblePermutations.push(i);
            }
        }

        //If -1, remove the job instead
        possiblePermutations.push(-1);

        var option = getRandomInt(0, possiblePermutations.length);
        var timeOfJob = currentResult[0].indexOf(emails[whichJob]);

        //Remove job!
        if(possiblePermutations[option] === -1){
            if(timeOfJob !== -1){
                currentResult[0][timeOfJob] = "";
            }
        }

        //Otherwise, move job to new position
        if(currentResult[0].indexOf(emails[whichJob]) !== -1){
            currentResult[0][timeOfJob] = "";
        }
        currentResult[0][possiblePermutations[option]] = emails[whichJob];

        

        //Remove Conflicting jobs
        for(var i = 1; i < printingTimes[whichJob] && currentResult[0].indexOf(emails[whichJob])+i < 24; i++){
            currentResult[0][currentResult[0].indexOf(emails[whichJob])+i] = "";
        }

        for(var i = 0; i < 24; i++){
            if(currentResult[0][i] !== ""){
                var maybeDeleteJob = currentResult[0][i];
        
                for(var j = i+1; j < printingTimes[emails.indexOf(maybeDeleteJob)]+i && j < 24; j++){
                    if(currentResult[0][j] !== ""){
                        currentResult[0][i] = "";
                        break;
                    }
                }
            }
        }

        if(valueOfResult(currentResult, printingTimes, emails) > valueOfResult(bestResult, printingTimes, emails)){
            copyArray(bestResult, currentResult);
        }

        //Determine whether to accept new proposal
        if(!acceptProposal(currentResult, bestResult, maxPossibleValue, printingTimes, emails)){
            copyArray(currentResult, bestResult);
        }

    }
    
    Logger.log(bestResult[0]);
    return bestResult;

}

//Copy array2 into array1
function copyArray(arr1, arr2){
    for(var i = 0; i < arr2.length; i++){
        arr1[i] = [];
        for(var j = 0; j < arr2[i].length; j++){
            arr1[i][j] = arr2[i][j];
        }
    }
}

//Print [0] of a result
function printResult(result){
    var print = "";
    for(var i = 0; i < result[0].length; i++){
        if(result[0][i] === ""){
            print += "0";
        }
        else{
            print += result[0][i];
        }
    }
    Logger.log(print);
}

//Returns an int [min, max)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

//Checks if object is an empty object
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

//Returns value of a result in simulation
function valueOfResult(result, printingTimes, emails){
    var value = 0;
    for(var i = 0; i < 24; i++){
        if(result[0][i] != ""){
            var whichJob = emails.indexOf(result[0][i]);
            value += printingTimes[whichJob];
        }
    }

    return value;
}

//Determines whether to accept new result
function acceptProposal(current, best, maxPossibleValue, printingTimes, emails){
    if(valueOfResult(current, printingTimes, emails) > valueOfResult(best, printingTimes, emails))
        return true;

    if(valueOfResult(current, printingTimes, emails) === maxPossibleValue)
        return true;

    //Metropolis Algorithm, maxPossibleValue should be modified?
    var prob = Math.exp(-(valueOfResult(best, printingTimes, emails)-valueOfResult(current, printingTimes, emails))/maxPossibleValue);
    return prob > Math.random();
}

