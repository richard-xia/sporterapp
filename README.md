# Sporter

Sporter is a MERN Application dedicated for creating sports groups and games. You can visit this project at [Sporter](https://sporterapp.herokuapp.com/) hosted on Heroku. This web application was created for my honours project at Carleton University and the core features of my application have been completed. There are no significant bugs or issues, however there are many ways the code can be improved. In this .README I will discuss how to run this application locally, the features and future improvements. You can also view a detailed final report of my project [here.](https://docs.google.com/document/d/1X9Bop_EQQWt0C6O9YUFMF3ybR9IjYfobb2eLX4mhIt4/edit?usp=sharing) 

The main account for testing the app is: `(email: test@gmail.com, password: 123456)`

# Running Locally

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

# Features

Users can create and manage their own groups and games using Sporter, including the roles of other users. There are 3 roles for Groups (Manage Users, Create Games and Invite Users) and 3 roles for Games (Manage Users, Manage Teams and Invite Users). Games can either belong to a specific group which tracks their wins and losses, or be open to users in any group.

Groups and games are very similar in terms of data structure, with the main difference that groups have a one-to-many relationship with games. Both models contain requests and users with roles. Games can additionally contain teams and the game creator can select the "finish game" option to update wins and losses in their group. Users can view a list of their invites on their own profile, or send an invite on another user's profile.

Groups and games can also be competitive or private. Competitive groups track wins and losses and can contain any type of games. Competitive games do not contain teams and do not change the wins and losses of users in the group. Private groups and games will not appear in the map on search bar and users must be invited by the creator.

Finally, the application contains maps for both setting the location of groups/games and finding other groups/games. Only the creator can change the location of a group or game. The "Show groups/games near me" button on the dashboard will display all public groups and games near the current user's location they are not part of.

# Future Improvements

* .css
 
 The .css of this application currently only supports full-screen browsers and contains inline styling. The best practice would be to have individual module.css files that have media queries for different screen sizes.
 
* Changing Requests

 It would be beneficial to include an option for users to join groups and games without having to make requests or be invited similar to open games. This would require another option in the menu, however it would also make joining groups and games much easier. 
 
 * Accessing the app without logging in

 All pages in the application currently require the user to be logged in order to display information. Groups, games and users should all be able to be displayed without requiring the user to login. This function can be optimized by using Next.js to improve search results. 
 
  * Social Media
 
 Adding social media features can greatly improve the usability of the application and allow users to better communicate and plan games. Having users be able to make posts can also significantly improve the amount of content in group and game pages. 
 
  * Adding matchmaking

 Most sports applications do not have a matchmaking feature which do not require users to find their own games. Adding an option that automatically puts users in a game with others could be a very useful feature, however there are many different considerations with calculating skill level.  

# Conclusion

I believe this application has a lot more potential to become a useful service and help improve the fitness of individuals. Many current sports management applications are not made for finding other users to interact with and can be difficult to navigate. I hope to add many improvements discussed in this section in the future.
