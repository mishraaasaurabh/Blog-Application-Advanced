import { useEffect, useRef, useState } from "react"

const InPageNavigation = ({routes, defaulthidden, defaultactiveindex=0, children}) => {
    let [inpagenavindex,setinpagenavindex] = useState(defaultactiveindex); 
    let activetablineref = useRef();
    let activetab = useRef();


    const changepagestate = (btn,i) =>{
        // console.log(btn,i)

        let { offsetWidth, offsetLeft } = btn;
        
        activetablineref.current.style.width = offsetWidth + "px";
        activetablineref.current.style.left = offsetLeft+"px";

        setinpagenavindex(i) 

    }

    useEffect(()=>{
        changepagestate(activetab.current,defaultactiveindex);
    },[])

    return(
        <>
        <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
            {
                routes.map((route,i)=>{
                   return ( <button
                    key={i}
                    ref={i==defaultactiveindex?activetab: null}
                    className={"p-4 px-5 capitalize " + (inpagenavindex == i ? "text-black ": "text-dark-grey ") +
                        (defaulthidden.includes(route) ? " md:hidden ": "")
                    }
                    onClick={(e)=>{changepagestate(e.target,i)}}
                   >{route}</button>)
                })
            }

            <hr ref={activetablineref} className="absolute bottom-0 duration-300"/>
            
        </div>

        {Array.isArray(children) ? children[inpagenavindex]:children}
        
        
        
        
        
        </>
    )
}
export default InPageNavigation;