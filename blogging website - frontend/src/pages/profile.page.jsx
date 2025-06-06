import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { UserContext } from "../App"
import { Link } from "react-router-dom";
import AboutUser from "../components/about.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import InPageNavigation from "../components/inpage-navigation.component";
import NoDateMessage from "../components/nodata.component";
import LoadMoreDatabtn from "../components/load-more.component";
import BlogPostCard from "../components/blog-post.component";
import PageNotFound from "./404.page";

export const profiledatastructure = {
    personal_info: {
        fullname: "",
        username: "",
        profile_img: "",
        bio: "",

    },
    account_info: {
        total_posts: 0,
        total_reads: 0,

    },
    social_links: {},
    joinedAt: ""

}

const ProfilePage = () => {

    let [profile, setprofile] = useState(profiledatastructure);

    let { id: profileid } = useParams();
    let [loading, setloading] = useState(true);
    let [blogs, setblogs] = useState(null)
    let [profileloaed, setprofileloaded] = useState("");

    let { personal_info: { fullname, username: profile_username, profile_img, bio }, account_info: { total_posts, total_reads }, social_links, joinedAt } = profile;

    let { userAuth: { username } } = useContext(UserContext)

    const fetchuserprofile = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username: profileid })
            .then(({ data: user }) => {
                if(user!=null){

                    setprofile(user)
                }
                // console. (user)
                setprofileloaded(profileid)
                getBlogs({ user_id: user._id })
                setloading(false);

            })
            .catch(err => {
                console.log(err)
                setloading(false);

            })
    }

    const getBlogs = ({ page = 1, user_id }) => {


        user_id = user_id == undefined ? blogs.user_id : user_id

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            author: user_id,
            page
        })
            .then(async ({ data }) => {
                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countroute: "/search-blogs-count",
                    data_to_send: { author: user_id }
                })
                    formatedData.user_id = user_id

                // console.log(formatedData);
                setblogs(formatedData);
            })


    }

    useEffect(() => {
        if(profileid!=profileloaed){
            setblogs(null);
        }
        if(blogs==null){

            resetStates();
            fetchuserprofile()
        }
    }, [profileid,blogs])

    const resetStates = () => {
        setprofile(profiledatastructure)
        setloading(true)
        setprofileloaded("")
    }

    return (
        <AnimationWrapper>
            {
                loading ? <Loader /> :
                profile_username.length? 
                    <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
                        <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
                            <img src={profile_img}
                                className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
                                alt="" />

                            <h1 className="text-2xl font-medium">@{profile_username}</h1>
                            <p className="text-xl capitalize h-6">{fullname}</p>

                            <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads</p>

                            <div className="flex gap-4 mt-2">
                                {
                                    profileid == username ?
                                        <Link to="/settings/edit-profile" className="btn-light rounded-md">Edit Profile</Link>
                                        :
                                        " "
                                }


                            </div>

                            <AboutUser className="max-md:hidden" bio={bio} social_links={social_links} joinedAt={joinedAt} />
                        </div>

                        <div className="max-md:mt-12 w-full">
                            <InPageNavigation routes={["Blog Published", "About"]} defaulthidden={["About"]}>

                                <>
                                    {
                                        blogs == null ? (<Loader />) :
                                            (
                                                blogs.results.length ?
                                                    blogs.results.map((blog, i) => {
                                                        return (<AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                                            <BlogPostCard content={blog}
                                                                author={blog.author.personal_info} />
                                                        </AnimationWrapper>
                                                        );
                                                    })
                                                    :
                                                    <NoDateMessage message={"No Blogs Published"}  />
                                            )}
                                    {/* LoadMoreDatabtn */}

                                    <LoadMoreDatabtn state={blogs} fetchDatafn={getBlogs}  />
                                </>

                                {/* <h1>Trending Blogs Here</h1> */}

                              <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} /> 
                            </InPageNavigation>

                        </div>

                    </section>
                : <PageNotFound />

            }
        </AnimationWrapper>
    )

}

export default ProfilePage;