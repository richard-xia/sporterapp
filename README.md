# Sporter
![alt text](https://i.imgur.com/M89H3ug.jpg)

Sporter is a sports management application created using the MERN stack. You can visit this project at [Sporter](https://sporter-project.herokuapp.com/) hosted on Heroku. This application was created for my honours project at Carleton University to improve and demonstrate my knowledge of web development. In this .README I will cover the features and future improvements. You can also view a detailed final report of my project [here.](https://docs.google.com/document/d/1X9Bop_EQQWt0C6O9YUFMF3ybR9IjYfobb2eLX4mhIt4/edit?usp=sharing) 

The main account for testing the app: `(email: test@gmail.com, password: 123456)`

Several other accounts exist for testing purposes inside the `/backend/_data/users.json` folder. These accounts include:
* `(email: johndoe@gmail.com, password: 123456)`
* `(email: sarah@gmail.com, password: 123456)`
* `(email: grace@gmail.com, password: 123456)`
* `(email: richard_xia@hotmail.com, password: password)`

## Key Features

* RESTful API using Express and MongoDB
* React Functional Components with Bootstrap
* Google Maps API using `react-google-maps` and `react-google-autocomplete`
* Authentication with `jsonwebtoken` and `bcryptjs`
* HTTP Requests and Authorization using `axios`
* `multer` and `express-fileupload` for images
* `moment` for time zone conversion
* CSS Grid, CSS Flexbox
* Deployed on Heroku

## Demo Video
[![Watch the video](https://i.imgur.com/2oQD3Qo.jpg)](https://www.youtube.com/watch?v=orInzM-GwM4)

## Running Locally

In order to run this application locally, you can run `git clone` or download the .zip file for the project. You must also install the project in the frontend and backend folders.

1. `cd frontend`
2. `npm install`
3. `cd ../backend`
4. `npm install`

You can start the project locally by running the backend server and `npm start` in the frontend

1. `cd backend`
2. `node server.js`
3. `cd frontend` (in another terminal)
4. `npm start`

If you want to reload the original data in the server you can run `node seeder -d` and `node seeder -i` in the backend folder.

1. `cd backend`
2. `node seeder -d`
3. `node seeder -i`

## Project Description
### Overview
Sporter is a light-weight application designed to make managing and finding sports games easier. There are many other sports  
management applications like Javelin or Find a Player, however they are less user friendly and sometimes require subscriptions. The idea behind Sporter is to create a simple sports platform where users can keep track of wins/losses, manage users/roles and find nearby games easily.  

### UML Class Diagram
![alt text](https://i.imgur.com/Ck6JF4g.png)

There are 3 primary data structures in this application: Users, Groups and Games. Users can belong to many different groups and games, while groups and games must contain at least 1 user. Sports groups can also contain many different games, however a group game must belong to a group. In addition, users can create open games that do not belong to any particular group and can contain users from any group. 

Users can send a request to join a group/game which is contained inside the `requests` ObjectId array. Users can also be invited to a group/game by another user which is contained inside the user's `groupInvites/gameInvites` ObjectId array. Games contain additional fields like the ObjectId array of team members and the winner of the game. There are also boolean values like `private` for groups/games where users must be invited inside and requests cannot be made. If a group does not want to keep track of wins and losses they can set `competitive` to false. All games inside that group will also have be non-competitive and will not contain any teams. 

There are also several other fields I have not discussed to keep this report concise. Please see the [demo video](https://www.youtube.com/watch?v=orInzM-GwM4) or [final report](https://docs.google.com/document/d/1X9Bop_EQQWt0C6O9YUFMF3ybR9IjYfobb2eLX4mhIt4/edit?usp=sharing) for a full explanation.

### Use Cases

We will be covering 3 primary types of uses cases (Users, Groups and Games). First, we will examine use cases for the users model which include actions of individual users outside of games and groups. Next, we will examine the use cases for different roles inside the groups model. Finally, we will examine the use cases for different roles inside the games model. 

#### Users

![alt text](https://i.imgur.com/XqsJBma.png)

From the user's perspective they have 6 different use cases for managing their groups, games and profile. To avoid redundancy, the use cases for accepting/denying invites, making requests and leaving groups and games have all been grouped together.

* The first use case allows a user to update their profile including their bio, profile picture and private setting. Enabling the private setting will hide their groups/games on their profile and they will not appear in the search bar (unless the user performing the search shares a group with the private user). 
* The second use case simply covers the user's ability to accept or deny an invite from their profile. 
* Similarly, the third use case covers the users ability to send a request to join a group or game. 
* The fourth use case for creating a group also includes the action for creating a group game. Note, that users must also have permission to create games inside a group which will be covered in the next diagram. 
* In the fifth use case, users do not require permission to create an open game since it does not belong to any group. 
* The sixth use case covers the user's ability to leave groups or games. Leaving a game will remove the user from any current teams they belong to. Leaving a group will remove the user from any group games and teams they currently belong to.

#### Groups

![alt text](https://i.imgur.com/ulQjmTR.png)

There are also 6 use cases that make up the actions of users inside a group depending on their role. Only the group's creator has access to every permission available to other roles. 

* The first use case covers the ability for the creator to update the group's information or delete the entire group. The creator can change the name, picture, description or the current location of the group.  
* The second use case covers the action for accepting or denying other user's requests to join the current group. Only the creator or users who are allowed to manage users can accept or deny requests.
* The third use case covers the action for changing the role of another user inside the group. Users who can manage users can also change the role of other users, however they cannot change the role of the creator. In addition, if two users can both manage users then they cannot change each other's role.
* The fourth use case allows users to delete a user from the group. Similarly, only the creator can delete any user from the group. Users with the manage users role can only delete users who can only create games/invite users.
* The fifth use case allows users to create games within the group. Only the creator and users with the create games role are allowed to create group games. This is to prevent users from creating fake games to increase their number of wins within the group.
* The sixth use case is for users to invite others into the group. This is in case the creator of the group does not want users to be able to join without permission from a user who can invite others. 


#### Games

![alt text](https://i.imgur.com/0TbfS1a.png)

Games and groups have very similar roles, except the create games role is replaced by the manage teams role.
To avoid redundancy the same roles (manage users and invite users) from the previous diagram have been omitted, however they are still present inside the games model.

* In addition to changing the information of a game, the creator has the option of finishing the game. After the creator selects the game's winner, the wins and losses of users inside the group are updated accordingly based on their current team. 
* Instead of having a role for users to create games, users can be given permission to manage teams. Like the settings inside groups and games, teams can also have a name and display picture. Users who can manage teams can also add or remove users from a team or switch their current team.

## Discussion

### Storage vs. Optimization

![alt text](https://i.imgur.com/sW0pCGs.png)

It is possible to optimize the database storage inside of the application by removing the array of groups and games within the Users data schema. For example, in the image above users are already defined inside of the games model, so all their games can be found by querying the Games data model. For the scale of my application, I believe that it is better practice to have a bidirectional relationship between groups/games and users to model data more accurately. Removing these fields could also affect the performance of the application, however if the number of HTTP requests stay the same it should be negligible.

The schema for Groups/Games/Users also have some fields that are repeated across multiple objects. For example, the name and photo of users are also stored inside the array of users and the array of teams for the Games schema. I decided to repeat these fields to make accessing data simpler, however I do not actually save any of these values inside of the database to reduce storage.  

### Fixes

##### Responsive Design

A significant issue with the frontend of the application is that it only supports full-screen browsers for desktops. Most pages currently use CSS grid which should be responsive, however I have included the `mdbreact` package for scrollbars which uses a fixed-width. It is possible to add media queries to change the size of the list components, however this could also impact the display of content inside each box. I decided to focus primarily on REST API functionality rather than .css for my project, but I plan to look more into responsive design. 

##### MongoDB Queries

![alt text](https://i.imgur.com/kT2rW1K.jpg)

In the backend there are many instances where data is accessed and modified using regular Javascript instead of MongoDB queries. For example, when a group is deleted the group and it's group games must also be removed from the every user in that group (shown in the image above). The proper convention for removing all group games from users would be to perform an operation like:

`users.updateMany({$pull: {games: {_id: game._id}}})`

Currently, this operation does not work potentially due to an issue with how data is defined in the schema or seeder. Although the application is still able to perform operations successfully, this is an important change that should be implemented to follow proper conventions and improve readability of code.  

##### Refreshing the page on Heroku

When visiting the app deployed on Heroku, refreshing the page for a group, game or user will cause a blank page to appear. This is most likely due to a problem with configuring the React build file inside the `server.js`. This could also potentially be a routing issue since this problem does not occur with static routes like the dashboard or landing page. Attempting to fix this issue proved to be time-consuming, as my focus was primarily to develop an elaborate REST API.  

### Future of Sporter
 
##### Joining without Requests or Invites

Currently, users must send a request or be invited to join a group or group game; however users can join an open game without making a request. It would be beneficial to add another boolean field for whether users can join a group or game without making requests or being invited. It would also be beneficial so that users can prevent others from joining their open game without making a request first. I originally planned on adding this functionality, but forgot to after finishing the project. This would not be very difficult from a technical standpoint, however it can be time-consuming since the frontend has already been implemented.
 
##### Accessing pages without logging in

In order to visit the page for a group, game or user profile the visitor must be logged in. Ideally, users should be able to visit any page without having an account. This is an important feature that I planned on adding, however it seemed unnecessary without using Next.js to optimize search results.

##### Hierarchical-Ranked Games
 
There are many sports that use a hierarchical ranking system (i.e. 1st place, 2nd place, etc.) like Golf or Running that do not simply have a winner or loser. It would be useful to include a feature that allows users to create groups and games based on hierarchical rankings and set the finishing position of all users. This would be a helpful implementation to have in the future to improve the practical usage of the application. 
 
##### Social Media
 
Another approach to improve the practical usage of the application is by adding social media features to the website (e.g. Posts, Chat and Notifications). Having the ability to post content is extremely beneficial for such an application. For example, users could upload pictures or link videos of their game. A chat option would also make planning and organizing games much easier and allow teams to discuss strategy before games. Notifications are another common social media feature that would be helpful to include. If a user makes a request to join a group the creator could be notified or when a user gets invited to a group they should be notified. 

##### Matchmaking Features

Finally, having a matchmaking option is a unique feature that most sports applications currently do not have. It would be interesting to allow players to be placed automatically in a game without having to create or join any groups. This could also be applied to teams that wish to compete against another team for any sport. This feature would not be too difficult to implement if the matchmaking algorithm is random. If we attempt to compute the skill level for users or even teams this could get immensely complex, which would likely require AI to determine accurate rankings.

## Conclusion

There are many improvements that can be made to the application both technically and logistically, however creating this project has been very helpful in furthering my knowledge of full-stack development. Most importantly, I learned how to build a RESTful API that can interact dynamically with React components. I was able to obtain a better understanding of how to handle routing from both the backend and frontend of an application, as well as managing stateless React functional components. This project has been very helpful and improved my knowledge of building large, scalable applications. I plan on improving these skills by polishing this application and throughout my future projects. If you have any inquiries please feel free to contact me at: richard_xia@hotmail.com
