//
//  main.cpp
//  RandomCases
//
//  Created by Edward Chu on 11/2/2017.
//  Copyright © 2017 Puffins. All rights reserved.
//

#include <iostream>
#include <string>

using namespace std;

const double PERCENTAGE = 50;
const int MINIMUM_PEOPLE = 2;

int main() {
    
    srand(time(NULL));

    
    int numPeople = rand() % 3 + MINIMUM_PEOPLE;
    
    string* schedule = new string[numPeople];
    int* printTimes = new int[numPeople];
    
    
    for(int i = 0; i < numPeople; i++){
        printTimes[i] = rand() % 14 + 1;
        
        for(int j = 8; j < 23; j++){
            int randNum = rand()%100 +1;
            
            if(randNum < PERCENTAGE){
                schedule[i] += to_string(j);
                schedule[i] += " ";
                //cout << schedule[i];
            }
        }
    }
    
    for(int i = 0; i < numPeople; i++){
        cout << printTimes[i] << endl;
        cout << schedule[i] << endl;
    }
    
    delete[] schedule;
    delete[] printTimes;
}
