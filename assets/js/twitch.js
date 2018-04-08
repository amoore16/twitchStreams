$(document).ready(function(){
     //setup arrays
    var users = ["freecodecamp", "day9tv", "nobbel87", "overwatchleague","asmongold"];
    var usersInfo=[];
    
    //gets JSON object for each streamer
    function getUserInfo(){
        var deferred = $.Deferred();                //sets up promise 

        //iterate through streamer array
        users.forEach(function(user){
                $.getJSON("https://wind-bow.glitch.me/twitch-api/users/" + user, "callback=?",function(streamUser){
                                                    //turn user into the json object
                    statusInfo(streamUser);         //function checks if user is online
                    channelInfo(streamUser);        //function to get additional channel infos
                    usersInfo.push(streamUser);     //push to array
                });
        });

        //checks stream status --user is object when called
        function statusInfo(streamUser){
            $.getJSON("https://wind-bow.glitch.me/twitch-api/streams/" + streamUser.name, "callback=?",function(json){
            
                if(json.stream != null){     //stream will return null if channel is offline
                    streamUser.streamStatus = "online";
                } else {
                    streamUser.streamStatus = "offline";
                }
                deferred.resolve();          
            });
        }

        //gets channel info
        function channelInfo(streamUser){
            $.getJSON("https://wind-bow.glitch.me/twitch-api/channels/" + streamUser.name, "callback=?",function(json){
                streamUser.channelProps = json;                 //add it to user object
                deferred.resolve();
            });
        }
        return deferred.promise();      //returns after all other promises are resloved
    }
    
    //posts info to page
    function postInfo(){
        usersInfo.forEach(function(streamer){
            console.log(streamer);
        }); 
    }

    //call main function with promise
    getUserInfo().done(function(){
        postInfo();
    });
    
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

