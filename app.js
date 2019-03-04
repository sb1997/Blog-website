var bodyParser =require("body-parser"),
	methodOverride=require("method-override"),
	express =require("express"),
	expressSanitzer=require("express-sanitizer"),
	mongoose=require("mongoose"),
	app=express();

//app config
mongoose.connect("mongodb://localhost/restful_blog_app",{ useNewUrlParser: true });	
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitzer());
app.use(methodOverride("_method"));

//mongoose model config
var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	image:String,
	created:{
		type:Date,
		default:Date.now
	},
	body:String
}); 

var Blog=mongoose.model("Blog",blogSchema);

//restful routes
app.get("/",function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		} else{
			res.render("index",{blogs:blogs});
		}
	});
});

//new route
app.get("/blogs/new",function(req,res){
	res.render("new");
})

//create route
app.post("/blogs",function(req,res){
	// console.log(req.body);
	req.body.blog.body=req.sanitize(req.body.blog.body);
	// console.log("=====");

	// console.log(req.body);
	Blog.create(req.body.blog,function(err,newblog){
		if(err){
			res.render("new");
		} else{
			res.redirect("/blogs");
		}
	});
});

//show route
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.send("Not found");
		} else{
			res.render("show",{blog:foundBlog});
		}
	});
});

//edit route
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundblog){
		if(err){
			res.send("No blog found by id");
		} else{
			res.render("edit",{blog:foundblog});
		}
	});
});

//update route
app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});
//delete route
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs");
		}
	})
});

app.listen(3000,function(){
	console.log("Server is running...");
})