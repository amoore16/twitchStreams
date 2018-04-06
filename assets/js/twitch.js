$(document).ready(function(){
    var users = ["freecodecamp", "day9tv", "nobbel87", "overwatchleague","asmongold"];
    var usersInfo=[];
    //gets JSON object for each streamer
    function getUserInfo(){
        //setup arrays
        
        
        //iterate through streamer array
        users.forEach(function(user){
                $.getJSON("https://wind-bow.glitch.me/twitch-api/users/" + user, "callback=?",function(json){
                    
                    user = json;            //turn user into the json object
                    statusInfo(user);       //function checks if user is online
                    channelInfo(user);      //function to get additional channel infos
                    usersInfo.push(user);   //push to array
                });       
        });
        
        //checks stream status --user is object when called
        function statusInfo(user){
            $.getJSON("https://wind-bow.glitch.me/twitch-api/streams/" + user.name, "callback=?",function(json){
            
                if(json.stream != null){     //stream will return null if channel is offline
                    user.streamStatus = "online";
                } else {
                    user.streamStatus = "offline";
                }
                
            });
        }
        //gets channel info
        function channelInfo(user){
            $.getJSON("https://wind-bow.glitch.me/twitch-api/channels/" + user.name, "callback=?",function(json){
                user.channelProps = json;  //add it to user object
            });
        }
        

    }
    getUserInfo()
    console.log(usersInfo);

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

