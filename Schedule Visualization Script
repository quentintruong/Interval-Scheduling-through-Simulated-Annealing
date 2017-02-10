//Sheet structure:
//A         B               C                               D   E   F   G   H   I   J   K   L   M   N   O   P   Q   R   S   T   U   V   W   X   Y   Z   AA
//Request	Print Length	Time(s) available	            8	9	10	11	12	13	14	15	16	17	18	19	20	21	22	23	0	1	2	3	4	5	6	7
//
//Sample Input: 
//A	        4	            8 9 13 14 15 17 18 19 20 21 22

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Scripts')
      .addItem('mapTime', 'mapTime')
      .addToUi();
}

function mapTime() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  var cellRow = [];
  
  //Finds cells
  for (var a = 2; a <= parseInt(ss.getLastRow()); a++){
    if (sheet.getRange(a, 1).getValue() != ""){
      cellRow[cellRow.length] = a;
    }
  }
  
  for (var a = 0; a < cellRow.length; a++){
    //Cell
    sheet.setRowHeight(cellRow[a], 21);
    var reqCell = sheet.getRange(cellRow[a], 1);
    Logger.log("Cell: " + reqCell.getValue());
    
    //Length
    var printLengthCell = sheet.getRange(cellRow[a], 1 + 1);
    var printLength = printLengthCell.getValue().trim();
    Logger.log("Print Length: " + printLength);
    
    //Individual Times
    var availableCell = sheet.getRange(cellRow[a], 1 + 2);
    var availableTimes = availableCell.getValue().trim();
    Logger.log("Available Times: " + availableTimes);
    var individualTimes = availableTimes.split(" ");
    
    //Clear backgrounds
    sheet.getRange(cellRow[a], 1 + 3, individualTimes.length + 2, 24).setBackground(null);
    
    for (var b = 0; b < individualTimes.length; b++){
      //Change height
      sheet.setRowHeight(cellRow[a] + b + 1, 7);
      
      //Draw lines
      Logger.log("Individual Times: " + individualTimes[b]);
      var myCell = sheet.getRange(cellRow[a] + b + 1, 1 - 5 + parseInt(individualTimes[b]), 1, 1);
      var myRange = sheet.getRange(cellRow[a] + b + 1, 1 - 5 + parseInt(individualTimes[b]), 1, printLength);
      myRange.setBackground("lime");
      myCell.setBackground("green");
    }
  }
}
