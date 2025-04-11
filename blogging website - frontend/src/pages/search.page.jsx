import { useParams } from "react-router-dom"
import InPageNavigation from "../components/inpage-navigation.component"
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import NoDateMessage from "../components/nodata.component";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDatabtn from "../components/load-more.component"
import UserCard from "../components/usercard.component";

const SearchPage = () => {




    let { query } = useParams();

    let [blogs, setBlog] = useState(null)
    let [users,setusers] = useState(null)

    const searchBlogs = ({ page = 1, create_new_arr = false }) => {


        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { query, page })
            .then(async ({ data }) => {
                console.log(data.blogs)
                // setBlog(data.blogs)

                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countroute: "/search-blogs-count",
                    data_to_send: {query},
                    create_new_arr
                })

                console.log(formatedData);
                setBlog(formatedData)
            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchusers = () =>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/search-users",{query})
        .then(({data: {users}})=>{
            console.log(users)
            setusers(users);
        })
    }

    useEffect(()=>{

        resetState();
        searchBlogs({page:1, create_new_arr: true});
        fetchusers();

    },[query])

    const resetState = () => {
        setBlog(null);
        setusers(null);
    }

    const UserCardWrapper = ()=>{
        // console.log(users);
        return (
            <>
                {
                    users==null ? <Loader />
                    : 
                    users.length ?
                        users.map((user,i)=>{
                            return <AnimationWrapper key={i} transition={{duration: 1, delay: i*0.08}}>
                                <UserCard user={user} />
                            </AnimationWrapper>
                        })
                    : <NoDateMessage message={"No User Found"} />
                }
            </>
        )
    }

    return (
        <section className="h-cover flex justify-center gap-10">
            <div className="w-full">
                <InPageNavigation routes={[`Search results from ${query}`, "Accounts Matched"]} defaulthidden={["Accounts Matched"]} >

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
                                        <NoDateMessage message={"No Blogs Published"} />
                                )}
                                <LoadMoreDatabtn state={blogs} fetchDatafn={searchBlogs} />
                    </>

                    <UserCardWrapper />

                </InPageNavigation>

            </div >

            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border1 border-grey pl-8 pt-3 max-md:hidden">

                <h1 className="font-medium text-xl mb-8">
                    User related to search <i className="fi fi-rr-user mt-1"></i>


                </h1>
                <UserCardWrapper />

            </div>

        </section>
    )
}

export default SearchPage;