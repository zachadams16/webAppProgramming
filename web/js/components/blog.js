function blog(id) {

    // ` this is a "back tick". Use it to define multi-line strings in JavaScript.
    var content = `  
      <p>
        <strong> Week 1: </strong> <br/>
            The thing I found hard about week one was formatting my website in the way I wanted with the style 
            sheet some things just didn't go where I wanted them too.<br/> <br/>
    
        <strong> Week 2: </strong> <br/>
            The thing I found hard about setting up a database was the foriegn keys 
            <a href = "pics/ZachAdams.pdf">My document</a><br/><br/>
    
        <strong>  Week 3: </strong> <br/>
            The work I did this week was mainly based on webAPIs and undersatnding them. I also added routing to my home page<br/>
            I wrote the server side code in listOtherAPI.jsp. I learned important concepts of server side code and how to generate errors.
           <br/> I also learned about how to call and access data from sql in a jsp file. <br/>
           The thing I found difficult was setting up the listOtherAPI.jsp  file to access data from my other table
           <br/> link to errors document <a href = "pics/errors.pdf"> here.</a><br/>
            Click <a href="webAPIs/listUsersAPI.jsp">here</a> to see my Web API that lists all the users in
            my database.<br/>
            Click <a href="webAPIs/listOtherAPI.jsp">here</a> to see my Web API that lists my data from the other table joined with web table.<br/>
    <br/>
        <strong>  Week 4: </strong> <br/>
            This week I worked on displaying tables from my json objects with a search filter. <br/>
            The things that were easy were displaying the data in the table while the hard things were making the table sort and <br/>
            being able to search the table. I wish we would of gone over the sorting and searching more extensivly in class <br/>
            as that would of helped me.
        </p>
    <br/>
        <strong>  Week 5: </strong> <br/>
            This week I worked on displaying a slide show of the images in the sql database. <br/>
            The things that were easy were displaying the fetching the data from the database and putting it into a<br/>
	 slideshow. The hard part of this lab was getting the formatting correct in my js slide show file so I just ended up putting
		the style info in my js page.<br/>
                    </p>
<br/>
        <strong>  Week 6: </strong> <br/>
            This week I worked adding a logon and logoff functionality to my website. I had to create a getProfile, logon and logoff jsp webAPIs.<br/>
             The thing that was difficult was adding the logon feature to take in two parameters but after some tinkering I figured it out. <br/>
            The most important thing was the logon API because it was the main part of the lab. <br/>
            Without this there would be no need for the other functionalities I have implimented <br/>
            Click <a href="webAPIs/logonAPI.jsp">here</a> to log on using the URL.<br/>
            Click <a href="webAPIs/logoff.jsp">here</a> to logoff of the previously logged on user.<br/>
            Click <a href="webAPIs/getProfileAPI.jsp">here</a> to see logged on profiles.<br/>
            Click <a href="webAPIs/listUsersAPI.jsp">here</a> to list all Users.<br/>
            Click <a href="webAPIs/getUserByIdAPI.jsp">here</a> a User with id as a parameter.<br/>
                    </p>
<br/>
        <strong>  Week 7: </strong> <br/>
            This week I worked adding a delete functionality to my tables. This was relativly easy becuase it was almost the same as the lab. <br/>
            The hardest thing about this lab was getting my table to show the delete icon. However, once I fixed my tablebuilder it was relativly easy to implement everything else.
            
                    </p>
<br/>
        <strong>  Week 8: </strong> <br/>
            This week I worked on a functionality to insert data into my User table and Other Table. <br/>
            The only problem ran into which was stupid was that I was inserting things in my applicant in<br/>
             a different order than I was processing them in my insert function. However, once I put everything in order it ran smoothly            
                    </p>
    <br/>
        <strong>  Week 9: </strong> <br/>
            This week I worked on a functionality to update data from my User table and Other Table. <br/>
            The only problem I ran into was allowing the data from my other table to show up so it can be changed.<br/>
          All I had to do ot fix this was get the index off the OtherList Array. This caused me so many headaches but I'm glad I was able to fix it.        
                    </p>


    `;
    document.getElementById(id).innerHTML = content;
}