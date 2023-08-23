'use client'
import {useRef, useState} from "react";
import Image from "next/image";
interface ImageItem {
  pathImage: string;
  timeCreate: number;
  base64Data: string;
}

export default function Home() {
    const videoInputRef = useRef<HTMLInputElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [imageList, setImageList] = useState<ImageItem[]>([]);
  
  
    const capture = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!canvas || !video) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return; // This checks if ctx is null and returns early if it is
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      saveAsImage()
    };
  
    const saveAsImage = async () => {
      const canvas = canvasRef.current;
      
      if (!canvas) return;
      
      const dataURL = canvas.toDataURL('image/png');
      
      try {
        const response = await fetch('/api/save-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataURL }),
        });
        
        const result = await response.json();
        setImageList((prevImageList) => [...prevImageList, result])
     
        alert('Image saved successfully!');
      } catch (error) {
        alert('Failed to save the image.');
      }
    };
  
    const handleFileChange = () => {
      const files = videoInputRef.current?.files;
      
      if (files && files.length > 0) {
        const file = files[0];
        const videoURL = URL.createObjectURL(file);
        videoRef.current!.src = videoURL;  // The '!' asserts that videoRef.current is non-null.
        playVideo();
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
  
    const formatTimestamp = (timestamp: number) => {
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
              <input type="file" accept="video/*" ref={videoInputRef} onChange={handleFileChange} />
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
              {imageList.length > 0 &&
                imageList.map((item, index) => (
                  <div className="img" key={index}>
                    <Image src={item.base64Data} width={500} height={500} alt={item.pathImage} />
                    <p>{formatTimestamp(item.timeCreate)}</p>
                  </div>
                ))}
            </div>
            <div className="d-none">
              <canvas ref={canvasRef}></canvas>
            </div>
            
            {/*<button onClick={saveAsImage}>Save as Image</button>*/}
        </>
    );
}
