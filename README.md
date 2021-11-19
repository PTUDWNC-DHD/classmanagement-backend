# Link host heroku server:
[classroom-server-project.herokuapp.com](https://classroom-server-project.herokuapp.com/)

# API
## Class api

***get***|  **/class/**  
Get all class info  
*input* =>  
**None**  
*output* =>  
List of Classes's Info  
  
***post***|  **/class/**  
Create class  
*input* =>   
**name**: Name of class *required*  
**ownerId**: Class's creator *required*  
*output* =>   
Class Info  
  
***get***|  **/class/{classId}/**  
Get class info  
*input* =>   
**None**  
*output* =>   
Class Info  
  
***patch***|  **/class/{classId}/**  
Update data of class  
*input* =>   
**name**: New name of class  
**isEnded**: New status of class  
*output* =>   
Class Info  
  
***get***|  **/class/{classId}/users**  
Get users of class  
*input* =>   
**None**  
*output* =>   
List of users who join class  
  
## User api
  
***get***|  **/user/**  
Get all user info  
*input* =>   
**None**  
*output* =>   
List all Users's Info  
  
***post***|  **/user/**  
Create user  
*input* =>   
**email**: email to login *required*  
**username**: username to login *required*  
**password**: password to login *required*  
**name**: Name to show default in classes *required*  
*output* =>   
User Info  
  
***get***|  **/user/{userId}**  
Get user info  
*input* =>   
**None**  
*output* =>   
User Info  
  
***patch***|  **/user/{userId}**  
Update user info  
*input* =>   
**email**: New email  
**username**: New username  
**password**: New password  
**name**: New name  
*output* =>   
User Info  
  
***delete***|  **/user/{userId}**  
Delete user  
*input* =>   
**None**  
*output* =>   
**true**  
  
***get***|  **/user/{userId}/classes**  
Get all classes that user join  
*input* =>   
**None**  
*output* =>   
List of classes  
  
## Participation api  
  
***get***|  **/join/**  
Get all participations info  
*input* =>   
**None**  
*output* =>   
List all participations's Info  
  
***post***|  **/join/**  
Create participation  
*input* =>   
**userId**: id of user  
**classId**: id of class *required*  
**code**: Student code ( *required* if **isStudent = true**)  
**isStudent**: *true* if student and *false* if teacher  *required*  
**name**: Name to show in classes *required*  
*output* =>   
Participations Info  
  
***get***|  **/join/{participationId}**  
Get participation info  
*input* =>   
**None**  
*output* =>   
participation Info  
  
***delete***|  **/join/**  
Get participation info  
*input* =>   
**userId**: id of user (*required* if not have **code**)  
**code**: Student code (*required* if not have **userId**)  
**classId**: id of class *required*  
*output* =>   
**true**  
