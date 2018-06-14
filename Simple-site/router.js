const Profile = require("./profile.js");
const renderer = require("./renderer.js");
const querystring = require("querystring");
const commonHeaders = {'Content-Type': 'text/html'};

// Handle HTTP route GET / and POST / i.e. Home
//if url == "/" && GET
  //show search
function home(request, response){
  if(request.url === "/") {
    if(request.method.toLowerCase() === "get"){
      response.writeHead(200, commonHeaders);
      renderer.view("header", {}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    } else {
      //get the post data from body
      request.on("data", function(postBody) {
        //extract the username
        let query = querystring.parse(postBody.toString());
        //redirect to /:username
        response.writeHead(303, {"Location": "/" + query.username});
        response.end();
      });
    }
  }
  };

// Handle HTTP route GET /:username i.e. .benfairchild
function user(request, response){
  const username = request.url.replace("/", "");
  if (username.length > 0){
    response.writeHead(200, commonHeaders);
    renderer.view("header", {}, response);

    //get json from treehouse
    let studentProfile = new Profile(username);
    //on "end"
    studentProfile.on("end", function(profileJSON){
      const values = {
        avatarUrl: profileJSON.gravatar_url,
        username: profileJSON.profile_name,
        badges: profileJSON.badges.length,
        javascriptPoints: profileJSON.points.JavaScript
      }
      //simple response
      renderer.view("profile", values, response);
      renderer.view("footer", {}, response);
      response.end();
    });
    //show profile

    //on "error"
    studentProfile.on("error", function(error){
      //show error
      renderer.view("error", {errorMessage: error.message}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    });
  }
}


module.exports.home = home;
module.exports.user = user;
