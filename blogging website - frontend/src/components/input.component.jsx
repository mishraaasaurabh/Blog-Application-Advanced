import { useState } from "react";

const InputBox = ({name,type,id,value,placeholder,icon}) =>{

    const [passwordvisible,setpasswordvisible] = useState(false);

    return(
        <div className="relative w-[100%] mb-4">
            <input
            name={name}
            type={type == "password" ? passwordvisible ? "text" :"password" : type}
            placeholder={placeholder}
            defaultValue={value}
            id={id}
            className="input-box"

            />
            <i className={"fi " + icon +  " input-icon"}></i>

            {
                type=="password" ? 
                <i className={"fi fi-rr-eye" + (!passwordvisible ? "-crossed":"") + " input-icon left-[auto] right-4 cursor-pointer "} onClick={()=>setpasswordvisible(curval=>!curval)}></i>
                :""
            }


        </div>
    )
}

export default InputBox;