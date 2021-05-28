import "./styles.css";
import { useEffect, useRef, useState } from "react";
export default function App() {
  const [images, setimages] = useState([]);
  // const [index,setIndex]=useState(20);
  const index = useRef(20);
  const [element, setElement] = useState(null);
  const getImages = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/photos");
    const result = await res.json();
    setimages((prev) => [
      ...prev,
      ...result.slice(index.current, index.current + 20)
    ]);
  };
  //to check if pages end reached
  //IntersectionObeserver(callback,options)
  //callback-to trigger once reached end of element
  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        let first = entries[0];
        if (first.isIntersecting) {
          console.log("hi");
          getImages();
        }
      },
      { threshold: 1 }
    )
  );
  useEffect(() => {
    const getImages = async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/photos");
      const result = await res.json();
      setimages(result.slice(0, index.current));
    };
    getImages();
  }, []);
  useEffect(() => {
    index.current += 20;
  }, [images]);
  //to keep track of element so that oberver can be assigned to element
  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;
    if (currentElement) {
      currentObserver.observe(currentElement);
    }
    return () => {
      if (currentElement) currentObserver.unobserve(currentElement);
    };
  }, [element]);

  return (
    <div className="App">
      <div className="gallery">
        {images.map((elem) => {
          return (
            <div ref={setElement} className="card">
              <div>{elem.title}</div>
              <img src={elem.url} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
