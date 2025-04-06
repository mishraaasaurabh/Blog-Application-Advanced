import axios from "axios"
import AnimationWrapper from "../common/page-animation"
import InPageNavigation from "../components/inpage-navigation.component"
import { useEffect, useState } from "react"
import Loader from "../components/loader.component"
import BlogPostCard from "../components/blog-post.component"
const HomePage = () => {

    let [blogs, setBlog] = useState(null)


    const fetchlatestblogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
        .then(({data})=>{
            // console.log(data.blogs)
            setBlog(data.blogs)
        })
        .catch(err=>{
            console.log(err);
        })
    }

    useEffect(()=>{
        fetchlatestblogs();
    },[])

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* {Latest Blogs} */}
                <div className="w-full">

                    <InPageNavigation routes={["Home", "Trending Blogs"]} defaulthidden = {["Trending Blogs"]}>

                        <>
                        {
                            blogs ==null ? <Loader />:
                            blogs.map((blog,i) =>{
                                return <AnimationWrapper transition={{duration:1, delay: i*.1}} key={i}>
                                    <BlogPostCard content={blog} 
                                    author={blog.author.personal_info} />
                                </AnimationWrapper>
                            })
                        }
                        </>

                        <h1>Trending Blogs Here</h1>
                    </InPageNavigation>

                </div>
                {/* {filters and trending blogs } */}
                <div>

                </div>

            </section>
        </AnimationWrapper>
    )
}

export default HomePage;