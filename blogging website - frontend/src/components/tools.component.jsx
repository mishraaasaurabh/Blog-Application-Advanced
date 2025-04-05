//importing tools
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code"

import {uploadImage} from "../common/aws"

const uploadimagebyfile = (e) =>{
    return  uploadImage(e).then(url => {
        if(url){
            return {
                success:1,
                file: {url}
            }
        }
    })
}

const uploadimagebyurl = (e) => {
    return new Promise((resolve, reject) => {
        // Validate the URL format
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        if (!e || !urlRegex.test(e)) {
            reject(new Error("Invalid URL"));
        } else {
            resolve(e);  // If valid, resolve with the URL
        }
    }).then(url => {
        return {
            success: 1,
            file: { url }
        };
    }).catch(err => {
        return {
            success: 0,
            error: err.message  // Handle error gracefully
        };
    });
 };

export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true
    },
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadimagebyurl,
                uploadByFile: uploadimagebyfile

            }
        }
    },
    header: {
        class: Header,
        config: {
            placeholder: "Type Heading...",
            levels: [2,3],
            defaultLevel:2
        }
    },
    quote: {
        class: Quote,
        inlineToolbar: true
    },
    marker: Marker,
    inlinecode: InlineCode 
}