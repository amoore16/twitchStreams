$(document).ready(function(){
     //setup arrays
    var users = ["freecodecamp", "day9tv", "nobbel87", "overwatchleague","asmongold", "towelliee"];
    
    //gets JSON object for each streamer
    
        userLoop().then(function(streamUser){
            postInfo(streamUser);
        });

        function userLoop(){
            return new Promise(function(resolve, reject){
                users.forEach(function(user){
                    getStreamerInfo(user).then(function(streamUser){
                        statusInfo(streamUser).then(function(streamUser){
                            channelInfo(streamUser).then(function(streamUser){
                                postInfo(streamUser); 
                                
                            });
                        });
                    });
               
                });
            });
            
        }

        //iterate through streamer array
        function getStreamerInfo(user){
            return new Promise(function(resolve, reject){
                $.getJSON("https://wind-bow.glitch.me/twitch-api/users/" + user, "callback=?",function(streamUser){
                   resolve(streamUser); 
                });
            })            
        }
        
        //checks stream status --user is object when called
        function statusInfo(streamUser){
           return new Promise(function(resolve, reject){
                $.getJSON("https://wind-bow.glitch.me/twitch-api/streams/" + streamUser.name, "callback=?",function(json){
                    if(json.stream != null){     //stream will return null if channel is offline
                        streamUser.streamStatus = "online";
                    } else {
                        streamUser.streamStatus = "offline";
                    }
                    resolve(streamUser);        //function to get additional channel infos        
                });
            });
            
        }

        //gets channel info
        function channelInfo(streamUser){
           return new Promise(function(resolve, reject){
                $.getJSON("https://wind-bow.glitch.me/twitch-api/channels/" + streamUser.name, "callback=?",function(json){
                    streamUser.channelProps = json;                 //add it to user object
                    resolve(streamUser)
                });
            });
        }
        
        //posts info to page
        function postInfo(streamUser){
            var post = "<li><h2>" + streamUser.display_name + "</h2></li>";
            $("#tab-1 ul").append("<li><img src='" + streamUser.channelProps.logo + "'><h2>" + streamUser.display_name + "</h2><h3>" + streamUser.streamStatus + "</h3></li>");
            // console.log(streamUser);
            
            if (streamUser.streamStatus === "online"){
                // $("#tab-1 ul li").addClass("online");
                $("#tab-2 ul").append(post);
                $("#tab-1 ul li").last().append("<p>" + streamUser.channelProps.status + "</p>");
            }
            else {
                $("#tab-3 ul").append(post);
                $("#tab-1 ul li").last().addClass("offline");
            }
            console.log(streamUser);
        }
    
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

