# Interval Scheduling through Simulated Annealing

Schedules conflicting, variable-length events with multiple possible start times to achieve near-optimal use of time, using simulated annealing and greedy algorithms. 

Communicates with Google Spreadsheets to receive/send input/output data and sends e-mails to users. 

Triggers functions through Google API's.

---
###Sheet Structure
| A          | B              | C     | D          | E           | F           | G             |H
|------------|:---------------|:------|:-----------|:------------|:------------|:--------------|:--------------|
| Timestamp  |Email Address   | Length| Day 0 Times| Day 1 Times | Day 2 Times |Satisfied (y/n)|Given Date/Time|   
---
###Sample Test Data

| A                | B              | C  | D  | E                       | F  | G  |
|------------------|:---------------|:---|:---|:------------------------|:---|:---|
| 2/11/2017 9:10:26|address1        |    |    |8, 9, 19, 20, 21, 22     |    |    |
| 2/11/2017 9:10:26|address2        |    |    |8, 12, 19, 20            |    |    |
| 2/11/2017 9:10:26|address3        |    |    |8, 13, 14, 18, 19, 20, 21|    |    |
| 2/11/2017 9:10:26|address4        |    |    |8, 9, 10, 11, 20, 21, 22 |    |    |
| 2/11/2017 9:10:26|address5        |    |    |8, 9, 13, 14, 15, 16, 17 |    |    |

Visualization of test data available here: https://goo.gl/fWE2i1
