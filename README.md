# Link host heroku server:
[classroom-server-project.herokuapp.com](https://classroom-server-project.herokuapp.com/)

# API
## Class api

***get***|  ```/class/``` 
Get all class info  
*input* =>  
**None**  
*output* =>  
List of Classes's Info  
  
***post***|  ```/class/```  
Create class  
*input* => (Authentication required with Bearer token)   
**name**: Name of class *required*  
*output* =>   
Class Info  
  
***get***|  ```/class/{classId}/```  
Get class info  
*input* => (Authentication required with Bearer token)   
**None**  
*output* =>   
Class Info  

***patch***|  ```/class/{classId}/```

Update data of class  
*input* => (Authentication required with Bearer token)   
**name**: New name of class  
**isEnded**: New status of class  
*output* =>   
Class Info  
  
***get***|  ```/class/{classId}/users```  
Get users of class  
*input* => (Authentication required with Bearer token)   
**None**  
*output* =>  
* **students**: List of student  
** **classId**: Id of class  
** **userId**: Id of user if mapped with a account *not required*  
** **name**: Name of user   
** **code**: Student code if student *not required*  
* **teachers**: List of student  
** **classId**: Id of class  
** **userId**: Id of user if mapped with a account *not required*  
** **name**: Name of user   
  
## User api
  
***get***|  ```/user/```  
Get all user info  
*input* =>   
**None**  
*output* =>   
List all Users's Info  
  
***post***|  ```/user/```  
Create user  
*input* =>   
**email**: email to login *required*  
**username**: username to login *required*  
**password**: password to login *required*  
**name**: Name to show default in classes *required*  
*output* =>   
User Info  
  
***get***|  ```/user/{userId}```  
Get user info  
*input* => (Authentication required with Bearer token)   
**None**  
*output* =>   
User Info  
    
***get***|  ```/user/me```  
Get my info  
*input* => (Authentication required with Bearer token)   
**None**  
*output* =>   
User Info  
  
***patch***|  ```/user/me```  
Update my info  
*input* => (Authentication required with Bearer token)   
**email**: New email  
**username**: New username  
**password**: New password  
**name**: New name  
*output* =>   
User Info  
  
***delete***|  ```/user/me```  
Delete me  
*input* => (Authentication required with Bearer token)   
**None**  
*output* =>   
**true**  
  
***get***|  ```/user/me/classes```  
Get all my classes  
*input* =>   
**None**  
*output* =>   
List of classes  
  
## Participation api  
  
***get***|  ```/join/```  
Get all participations info  
*input* =>   
**None**  
*output* =>   
List all participations's Info  
  
***post***|  ```/join/{invitecode}```  
Add user into class  
*input* => (Authentication required with Bearer token)   
**code**: Student code (*required* if **isStudent = true**)  
**isStudent**: *true* if student and *false* if teacher  *required*  
**name**: Name to show in classes *required*  
***DO NOT ADD BELOW IF ADD YOURSELF***  
**userId**: id of user  
*output* =>   
Participations Info  
  
***get***|  ```/join/{participationId}```  
Get participation info  
*input* => (Authentication required with Bearer token)   
**None**  
*output* =>   
participation Info  
  
***delete***|  ```/join/```  
Remove a user from class  
*input* => (Authentication required with Bearer token)   
**classId**: id of class *required*  
***DO NOT ADD BELOW IF REMOVE YOURSELF***  
**userId**: id of user (*required* if not have **code**)  
**code**: Student code (*required* if not have **userId**)  
*output* =>   
**true**  

  
## Invite api  
  
***get***|  ```/invite/```  
Invite to class by email  
*input* => (Authentication required with Bearer token)   
**to**: List of email  
**invitecode**: invite code of class  
*output* =>   
**true** if success  
  
