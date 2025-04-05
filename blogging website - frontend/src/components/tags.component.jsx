import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";

const Tag = ({tag, tagindex}) => {

    let { blog, blog: {tags}, setBlog } = useContext(EditorContext)
    const handletagdelete = () => {
        tags = tags.filter(t=>t != tag)

        setBlog({...blog, tags})
        // console.log(tags)

    }

    const handletagtoedit = (e) => {
        if(e.keyCode ==13 || e.keyCode==188){
            e.preventDefault();

            let currenttag = e.target.innerText;
            tags[tagindex] = currenttag;

            setBlog({...blog, tags})
            console.log(tags)

            e.target.setAttribute("contentEditable",false);
        }
    }

    const addedittable = (e) => {
        e.target.setAttribute("contentEditable",true);
        e.target.focus();
    }
    return (
        <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
            <p className="outline-none" 
            onClick={addedittable}
            onKeyDown={handletagtoedit}
            contentEditable="true">{tag}</p>
            <button
            className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2  "
            onClick={handletagdelete}
            >
                <i className="fi fi-br-cross text-sm pointer-events-none" />
            </button>
        </div>
    )
}

export default Tag;