import axios from "axios"
import AnimationWrapper from "../common/page-animation"
import InPageNavigation from "../components/inpage-navigation.component"
import { useEffect, useState } from "react"
import Loader from "../components/loader.component"
import BlogPostCard from "../components/blog-post.component"
import MinimalBlogPost from "../components/nobanner-blog-post.component"
import { activetablineref, activetab } from "../components/inpage-navigation.component"
import NoDateMessage from "../components/nodata.component"

const HomePage = () => {

    let [blogs, setBlog] = useState(null)
    let [trendingblogs, setTrendingblogs] = useState(null)

    let [pagestate, setpagestate] = useState("home");

    let categories = ["sports", "programming", "hollywood", "film making", "social media", "cooking", "tech", "finance", "travel", "history"];

    const fetchlatestblogs = (page=1) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", {page})
            .then(({ data }) => {
                // console.log(data.blogs)
                setBlog(data.blogs)
            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchtrendingblogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
            .then(({ data }) => {
                // console.log(data.blogs)
                setTrendingblogs(data.blogs)
            })
            .catch(err => {
                console.log(err);
            })
    }

    const loadBlogbycategory = (e) => {
        let category = e.target.innerText.toLowerCase();
        // console.log(e);
        setBlog(null);
        if (pagestate == category) {
            setpagestate("home")
        }
        else {

            setpagestate(category);
        }
    }

    const fetchblogbycategory = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: pagestate })
            .then(({ data }) => {
                // console.log(data.blogs)
                setBlog(data.blogs)
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        activetab.current.click()
        if (pagestate == "home") {
            fetchlatestblogs();
        }
        else {
            fetchblogbycategory();
        }
        if (!trendingblogs) {
            fetchtrendingblogs();
        }
    }, [pagestate])

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* {Latest Blogs} */}
                <div className="w-full">

                    <InPageNavigation routes={[pagestate, "Trending Blogs"]} defaulthidden={["Trending Blogs"]}>

                        <>
                            {
                                blogs == null ? <Loader /> :
                                    blogs.length ?
                                        blogs.map((blog, i) => {
                                            return <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                                <BlogPostCard content={blog}
                                                    author={blog.author.personal_info} />
                                            </AnimationWrapper>
                                        })
                                        :
                                        <NoDateMessage message={"No Blogs Published"} />
                            }
                        </>

                        {/* <h1>Trending Blogs Here</h1> */}

                        {
                            trendingblogs == null ? <Loader /> :
                                trendingblogs.length ?
                                    trendingblogs.map((blog, i) => {
                                        return <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                            <MinimalBlogPost blog={blog} index={i} />
                                        </AnimationWrapper>
                                    })
                                    :
                                    <NoDateMessage message={"No Trending Blogs"} />

                        }
                    </InPageNavigation>

                </div>
                {/* {filters and trending blogs } */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min bogder-1 border-grey pl-8 pt-3 max-md:hidden">

                    <div className="flex flex-col gap-10 ">
                        <div>

                            <h1 className="font-medium text-xl">Stories from all interests</h1>

                            <div className="flex gap-3 flex-wrap">

                                {
                                    categories.map((category, i) => {
                                        return <button onClick={loadBlogbycategory} className={"tag" + (pagestate == category ? " bg-black text-white " : " ")}
                                        >
                                            {category}
                                        </button>
                                    })

                                }

                            </div>


                        </div>

                        <div>
                            <h1 className="font-medium text-xl mb-8">
                                Trending
                                <i className="fi fi-rr-arrow-trend-up" ></i>
                            </h1>


                            {
                                trendingblogs == null ? <Loader /> :
                                    trendingblogs.length ?
                                        trendingblogs.map((blog, i) => {
                                            return <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                                <MinimalBlogPost blog={blog} index={i} />
                                            </AnimationWrapper>
                                        })
                                        :
                                        <NoDateMessage message={"No Trending Blogs "} />

                            }
                        </div>
                    </div>

                </div>

            </section>
        </AnimationWrapper>
    )
}

export default HomePage;