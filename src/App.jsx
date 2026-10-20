import { useEffect, useRef, useState, startTransition, ViewTransition, addTransitionType, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, incrementByAmount } from "./store/counterSlice";
import img1 from "./assets/img/img1.jpg";
import img2 from "./assets/img/img2.jpg";
import img3 from "./assets/img/img3.jpg";
import img4 from "./assets/img/img4.jpg";

function App() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(0);
  const [showItem, setShowItem] = useState(false);
  const [selected, setSelected] = useState(0);
  const imageRef = useRef(null);
  const restoreImageFocus = useRef(false);

  const images = [
    { id: 1, src: img1, name: "image 1" },
    { id: 2, src: img2, name: "image 2" },
    { id: 3, src: img3, name: "image 3" },
    { id: 4, src: img4, name: "image 4" }
  ];

  const image = images[selected];

  useEffect(() => {
    if (restoreImageFocus.current) {
      imageRef.current?.focus();
      restoreImageFocus.current = false;
    }
  }, [selected]);

  function nextImage() {
     startTransition(() => {
              addTransitionType('next');
              setSelected(c => c < images.length - 1 ? c + 1 : 0);
            });
  }

  function previousImage() {

            startTransition(() => {
              addTransitionType('previous');
              setSelected(c => c > 0 ? c - 1 : images.length - 1 )
            });
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      restoreImageFocus.current = true;
      nextImage();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      restoreImageFocus.current = true;
      previousImage();
    }
  } 

  function TimeZone(){
    const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (
      <div style={{paddingTop: "10px"}}>
        <p>Time Zone: {timeZone}</p>
      </div>
    )
  }

  function goToImage(index) {
  if (index === selected) return;

  startTransition(() => {
    addTransitionType(index > selected ? "next" : "previous");
    setSelected(index);
  });
}


  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <h1>Counter: {count}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => dispatch(increment())}>Increment</button>
          <br />
          <button onClick={() => dispatch(decrement())}>Decrement</button>
        </div>

        <br />
        <br />
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
          />
          <button onClick={() => dispatch(incrementByAmount(inputValue))}>
            Add Amount
          </button>
        </div>

        <div className="test-transition" style={{paddingTop: "10px"}}>
        <button onClick={
          ()=>{ 
            startTransition(()=>{ setShowItem((prev) => !prev) }) 
            }}>
              {showItem ? '-' : '+'}
            </button>

            {showItem && (
              <ViewTransition>
                <p>Item content</p>
              </ViewTransition>
            )}

      </div>
      <div className="test-slider" style={{paddingTop: "10px"}}>

        
        <ViewTransition 
        key={image.id} 
        enter={{'next':'from-right', 'previous':'from-left'}} 
        exit={{'next':'to-left', 'previous':'to-right'}}>
          
          <div >
            <img 
            src={image.src} 
            alt={image.name} 
            style={{width: "400px",height: "300px", objectFit: "cover"}}
            tabIndex={0}
            ref={imageRef}
            onKeyDown={(e) => {
              handleKeyDown(e);
            }}
            />
          </div>
          <div className="image-pagination" role="group" aria-label="Choose an image">
        {images.map((item, index) => (
          <button
            key={item.id}
            className="image-dot"
            type="button"
            aria-label={`Show image ${index + 1}`}
            aria-pressed={selected === index}
            onClick={() => goToImage(index)}
          />
        ))}
      </div>
        </ViewTransition>
        <div className="btn" style={{
          display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", paddingTop: "10px"}}>
        <button
          onClick={() => {
            previousImage()
          }} aria-label="Previous Image">
          ⬅️
        </button>

        <button
          onClick={() => {
              nextImage()
            }
          } aria-label="Next Image">
          ➡️
        </button>
        </div>
      </div>
      <div className="test-timezone" style={{paddingTop: "10px"}}>
        <p>Your current time zone is:</p>
          <Suspense fallback="Loading...">
            <TimeZone />
          </Suspense>
      </div>
      </div>

      
    </>
  );
}

export default App;
