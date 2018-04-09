$(document).ready(function(){
     //setup arrays
    var users = ["freecodecamp", "day9tv", "nobbel87", "overwatchleague","asmongold", "towelliee"];
    var usersInfo=[];

    
    
    //gets JSON object for each streamer
    function getUserInfo(){
        
        //iterate through streamer array
        users.forEach(function(user){
                $.getJSON("https://wind-bow.glitch.me/twitch-api/users/" + user, "callback=?",function(streamUser){
                                                    //turn user into the json object
                    statusInfo(streamUser);         //function checks if user is online
                    
                });
            
        });
        return 
        //checks stream status --user is object when called
        function statusInfo(streamUser){
            $.getJSON("https://wind-bow.glitch.me/twitch-api/streams/" + streamUser.name, "callback=?",function(json){
            
                if(json.stream != null){     //stream will return null if channel is offline
                    streamUser.streamStatus = "online";
                } else {
                    streamUser.streamStatus = "offline";
                }
                channelInfo(streamUser);        //function to get additional channel infos        
            });
        }

        //gets channel info
        function channelInfo(streamUser){
            $.getJSON("https://wind-bow.glitch.me/twitch-api/channels/" + streamUser.name, "callback=?",function(json){
                
            streamUser.channelProps = json;                 //add it to user object
            postInfo(streamUser);
            console.log(streamUser);   
            });
        }
        
    }
    
    //posts info to page
    function postInfo(streamUser){
        var post = "<li><h2>" + streamUser.display_name + "</h2></li>";
        $("#tab-1 ul").append("<li><img src='" + streamUser.channelProps.logo + "'><h2>" + streamUser.display_name + "</h2><h3>" + streamUser.streamStatus + "</h3></li>");

        if (streamUser.streamStatus == "online"){
            $("#tab-2 ul").append(post);
        }
        else {
            $("#tab-3 ul").append(post);
        }

    }

    //call main function with promise
    getUserInfo();
    
    
    //scripts for hiding and showing tabs
    $('.tab-list').each(function(){
        var $this = $(this);
        var $tab = $this.find('li.active');
        var $link = $this.find('a');
        var $panel = $($link.attr('href'));
        
        $this.on('click', '.tab-control', function(e){
            e.preventDefault();
            var $link = $(this);
            var id = this.hash;

            if (id && !$link.is('.active')) {
                $panel.removeClass('active');
                $tab.removeClass('active');

                $panel = $(id).addClass('active');
                $tab = $link.parent().addClass('active');
            }
        });
    });   

});

