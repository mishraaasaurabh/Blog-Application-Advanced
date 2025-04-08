import { useContext, useRef } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png"
import { Link, Navigate } from "react-router-dom"
import { toast, Toaster } from "react-hot-toast"
import axios from "axios"
import { storeInSession } from "../common/session";
import { UserContext } from "../App";

const UserAuthForm = ({ type }) => {

    const authForm = useRef();

    let { userAuth: { access_token }, setUserAuth } = useContext(UserContext)

    // console.log("accesstoken",access_token)

    const userAuthThroughServer = async (serverRoute, formData) => {
        // console.log("Server Route: ", serverRoute);
        // console.log('VITE_SERVER_DOMAIN:', import.meta.env.VITE_SERVER_DOMAIN);

       await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}${serverRoute}`, formData)
            .then(({ data }) => {
                storeInSession("user", JSON.stringify(data))
                setUserAuth(data)
            })
            .catch(({ response }) => {
                toast.error(response.data.error)
            })
    }

    const handlesubmit = (e) => {
        e.preventDefault();

        let serverRoute = type == "sign-in" ? "/signin" : "/signup"

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;


        let form = new FormData(formElement);

        let formData = {}

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        // form validation
        let { fullname, email, password } = formData;

        if (fullname) {

            if (fullname.length < 3) {
                return toast.error("Fullname must be at least 3 characters long");
            }
        }

        if (!email.length) {
            return toast.error("Enter Email");
        }

        if (!emailRegex.test(email)) {
            return toast.error("Email is invalid");
        }

        if (!passwordRegex.test(password)) {
            return toast.error("Password should be 6 to 20 characters long with 1 uppercase and 1 lowercase letter");
        }

        userAuthThroughServer(serverRoute, formData);

    }

    return (
        access_token ?
            <Navigate to="/" />
            :
            <AnimationWrapper keyvalue={type}>


                <section className="h-cover flex items-center justify-center ">
                    <Toaster />
                    <form action="" id="formElement" className="w-[80%] max-w-[400px]">
                        <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                            {type == "sign-in" ? "Welcome Back" : "Join us Today"}
                        </h1>

                        {
                            type != "sign-in" ?
                                <InputBox name="fullname"
                                    type="text"
                                    placeholder="full name"
                                    icon="fi-rr-user" />
                                : ""
                        }

                        <InputBox name="email"
                            type="email"
                            placeholder="email"
                            icon="fi-rr-envelope" />

                        <InputBox name="password"
                            type="password"
                            placeholder="Password"
                            icon="fi-rr-key" />

                        <button className="btn-dark center mt-14" type="submit"
                            onClick={handlesubmit}
                        >

                            {type.replace("-", " ")}
                        </button>

                        <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                            <hr className="w-1/2 border-black" />
                            <p>Or</p>
                            <hr className="w-1/2 border-black" />

                        </div>

                        <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
                            <img src={googleIcon} alt="" className="w-5" />
                            Continue with Google
                        </button>

                        {

                            type == "sign-in" ?
                                <p className="mt-6 text-dark-grey text-xl text-center "> Don't have an account ?
                                    <Link to="/signup" className="underline text-black text-xl ml1">
                                        Join us Today
                                    </Link>
                                </p>
                                :
                                <p className="mt-6 text-dark-grey text-xl text-center "> Already a Member ?
                                    <Link to="/signin" className="underline text-black text-xl ml1">Sign in here</Link>
                                </p>
                        }

                    </form>
                </section>
            </AnimationWrapper>
    )
}

export default UserAuthForm;