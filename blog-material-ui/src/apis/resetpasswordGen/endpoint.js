const endpoints ={
    


    resetpasswordG:(dataToSend ,id ,token)=>{
                    return {
                        url : `/auth/reset-password/${id}/${token}`,
                        options:{
                            method: 'POST',
                            body: JSON.stringify(dataToSend),
                            headers: {
                                'Content-type': 'application/json',
                            },
                        }
                    }

                },

}

export default endpoints;