# Interval-Scheduling
Optimizes requests for intervals of time, sends e-mails; gForms/Sheets/Scripts

~~~Sheet Structure~~~
A                  B                         C            D               E               F                  G                 H
Timestamp          Email Address             Length       Day 0 Times     Day 1 Times     Day 2 Times        Satisfied (y/n)   Given Date/Time   

~~~Sample Input Data~~~
2/11/2017 9:10:26  email@gmail.com   5            8               11-12           8-13, 19-21     

~~~Interface~~~
gForm, e-mail

~~Test Data~~~
A                   B    C   D  E                           F   G
2/11/2017 9:10:26	ad1			8, 9, 19, 20, 21, 22	    5	false
2/11/2017 9:10:26	ad2			8, 12, 19, 20 	            7	false
2/11/2017 9:10:26	ad3			8, 13, 14, 18, 19, 20, 21	3	false
2/11/2017 9:10:26	ad4			8, 9, 10, 11, 20, 21, 22	1	false
2/11/2017 9:10:26	ad5			8, 9, 13, 14, 15, 16, 17	5	false