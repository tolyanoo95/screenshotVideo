'use client'
import {useRef, useState} from "react";
import Image from 'next/image'

export default function Home() {
    const videoInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [imageList, setImageList] = useState([])
    
    
    const capture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  
        saveAsImage()
    };
  
    const saveAsImage = async () => {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL('image/png');
      
      try {
        const response = await fetch('/api/save-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataURL }),
        });
        
        const result = await response.json();
        setImageList((prevImageList) => [...prevImageList, result])
        console.log(result.pahImage)
        alert('Image saved successfully!');
      } catch (error) {
        alert('Failed to save the image.');
      }
    };
    
    const handleFileChange = () => {
      const file = videoInputRef.current.files[0];
      
      if (file) {
        const videoURL = URL.createObjectURL(file);
        videoRef.current.src = videoURL;
        playVideo()
      }
    };
    
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    };
    
    const pauseVideo = () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  
    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp); // Convert timestamp to Date object
      const yy = date.getFullYear().toString().slice(2);  // Get last 2 digits of the year
      const mm = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
      const dd = date.getDate().toString().padStart(2, '0');
      const hh = date.getHours().toString().padStart(2, '0');
      const min = date.getMinutes().toString().padStart(2, '0');
      const ss = date.getSeconds().toString().padStart(2, '0');
      
      return `${yy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    }

    return (
        <>
            <div className="uploadFile">
              <input type="file" accept="video/*" ref={videoInputRef} accept="video/*"  onChange={handleFileChange} />
            </div>
            <div className="video">
              <video ref={videoRef} width="640" height="360" crossOrigin="anonymous">
                <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="buttons">
              <div>
                <button onClick={playVideo}>Play</button>
              </div>
              <div>
                <button onClick={pauseVideo}>Pause</button>
              </div>
              <div>
                <button onClick={capture}>Take Screenshot</button>
              </div>
            </div>
            <div className="imageList">
              {(imageList) ?
                imageList.map(item => (
                  <div className="img">
                    {<Image src={item.pahImage} width={300} height={300} />}
                    <p>{formatTimestamp(item.timeCreate)}</p>
                  </div>
                ))
                : null}
            </div>
            <div className="d-none">
              <canvas ref={canvasRef}></canvas>
            </div>
            
            {/*<button onClick={saveAsImage}>Save as Image</button>*/}
        </>
    );
}
