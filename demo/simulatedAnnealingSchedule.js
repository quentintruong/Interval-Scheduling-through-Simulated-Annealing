const NUMBER_OF_ITERATIONS = 100;
const COOLING_RATE = 0.212;
const NUMBER_OF_TRIALS = 20000;

const HOURS_IN_DAY = 24;
const OPENING_TIME = 8;
const CLOSING_TIME = 6;

function scheduleTimes(possibilities, printingTimes, emails, numPrinters)
{

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

    
    var maxLastest = Math.max.apply(Math, latestPrintEndingTimes);
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

    //console.log(valueOfResult(currentResult, printingTimes, emails));
    
    
    //Simulated annealing algorithm to determine more optimal solution
    //Here we go! 
    
    var bestResult = [];
    copyArray(bestResult, currentResult);

    var temp = maxPossibleValue;

    for(var sim = 0; sim < NUMBER_OF_ITERATIONS; sim++){


        var whichJob = getRandomInt(0, nJobs);

        var possiblePermutations = [];
        for(var i = 0; i < HOURS_IN_DAY; i++){
            if(possibilities[whichJob][i] === true){
                possiblePermutations.push(i);
            }
        }

        //If -1, remove the job instead
        possiblePermutations.push(-1);

        //console.log("Which job: " + emails[whichJob]);

        //console.log("possible moves: " + possiblePermutations);

        var option = getRandomInt(0, possiblePermutations.length);


        var timeOfJob = currentResult[0].indexOf(emails[whichJob]);

        //Remove job!
        if(possiblePermutations[option] === -1){
            //console.log("removing job " + emails[whichJob]);
            if(timeOfJob !== -1){
                currentResult[0][timeOfJob] = "";
            }
        }
       
        //console.log("Where to put it: " + possiblePermutations[option]);

        //Otherwise, move job to new position
        if(currentResult[0].indexOf(emails[whichJob]) !== -1){
            currentResult[0][timeOfJob] = "";
        }
        currentResult[0][possiblePermutations[option]] = emails[whichJob];

        

        //Remove Conflicting jobs
        //after the new pos of job
        for(var i = 1; i < printingTimes[whichJob] && currentResult[0].indexOf(emails[whichJob])+i < 24; i++){
            currentResult[0][currentResult[0].indexOf(emails[whichJob])+i] = "";
        }

        //before new pos of job
        for(var i = 0; i < 24; i++){
            if(currentResult[0][i] !== ""){
                var maybeDeleteJob = currentResult[0][i];
                //console.log("maybe delete job " + currentResult[0][i]);
                //console.log("Printing time of this job " + printingTimes[emails.indexOf(maybeDeleteJob)]);

                for(var j = i+1; j < printingTimes[emails.indexOf(maybeDeleteJob)]+i && j < 24; j++){
                    if(currentResult[0][j] !== ""){
                        //console.log("deleting job " + currentResult[0][i]);
                        currentResult[0][i] = "";
                        break;
                    }
                }
            }
        }

        //console.log("current: " + valueOfResult(currentResult, printingTimes, emails));
        //printResult(currentResult);

        //console.log("best: " + valueOfResult(bestResult, printingTimes, emails));
        //printResult(bestResult);

            //printResult(currentResult);

        if(valueOfResult(currentResult, printingTimes, emails) > valueOfResult(bestResult, printingTimes, emails)){
            copyArray(bestResult, currentResult);
        }

        //Determine whether to accept new proposal
        if(!acceptProposal(currentResult, bestResult, temp, printingTimes, emails)){
            copyArray(currentResult, bestResult);
        }

        //console.log();
        
        temp *= COOLING_RATE;
        //console.log(temp);

    }

    //console.log("best: " + valueOfResult(bestResult, printingTimes, emails));
    //printResult(bestResult);

    //console.log(possibleResults.size);
    return valueOfResult(bestResult, printingTimes, emails);

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
    console.log(print);
}

//Returns an int [min, max)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


//Returns value of a result in simulation
function valueOfResult(result, printingTimes, emails){
    var value = 0;
    for(var i = 0; i < 24; i++){
        if(result[0][i] !== ""){
            var whichJob = emails.indexOf(result[0][i]);
            value += printingTimes[whichJob];
        }
    }

    return value;
}

//Determines whether to accept new result
function acceptProposal(current, best, maxPossibleValue, printingTimes, emails){

    var currentValue = valueOfResult(current, printingTimes, emails);
    var bestValue = valueOfResult(best, printingTimes, emails);

    if(currentValue > bestValue)
        return true;

    //if(valueOfResult(current, printingTimes, emails) === maxPossibleValue)
    //    return true;

    //Metropolis Method
    var prob = Math.exp(-(bestValue-currentValue)/maxPossibleValue);

    //console.log(-(valueOfResult(current, printingTimes, emails)));
    return prob > Math.random();
}


//TEST CASES, PLEASE DELETE
var numJobs = 5;

var p = [];
for(var i = 0; i < numJobs; i++){
    p[i] = [];
    for(var j = 0; j < 24; j++){
        p[i][j] = false;
    }
}

p[0][8] = true;
p[0][9] = true;
p[0][19] = true;
p[0][20] = true;
p[0][21] = true;
p[0][22] = true;

p[1][8] = true;
p[1][12] = true;
p[1][19] = true;
p[1][20] = true;

p[2][8] = true;
p[2][13] = true;
p[2][14] = true;
p[2][18] = true;
p[2][19] = true;
p[2][20] = true;
p[2][21] = true;

p[3][8] = true;
p[3][9] = true;
p[3][10] = true;
p[3][11] = true;
p[3][20] = true;
p[3][21] = true;
p[3][22] = true;

p[4][8] = true;
p[4][9] = true;
p[4][13] = true;
p[4][14] = true;
p[4][15] = true;
p[4][16] = true;
p[4][17] = true;


var printingTimes = [5, 7, 3, 1, 5];
var numPrinters = 1;

var emails = ["a", "b", "c", "d", "e"];

var total = 0;

var resultCounts = [];
for(var i = 0; i <= 18; i++){
    resultCounts[i] = 0;
}

var start = new Date();

for(var i = 0; i < NUMBER_OF_TRIALS; i++){   
    var trialResult = scheduleTimes(p, printingTimes, emails, numPrinters);
    resultCounts[trialResult]++;
    total += trialResult;
}

var end = new Date();

console.log("-----------------------------");

console.log("Simulated annealing completed");
console.log("Time taken: " + (end.getTime() - start.getTime()) + " ms");
console.log("Number of Trials: " + NUMBER_OF_TRIALS);
console.log("Number of Iterations: " + NUMBER_OF_ITERATIONS);
console.log("Cooling rate: " + COOLING_RATE);

console.log("Average amount of hours used: " + total/NUMBER_OF_TRIALS); 
console.log("Percentage of trials optimized: " + (total/NUMBER_OF_TRIALS)/18 * 100 + "%")

var display0to18 = [];
for(var i = 0; i <= 18; i++){
    display0to18.push(i);
}

console.log("\nFrequency: ");
console.log(display0to18);
console.log(resultCounts);

console.log("-----------------------------");