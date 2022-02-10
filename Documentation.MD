## Dream App Api Details (Dream App)

#  BaseURL: http://localhost:8080 (Local Server)
#  BaseURL: https://dream-app-mtechub.herokuapp.com (Deployed Server)



## ##################################### User




## Sign Up User

    URL: /api/user/register  (Post)
    @Access Public

    -Request :It need
                    email*(String)
                    username*(String)
                    password*(String)

    -Response : And you get message,addedUser



## Sign In User

    URL: /api/user/signin  (Post)
    @Access Public

    -Request :It need
                    email*(String)
                    password*(String)


    -Response : And you get message,token,Result



## Send Mail (In case of forget password)

    URL: /api/user/sendMail/:email  (Put)
    @Access Public

    -Request :It need
                    mail*(String)


    -Response : And you get message,sentMail



## Verify Code (In case of forget password)

    URL: /api/user/checkOtp/:email  (Put)
    @Access Public

    -Request :It need
                    otpCode*(String)


    -Response : And you get message,updatedUser




## Update User (Password)

    URL: /api/user/updateUserInfo/:id  (Put)
    @Access Public

    -Request :It need
                    id*(String)
                    username (String)
                    password (Coordinates)

    -Response : And you get message,updatedCustomer
