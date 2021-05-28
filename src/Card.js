import styles from "./styles.css";
import React, { useEffect, useState, useRef } from "react";
const useLazyMediaLoad = (media) => {
  const [url, setUrl] = useState(null);
  const targetRef = useRef(null);

  useEffect(() => {
    if (!IntersectionObserver) {
      thumbLoader(media).then(setUrl);
    } else if (targetRef.current) {
      let observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              thumbLoader(media).then(setUrl);
              observer = observer.disconnect();
            }
          }),
        { rootMargin: "0px 0px 200px 0px" }
      );
      observer.observe(targetRef.current);

      return () => (observer = observer && observer.disconnect());
    }
  }, [media]);

  return [url, targetRef];
};

const Card = ({ exercise }) => {
  const [url, targetRef] = useLazyMediaLoad(exercise.media);

  return (
    <div
      css={styles.thumb}
      style={{ backgroundImage: url ? `url(${url})` : MISSING_VIDEO }}
      ref={targetRef}
    />
  );
};
