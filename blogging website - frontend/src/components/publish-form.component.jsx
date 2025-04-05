import {Toaster, toast } from "react-hot-toast"
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const PublishForm = () =>{

    let characterLimit = 200;
    let taglimit = 10;
    let navigate = useNavigate();

    let { blog, blog: {banner, title, tags, content, des},setEditorState, setBlog} = useContext(EditorContext)

    let { userAuth: {access_token} } = useContext(UserContext)

    const handleClickEvent = () => {
        setEditorState("editor")
    }

    const handleBlogTitleChange = (e) =>{
        let input = e.target;
         
        setBlog({...blog, title: input.value})
    }

    const handleBlogDescchange = (e) => {
        let input = e.target;
        setBlog({...blog, des: input.value})
    }

    const handleTitleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
        }

    }

    const handlekeydown = (e) =>{
        if(e.keyCode==13 || e.keyCode==188){
            e.preventDefault();
            let tag = e.target.value

            if(tags.length< taglimit){
                if(!tags.includes(tag) && tag.length){
                    setBlog({...blog, tags: [...tags, tag]})
                }
            }
            else{
                toast.error(`You can add max ${taglimit}`)
            }
            e.target.value=""
        }
    }

    const publishblog = (e) => {

        if(e.target.className.includes("disable")){
            return;
        }

         if(!title.length){
            return toast.error("Write Blog Title before publishing")
         }
         if(!des.length || des.length> characterLimit){
            return toast.error(`Write about your blog ${characterLimit} characters to publish`)
         }
         if(!tags.length){
            return toast.error("Enter atleast one tag to help us rank your blog")
         }

         let loadingToast = toast.loading("Publishing...");

         e.target.classList.add('disable');

         let blogobj = {
            title, banner, des, content, tags, draft: false
         }

         axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogobj,  {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
         })
         .then(()=>{
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast)
            toast.success("Published!")
            
            setTimeout(()=>{
                navigate("/")
            },500);
            
        })
        .catch(({ response })=>{
            
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            return toast.error(response.data.error)
         })
    }

    return (
        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster />   

                <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]" 
                onClick={handleClickEvent}
                >
                    <i className="fi fi-br-cross"></i>
                </button>

                <div className="max-w-[550px] center">
                    <p className="tex-dark-grey mb-1 ">
                        Preview
                    </p>

                    <div className="w-full aspect-video rounded-lg  overflow-hidden bg-grey mt-4">
                        <img src={banner} alt="" />
                    </div>

                    <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{title}</h1>

                    <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{des}</p>
                </div>

                <div className="border-grey lg:border-1 lg: py-8">
                    <p className="text-dark-grey mb-2 mt-9">
                        Blog Title
                    </p>
                    <input type="text" placeholder="Blog Title" 
                    defaultValue={title}
                    className="input-box pl-4"
                    onChange={handleBlogTitleChange}
                    />


                    <p className="text-dark-grey mb-2 mt-9">
                       Short Description about your blog
                    </p>

                    <textarea name="" id=""
                    maxLength={characterLimit}
                    defaultValue={des}
                    className="h-40 leading-7 resize-none input-box pl-4"
                    onChange={handleBlogDescchange}
                    onKeyDown={handleTitleKeyDown}
                    >

                    </textarea>

                    <p className="mt-1 text-dark-grey text-sm text-right">{characterLimit - des.length} characters left </p>

                    <p className="text-dark-grey mb-2 mt-9">Topics - (Helps in searching and ranking your blog post)  </p>

                    <div className="relative input-box pl-2 py-2 pb-4">
                        <input type="text" placeholder="Topic"
                        className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
                        onKeyDown={handlekeydown}
                        />
                        {
                            tags.map((tag,i) => {
                               return <Tag tag={tag} 
                               tagindex={i} key={i} />
                            })
                        }

                        
                    </div>
                    <p className="mt-1 mb-4 text-dark-grey text-right">
                            {taglimit - tags.length} Tags left
                        </p>

                        <button className="btn-dark px-8" onClick={publishblog}>Publish</button>
                    
                </div>
            </section>
        </AnimationWrapper>
    )
}

export default PublishForm;