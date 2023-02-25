import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import validate from "./../../Validition/post";
import requests from "./../../../apis/posts/requests"
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import CancelIcon from '@mui/icons-material/Cancel';
import { Grid } from "@mui/material";
import axios from "axios";
const useStyles = makeStyles({
  input: {
    backgroundColor:"red"
  },

  button: {
    backgroundColor:"greenyellow"
  },
  img:{
    width:"30%",
    height:"30%",
  }

});
const UpdatePost = (props) => {
  const { postData } = props;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const classes = useStyles(props);
  const [file, setFile] = useState(null);
  const fetchedPost = postData || {};
  const [values, setValues] = useState({
    title: fetchedPost.title || "",
    body: fetchedPost.body || "",
    postPicture: fetchedPost.postPicture || "",
  });
  const [errors, setErrors] = useState({});
  let navigate = useNavigate();
   const [ValidationStatus, setValidationStatus] = useState(false);
   const [submitted, setSubmitted] = useState(false);
   const [notification, setNotification] = useState({
    show:false,
    type:"warning",
    text:""
   });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true)

    //validation-start-frontend
          const title = values.title ? values.title.trim() : values.title;
          const body = values.body ? values.body.trim() : values.body;


          const validationErrors = validate(title, body);
          setErrors(validationErrors);
          let validStatus = Object.values(validationErrors).every((x)=> x === "")
          if(validStatus){
          setValidationStatus(true);
          }else{
          setValidationStatus(false);
          }
          // validation-end-frontend
    // send values to back end
    // calling the api
  };
  let goToHome = () => {
  
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 2000);
  };
  useEffect(()=>{

const sendPost= async(id,dataToSend)=>{
  if (file) {

    const data = new FormData();
    const fileName = Date.now() + file.name;
    data.append("name", fileName);
    data.append("file", file);
    values.postPicture = `post/${fileName}`;
    try {
      await axios.post("/blog", data);
    } catch (err) {}
  }
  
  const results= await requests.updatepost(id,dataToSend );


  const {response, data }=results
  console.log(response ,data);
  if(response.ok){
    setNotification({

      show:true,
      type: 'success',
      text:"Congratulation ,the post has been successfully updated"
    })
    goToHome();
  }else if(data){
    const err = data.message || {}

    if(err ){
      setNotification({

        show:true,
        type: 'warning',
        text:err.message
      })

    }

  }else{
    setNotification({

      show:true,
      type: 'error',
      text:"unknownerror"
    })
    
  }

}
try {
if (submitted) {
  if(ValidationStatus){ //for frontend before backend
        sendPost(postData._id,values)
        setValidationStatus(false)
      }
  setSubmitted(false)
}

   
  // validation-start-frontend

  // validation-end-frontend
} catch (error) {

  console.log(error);
  
}
    
  },[submitted])
  return (

    <>
      <form onSubmit={handleSubmit}>
      <Stack sx={{ width: '100%' }} spacing={2}>

        {

          notification.show && <Alert 
          severity={notification.type} variant="filled">
            {notification.text}</Alert>
        }

      
    </Stack>
      <TextField
        sx={{ my: 2 }}
        label="Post Title"
        name="title"
        value={values.title}
        onChange={handleInputChange}
        error={!!errors.title}
        helperText={errors.title && errors.title}
        fullWidth
      />
      <TextField
        sx={{ mb: 2 }}
        label="Post Content"
        multiline
        rows={6}
        name="body"
        value={values.body}
        onChange={handleInputChange}
        error={!!errors.body}
        helperText={errors.body && errors.body}
        fullWidth
      />
            <Grid container justifyContent={"space-between"}>

<Grid item>
  <input

className={classes.input}
style={{ display: 'none' }}
id="raised-button-file"
multiple
type="file"
accept=".png,.jpeg,.jpg"
onChange={(e) => setFile(e.target.files[0])}
/>
<label htmlFor="raised-button-file">
<Button variant="raised" component="span" 

className={classes.button}
>
Upload-IMAGE
</Button>
</label> 


  </Grid>
  <Grid item >
<Grid container>



  
</Grid>
{file ? (

<Grid item>
<div className="shareImgContainer">
      <img className={classes.img} src={URL.createObjectURL(file)} alt="" />
      <CancelIcon className="shareCancelImg"  onClick={() => setFile(null)} />
    </div> 
</Grid>

  ):
  <Grid item>

<div className="shareImgContainer">
  <img className={classes.img} src={PF + values?.postPicture} alt="" />
  <CancelIcon className="shareCancelImg"  onClick={() => setFile(null)} />
</div>


  </Grid>
  

  
  }



  </Grid>

</Grid>

      <Button fullWidth variant="contained" type="submit">
        Submit
      </Button>
    </form>

    </>

  );
};

export default UpdatePost;
