import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png"
import { useContext, useState } from "react";
import { UserContext } from "../App";
import { useEffect } from "react";
import UserNavigationPanel from "./user-navigation.component";

const Navbar = () => {

    const [searchboxvisibility, setsearchboxvisibility] = useState(false)
    const [userNavpanel, setUSerNAvPanel] = useState(false);
    const navigate = useNavigate();

    // const { userAuth, userAuth: { access_token, profile_img } } = useContext(UserContext)
    const { userAuth, setUserAuth } = useContext(UserContext) || {}; // Add fallback to empty object
    let { access_token, profile_img } = userAuth || {}; // Safe destructuring

    useEffect(() => {
        // console.log("Userauth updated ",userAuth);
    }, [userAuth])

    const handleLogout = () => {
        userAuth.access_token = null
        // localStorage.removeItem(access_token)
        // setUserAuth({}); 
        navigate("/signin")
    }

    const handlesearch = (e) => {
        let query = e.target.value;
        if (e.keyCode == 13 && query.length)
            navigate(`/search/${query}`)
    }

    const handleusernavpanel = ()=>{
        setUSerNAvPanel(curr=>!curr)
    }
    
    const handleblur = ()=>{
        setTimeout(()=>{
            setUSerNAvPanel(false)

        },200)
         
    }


    return (
        <>
            <nav className="navbar">


                <Link to="/" className="flex-none w-10">
                    <img src={logo} className="w-full" />
                </Link>

                <div className={"absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " + (searchboxvisibility ? "show" : "hide")}>
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full md:w-auto bg-grey p-4 pl-6 pr-[10%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
                        onKeyDown={handlesearch}
                    />



                    <i className="fi fi-rr-search absolute right-[10%]  md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-2xl "></i>
                </div>

                <div className="flex items-center gap-3 md:gap-6 ml-auto">

                    <button className="md:hidden bg-grey rounded-full h-12 w-12 flex items-center justify-center" onClick={() => setsearchboxvisibility(current => !current)}>
                        <i className="fi fi-rr-search text-xl"></i>
                    </button>

                    <Link to="/editor" className="hidden md:flex gap-2 link">
                        <i className="fi fi-rr-file-edit"></i>
                        <p>Write</p>
                    </Link>
                    {
                        access_token ?
                            <>
                                <Link to="/dashboard/notification" >
                                    <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10
                        ">
                                        <i className="fi fi-rr-bell text-2xl block mt-1"></i>

                                    </button>
                                </Link>

                                <div className="relative" onClick={handleusernavpanel} onBlur={handleblur}>
                                    <button className="w-12 h-12 mt-1 ">
                                        <img src={profile_img} alt="" className="w-12 h-12 object-cover rounded-full" />
                                    </button>
                                </div>
                                {
                                    userNavpanel?<UserNavigationPanel />:
                                    " "
                                }
                            </>
                            :


                            <>

                                <Link className="btn-dark py-2" to="/signin">
                                    Sign In
                                </Link>

                                <Link className="btn-light py-2 hidden md:block" to="/signup">
                                    Sign Up
                                </Link>

                            </>
                    }






                </div>

            </nav>

            <Outlet />
        </>
    )
}

export default Navbar;