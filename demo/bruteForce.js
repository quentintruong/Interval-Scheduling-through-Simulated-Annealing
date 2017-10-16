const REPEAT_SIMULATION_TIMES = 200;
const NUMBER_OF_TRIALS = 20000;

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

    

    var bestResult = [];
    for(var i = 0; i < currentResult.length; i++){
        bestResult[i] = [];
        for(var j = 0; j < currentResult[i].length; j++){
            bestResult[i][j] = currentResult[i][j];
        }
    }

    var temp = maxPossibleValue;
    

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
        for(var i = 1; i < printingTimes[whichJob] && currentResult[0].indexOf(emails[whichJob])+i < 24; i++){
            currentResult[0][currentResult[0].indexOf(emails[whichJob])+i] = "";
        }

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

    

    }

    //console.log("best: " + valueOfResult(bestResult, printingTimes, emails));
    //printResult(bestResult);

    //return bestResult;
    //for (let item of possibleResults) {
    //    console.log(item);
    //    console.log("\n");
    //}

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

console.log("Brute Force Test completed");
console.log("Time taken: " + (end.getTime() - start.getTime()) + " ms");
console.log("Number of trials: " + NUMBER_OF_TRIALS);
console.log("Number of Iterations: " + REPEAT_SIMULATION_TIMES);

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