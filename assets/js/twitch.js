$(document).ready(function(){
     //setup arrays
    var users = ["freecodecamp", "day9tv", "nobbel87", "overwatchleague","asmongold"];
    
    //gets JSON object for each streamer
    
    userLoop();
    //triangle of death
    function userLoop(){
        $(".tab-panel ul").empty();
        users.forEach(function(user){                
            getStreamerInfo(user).then(function(streamUser){
                statusInfo(streamUser).then(function(streamUser){
                    channelInfo(streamUser).then(function(streamUser){
                        postInfo(streamUser); 
                        
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
                if(json.stream != null){                        //stream will return null if channel is offline
                    streamUser.streamStatus = "online";
                } else {
                    streamUser.streamStatus = "offline";
                }
                resolve(streamUser);               
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
        var post = "<a href='" + streamUser.channelProps.url + "' target='_blank'><li><img src='" + streamUser.channelProps.logo + "'><h2>" + streamUser.display_name + "</h2><h3>" + streamUser.streamStatus + "</h3></li></a>";
        // console.log(streamUser);
        $("#tab-1 ul").append(post);
        if (streamUser.streamStatus === "online"){
            
            $("#tab-2 ul").append(post);
            $("#tab-1 ul li").last().append("<p>" + streamUser.channelProps.status + "</p>");
            $("#tab-2 ul li").last().append("<p>" + streamUser.channelProps.status + "</p>");
        }
        else {
            $("#tab-3 ul").append(post);
            $("#tab-1 ul li").last().addClass("offline");
        }
        console.log(streamUser);
    }
    
    //add a streamer
    $("input[type='text'").hide();
    $("#addUser").click(function(){
        $("input[type='text'").fadeToggle();
    });
    $("input[type='text'").keypress(function(event){
        if(event.which === 13){
            var $addStreamer = ($(this).val());
            $(this).val("");
            //check if streamer exists
            //if true, push to array and refresh
                $.getJSON("https://wind-bow.glitch.me/twitch-api/users/" + $addStreamer, "callback=?",function(json){
                    if(json.error){
                        alert(json.message);
                    } else {
                        users.push($addStreamer);
                        userLoop();
                    }
                });
            

             
            
        }
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

