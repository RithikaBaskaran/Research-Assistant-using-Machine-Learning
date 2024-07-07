//  import React, { Component }  from 'react';
// class MethodDisplay extends Component{
//     render(){
//     const {titles} = this.props;
    

//         return(
//     <div>
//         {titles.map((title,i)=>{
//             console.log(title)
//             let images = require.context('D:\\Finalyearproject2\\webpage\\backend\\images\\'+title, true);
//             let imageList = images.keys().map(image => images(image));
//             {imageList.map((image, index) => (
//                 <img key={index} src={image} alt={`image-${index}`} />
//               ))}
//         })}
      
//     </div>
//         )
//     }

// }
// 

import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
async function importImages(folderName) {
    console.log(folderName)
    try {
      //const images = await import(`D:/Finalyearproject2/webpage/frontend/src/images/${folderName}`); // Dynamic import
      const images = require.context('D:/Finalyearproject2/webpage/frontend/src/images/${folderName}', true);
      console.log(images)
      const imageList = images.keys().map(image => images(image));

      console.log(imageList)
      //return images.default; // Assuming images are exported as default
      return imageList
    } catch (error) {
      console.error('Error importing images:', error);
      // Handle errors (e.g., display a fallback message)
      return []; // Or return an empty array
    }
  }
  
  
  function ImageDisplay({ titles }) {
    const [imageList, setImageList] = useState([]); // State to hold images
    
    useEffect(() => {
      const fetchImages = async () => {
        for (const title of titles) {
            console.log(title)
          const images = await importImages(title); // Call import function
          setImageList((prevList) => [...prevList, ...images]);
        }
      };
  
      fetchImages();
    }, [titles]);
  
    return (
      <div>
        {titles.map((title, i) => (
          <div key={i}>
            <h2>{title}</h2>
            {imageList.map((image, index) => (
                // <img src={"./path/" + name} alt ='' />
                
              <img key={`<span class="math-inline">/{title}/-</span>{index}`} src={image} alt={`Image from ${title}`} />
            ))}
          </div>
        ))}
      </div>
    );
  }
  export default ImageDisplay;