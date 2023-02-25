import React, { useContext, useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import MuiLink from "@mui/material/Link";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./../../../context/Store";
import IconButton from "@mui/material/IconButton";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import requests from "./../../../apis/posts/requests";
import Controls from '../../Utility/controls/Controls';
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { format } from "timeago.js";
import TouchAppIcon from '@mui/icons-material/TouchApp';
const useStyles = makeStyles({

  root:{
marginBottom:"16px",
textAlign:"center",
marginRight:"1rem",


  },
  image:{
    width:"200px"
    , height:"150px" ,
     margin:" 20px auto" , 
    

  }
})
const Post = (props) => {
  const classes = useStyles(props)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  let navigate = useNavigate();
    const {Userdata} = useContext(AuthContext)


  const {id,title, content ,data,snippet ,userId,likes,imagePost ,page}= props;

  const [like, setlike] = useState(likes.length)
  // const [likelength, setlikelength] = useState(null)
  const [islike, setIsLike] = useState(false)
  const [notification, setNotification] = useState({
    show: false,
    type: "warning",
    text: "",
  });

  // useEffect(() => {
  //   setpage(page)
  //   const FetchPosts = async (page1) => {
  //   const dataFetch = await requests.getAll(page1);
  //   const { data } = dataFetch;
  //   setposts(data)
  //   }
  //   FetchPosts(page1);
  // }, [Userdata.id, likes]);
  useEffect(() => {
    setIsLike(likes.includes(Userdata.id));
  }, [Userdata.id, likes]);
  const likeHandler=async(id)=>{
    try {
      const res = await requests.likerequest(id);

      console.log(res);
    
    } catch (error) {
      
    }
    setlike(islike ? like - 1 : like + 1)
    setIsLike(!islike)
  }
  const restoreComment =async(id)=>{
    const results = await requests.restoreComment(id);
    if (results) {
      setNotification({
        show: true,
        type: "warning",
        text: `${results.message}`,
      });
      
      goToHome();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
     
    }
  }
  let goToHome = () => {
  
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 2000);
  };
  return (
    <>
  

<Card raised className={classes.root}>
{snippet  ? <></>:

<>
{

((userId=== Userdata.id))&& (<Controls postID={id} user_id={userId} user_name={Userdata.name}/>)
}


</>

}

  <CardContent>
  <CardMedia
 className={classes.image}
  image={ 
    imagePost ? PF + imagePost
    : PF + `post/1.jpeg`}
  title="green iguana"
/>
    <Stack sx={{ width: "100%" ,marginBottom:"30px"}} spacing={2}>
      {notification.show && (
        <Alert severity={notification.type} variant="filled">
          {notification.text}
        </Alert>
      )}
    </Stack>
      {
Userdata.role === 'admin' &&(

  <>
  <IconButton
            color="primary"
            size="small"
            onClick={() => restoreComment(id)}
          >
            <ModeEditIcon fontSize="small" sx={{marginBottom:"10px"}}/>
          </IconButton>
 
  </>
)

      }    
  <Typography gutterBottom variant="h6" component="h3">
  {snippet ? title.slice(0, 16) : title}
  </Typography>
  <Typography gutterBottom variant="body1" component="p">
  {snippet ? content.slice(0, 70) : content}
  </Typography>
  <Typography gutterBottom variant="body1" component="p" sx={{color:"red"}}>
  {snippet ? format(data) : format(data)}
  </Typography>
  </CardContent>
  {snippet ? (
  <CardActions>
  <Button variant="contained" fullWidth>
          <MuiLink
            color="inherit"
            component={Link}
            to={`/post/${id}`}
            variant="button"
            underline="none"
          >
            Read More
          </MuiLink>
        </Button>
        <IconButton
            color="primary"
            size="small"
            onClick={() => likeHandler(id)}
          >
            <TouchAppIcon fontSize="small" sx={{marginBottom:"10px"}}/>
          </IconButton>
                <Typography gutterBottom variant="body1" component="p" sx={{color:"red"}}>
                { like }
                </Typography>
</CardActions>


  ):
  <>
  
  <CardActions>
  <Button variant="contained" fullWidth>
          <MuiLink
            color="inherit"
            component={Link}
            to={`/profile/${userId}`}
            variant="button"
            underline="none"
          >
            Read his Profile
          </MuiLink> 
        </Button>
        <IconButton
            color="primary"
            size="small"
            onClick={() => likeHandler(id)}
          >
            <TouchAppIcon fontSize="small" sx={{marginBottom:"10px"}}/>
          </IconButton>
                <Typography gutterBottom variant="body1" component="p" sx={{color:"blue"}}>
                  {like }
                </Typography>
</CardActions>
  
  
  </>
  
  
  }

</Card>


   

    
    </>

  )
}

export default Post